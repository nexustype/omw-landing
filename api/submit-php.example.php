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
    echo json_encode(['ok' => true]);
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
        'Subject: ' . $subject,
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
    return '=?UTF-8?B?' . base64_encode($name) . '?=';
}
