<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$config = require __DIR__ . '/mail-config.php';

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = $config['allowed_origins'] ?? [];
if (!empty($allowedOrigins) && $origin && !in_array($origin, $allowedOrigins, true)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Origin not allowed']);
    exit;
}

$honeypot = trim((string)($_POST['company'] ?? ''));
if ($honeypot !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$formType = trim((string)($_POST['form_type'] ?? ''));
$senderEmail = trim((string)($_POST['email'] ?? ''));

$subject = 'OMW form submission';
if ($formType !== '') {
    $subject .= ' — ' . $formType;
}

$lines = [];
foreach ($_POST as $key => $value) {
    if ($key === 'company') {
        continue;
    }
    if (is_array($value)) {
        continue;
    }
    $cleanValue = trim((string)$value);
    if ($cleanValue === '') {
        continue;
    }
    $cleanKey = preg_replace('/[^a-zA-Z0-9_\- ]+/', '', (string)$key);
    $cleanValue = str_replace(["\r", "\n"], ' ', $cleanValue);
    $lines[] = $cleanKey . ': ' . $cleanValue;
}

$body = implode("\n", $lines);

$fromEmail = (string)($config['from_email'] ?? 'hello@rideomw.com');
$fromName = (string)($config['from_name'] ?? 'OMW');
$toEmail = (string)($config['to_email'] ?? $fromEmail);
$replyTo = filter_var($senderEmail, FILTER_VALIDATE_EMAIL) ? $senderEmail : $fromEmail;

try {
    smtp_send($config, $toEmail, $subject, $body, $fromEmail, $fromName, $replyTo);

    $autoReplySent = false;
    $autoReply = build_auto_reply($_POST);
    if ($autoReply !== null) {
        try {
            smtp_send(
                $config,
                $autoReply['to'],
                $autoReply['subject'],
                $autoReply['body'],
                $fromEmail,
                $fromName,
                $fromEmail
            );
            $autoReplySent = true;
        } catch (RuntimeException $err) {
            error_log('OMW auto-reply failed: ' . $err->getMessage());
        }
    }

    echo json_encode(['ok' => true, 'autoReplySent' => $autoReplySent]);
} catch (RuntimeException $err) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $err->getMessage()]);
}

function smtp_send(
    array $config,
    string $to,
    string $subject,
    string $body,
    string $fromEmail,
    string $fromName,
    string $replyTo
): void {
    $host = (string)($config['host'] ?? '');
    $port = (int)($config['port'] ?? 0);
    $encryption = strtolower((string)($config['encryption'] ?? ''));
    $username = (string)($config['username'] ?? '');
    $password = (string)($config['password'] ?? '');
    $ehloHost = (string)($config['ehlo_host'] ?? 'localhost');

    if ($host === '' || $port === 0 || $username === '' || $password === '') {
        throw new RuntimeException('SMTP is not configured.');
    }

    $transportHost = $host;
    if ($encryption === 'ssl') {
        $transportHost = 'ssl://' . $host;
    }

    $socket = fsockopen($transportHost, $port, $errno, $errstr, 10);
    if (!$socket) {
        throw new RuntimeException('SMTP connection failed: ' . $errstr . ' (' . $errno . ')');
    }

    smtp_expect($socket, 220);
    smtp_command($socket, 'EHLO ' . $ehloHost, 250);

    if ($encryption === 'tls') {
        smtp_command($socket, 'STARTTLS', 220);
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new RuntimeException('Unable to start TLS.');
        }
        smtp_command($socket, 'EHLO ' . $ehloHost, 250);
    }

    smtp_command($socket, 'AUTH LOGIN', 334);
    smtp_command($socket, base64_encode($username), 334);
    smtp_command($socket, base64_encode($password), 235);

    smtp_command($socket, 'MAIL FROM:<' . $fromEmail . '>', [250]);
    smtp_command($socket, 'RCPT TO:<' . $to . '>', [250, 251]);
    smtp_command($socket, 'DATA', 354);

    $encodedFromName = smtp_encode_name($fromName);
    $headers = [
        'From: ' . $encodedFromName . ' <' . $fromEmail . '>',
        'Reply-To: ' . $replyTo,
        'To: ' . $to,
        'Subject: ' . smtp_encode_header($subject),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];

    $message = implode("\r\n", $headers) . "\r\n\r\n" . $body;
    $message = str_replace("\r\n.\r\n", "\r\n..\r\n", $message);

    fwrite($socket, $message . "\r\n.\r\n");
    smtp_expect($socket, 250);
    smtp_command($socket, 'QUIT', 221);
    fclose($socket);
}

function smtp_command($socket, string $command, $expectedCodes): void {
    fwrite($socket, $command . "\r\n");
    smtp_expect($socket, $expectedCodes, $command);
}

function smtp_expect($socket, $expectedCodes, string $context = ''): void {
    $response = smtp_read($socket);
    $code = (int)substr($response, 0, 3);
    $expected = is_array($expectedCodes) ? $expectedCodes : [$expectedCodes];
    if (!in_array($code, $expected, true)) {
        $message = 'SMTP error: ' . trim($response);
        if ($context !== '') {
            $message .= ' (during ' . $context . ')';
        }
        throw new RuntimeException($message);
    }
}

function smtp_read($socket): string {
    $data = '';
    while (($line = fgets($socket, 515)) !== false) {
        $data .= $line;
        if (strlen($line) >= 4 && $line[3] === ' ') {
            break;
        }
    }
    return $data;
}

function smtp_encode_name(string $name): string {
    if ($name === '') {
        return $name;
    }
    return smtp_encode_header($name);
}

function smtp_encode_header(string $value): string {
    if ($value === '') {
        return $value;
    }
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function build_auto_reply(array $payload): ?array {
    $senderEmail = trim((string)($payload['email'] ?? ''));
    if (!filter_var($senderEmail, FILTER_VALIDATE_EMAIL)) {
        return null;
    }

    $locale = resolve_locale($payload);
    $firstName = extract_first_name((string)($payload['name'] ?? ''));
    $greeting = $firstName !== ''
        ? ($locale === 'fr' ? 'Bonjour ' . $firstName . ',' : 'Hi ' . $firstName . ',')
        : ($locale === 'fr' ? 'Bonjour,' : 'Hi,');

    if ($locale === 'fr') {
        return [
            'to' => $senderEmail,
            'subject' => 'Merci — ton retour aide à façonner OMW',
            'body' => implode("\n", [
                $greeting,
                '',
                "Merci d'avoir partagé tes informations.",
                '',
                "OMW en est encore à ses débuts, et c'est précisément pour ça que ton retour compte. On ne lance pas une application publique parfaitement aboutie demain : on construit avec soin autour de vrais problèmes de mobilité, une étape après l'autre.",
                '',
                "Des réponses comme la tienne nous aident à comprendre où le besoin est le plus fort, ce que les gens attendent vraiment d'un service comme celui-ci, et comment préparer un premier pilote vraiment utile.",
                '',
                "Tu auras peut-être de nos nouvelles plus tard pour une mise à jour pertinente, une courte demande de feedback, ou un accès anticipé aux premiers tests quand nous serons prêts. D'ici là, merci de faire partie du tout début.",
                '',
                '— Daniel',
                'Fondateur, OMW',
            ]),
        ];
    }

    return [
        'to' => $senderEmail,
        'subject' => 'Thanks — your input helps shape OMW',
        'body' => implode("\n", [
            $greeting,
            '',
            'Thanks for sharing your details.',
            '',
            "OMW is still in an early stage, and that's exactly why your input matters. We're not launching a polished public app tomorrow — we're building carefully around real-world mobility problems, one step at a time.",
            '',
            'Responses like yours help us understand where the strongest need is, what people actually expect from a service like this, and how to prepare the first meaningful pilot.',
            '',
            "You may hear from us later for a relevant update, a quick feedback request, or early testing access when we're ready. Until then, thanks for being part of the very beginning.",
            '',
            '— Daniel',
            'Founder, OMW',
        ]),
    ];
}

function resolve_locale(array $payload): string {
    $localeCandidate = strtolower(trim((string)($payload['locale'] ?? $payload['lang'] ?? $payload['language'] ?? '')));
    if (strpos($localeCandidate, 'fr') === 0) {
        return 'fr';
    }
    if (strpos($localeCandidate, 'en') === 0) {
        return 'en';
    }

    $formType = strtolower(trim((string)($payload['form_type'] ?? '')));
    if (strpos($formType, '(fr)') !== false || preg_match('/\bfr\b/i', $formType) === 1) {
        return 'fr';
    }

    return 'en';
}

function extract_first_name(string $name): string {
    $normalized = trim((string)preg_replace('/\s+/u', ' ', trim($name)));
    if ($normalized === '') {
        return '';
    }

    $parts = explode(' ', $normalized);
    $firstChunk = $parts[0] ?? '';
    return (string)preg_replace("/^[^\p{L}\p{N}'-]+|[^\p{L}\p{N}'-]+$/u", '', $firstChunk);
}
