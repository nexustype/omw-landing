<?php

declare(strict_types=1);

// Replace these placeholder banner URLs with your hosted email-safe image URLs.
const ENGLISH_BANNER_URL = 'https://YOUR-DOMAIN.com/path/to/omw-banner-en.png';
const FRENCH_BANNER_URL = 'https://YOUR-DOMAIN.com/path/to/omw-banner-fr.png';

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
    $lang = resolve_locale($_POST);
    $firstName = extract_first_name((string)($_POST['name'] ?? ''));
    $autoReply = filter_var($senderEmail, FILTER_VALIDATE_EMAIL)
        ? get_auto_reply_email([
            'firstName' => $firstName,
            'lang' => $lang,
        ])
        : null;
    if ($autoReply !== null) {
        try {
            smtp_send(
                $config,
                $senderEmail,
                $autoReply['subject'],
                $autoReply['text'],
                $fromEmail,
                $fromName,
                $fromEmail,
                $autoReply['html']
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
    string $textBody,
    string $fromEmail,
    string $fromName,
    string $replyTo,
    ?string $htmlBody = null
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
    ];

    if ($htmlBody !== null && $htmlBody !== '') {
        $boundary = 'omw_' . md5(uniqid((string)mt_rand(), true));
        $headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';

        $messageBody = [];
        $messageBody[] = '--' . $boundary;
        $messageBody[] = 'Content-Type: text/plain; charset=UTF-8';
        $messageBody[] = 'Content-Transfer-Encoding: base64';
        $messageBody[] = '';
        $messageBody[] = chunk_split(base64_encode($textBody), 76, "\r\n");
        $messageBody[] = '--' . $boundary;
        $messageBody[] = 'Content-Type: text/html; charset=UTF-8';
        $messageBody[] = 'Content-Transfer-Encoding: base64';
        $messageBody[] = '';
        $messageBody[] = chunk_split(base64_encode($htmlBody), 76, "\r\n");
        $messageBody[] = '--' . $boundary . '--';

        $message = implode("\r\n", $headers) . "\r\n\r\n" . implode("\r\n", $messageBody);
    } else {
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';
        $headers[] = 'Content-Transfer-Encoding: 8bit';
        $message = implode("\r\n", $headers) . "\r\n\r\n" . $textBody;
    }

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

function get_auto_reply_email(array $options): array {
    $lang = (string)($options['lang'] ?? 'en');
    $locale = $lang === 'fr' ? 'fr' : 'en';
    $firstName = trim((string)($options['firstName'] ?? ''));

    if ($locale === 'fr') {
        $content = [
            'subject' => 'Merci pour votre contribution — OMW',
            'bannerUrl' => FRENCH_BANNER_URL,
            'bannerAlt' => 'OMW — Premier contributeur',
            'headline' => 'Merci d’être là dès le début',
            'bodyLines' => [
                'Votre contribution nous aide à construire OMW à partir de vrais besoins de mobilité, pas d’hypothèses.',
                'OMW est encore en phase de développement, et des retours comme le vôtre aident à préparer les premiers tests.',
            ],
            'signoffLines' => ['— Daniel', 'OMW'],
        ];
    } else {
        $content = [
            'subject' => 'Thanks for your input — OMW',
            'bannerUrl' => ENGLISH_BANNER_URL,
            'bannerAlt' => 'OMW — Early contributor',
            'headline' => 'Thanks for being early',
            'bodyLines' => [
                'Your input helps us build OMW around real commuting needs, not assumptions.',
                'We’re still in early development, and responses like yours help shape the first pilots.',
            ],
            'signoffLines' => ['— Daniel', 'OMW'],
        ];
    }

    $greeting = '';
    if ($firstName !== '') {
        $greeting = $locale === 'fr' ? 'Bonjour ' . $firstName . ',' : 'Hi ' . $firstName . ',';
    }

    $textLines = [];
    if ($greeting !== '') {
        $textLines[] = $greeting;
        $textLines[] = '';
    }
    $textLines[] = $content['headline'] . '.';
    $textLines[] = '';
    foreach ($content['bodyLines'] as $line) {
        $textLines[] = $line;
    }
    $textLines[] = '';
    foreach ($content['signoffLines'] as $line) {
        $textLines[] = $line;
    }

    return [
        'subject' => $content['subject'],
        'text' => implode("\n", $textLines),
        'html' => build_auto_reply_html([
            'lang' => $locale,
            'bannerUrl' => $content['bannerUrl'],
            'bannerAlt' => $content['bannerAlt'],
            'greeting' => $greeting,
            'headline' => $content['headline'],
            'bodyLines' => $content['bodyLines'],
            'signoffLines' => $content['signoffLines'],
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

function build_auto_reply_html(array $content): string {
    $lang = (string)($content['lang'] ?? 'en');
    $bannerUrl = (string)($content['bannerUrl'] ?? '');
    $bannerAlt = (string)($content['bannerAlt'] ?? '');
    $greeting = (string)($content['greeting'] ?? '');
    $headline = (string)($content['headline'] ?? '');
    $bodyLines = is_array($content['bodyLines'] ?? null) ? $content['bodyLines'] : [];
    $signoffLines = is_array($content['signoffLines'] ?? null) ? $content['signoffLines'] : [];

    $greetingHtml = '';
    if ($greeting !== '') {
        $greetingHtml = '<p style="margin: 0 0 18px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 24px; color: #24405f;">' . escape_html($greeting) . '</p>';
    }

    $bodyHtml = '';
    foreach ($bodyLines as $line) {
        $bodyHtml .= '<p style="margin: 0 0 12px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 26px; color: #4d637b;">' . escape_html((string)$line) . '</p>';
    }

    $escapedSignoff = array_map(
        static fn($line): string => escape_html((string)$line),
        $signoffLines
    );
    $signoffHtml = implode('<br />', $escapedSignoff);

    return implode("\n", [
        '<!doctype html>',
        '<html lang="' . escape_html($lang) . '">',
        '<head>',
        '  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />',
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        '  <title>OMW</title>',
        '</head>',
        '<body style="margin: 0; padding: 0; background-color: #f3f7fb;">',
        '  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse; background-color: #f3f7fb;">',
        '    <tr>',
        '      <td align="center" style="padding: 24px 12px;">',
        '        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: separate;">',
        '          <tr>',
        '            <td style="background-color: #ffffff; border: 1px solid #e4edf6; border-radius: 24px; overflow: hidden;">',
        '              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: separate;">',
        '                <tr>',
        '                  <td style="background-color: #eef5fb; padding: 0;">',
        '                    <img src="' . escape_html($bannerUrl) . '" alt="' . escape_html($bannerAlt) . '" width="600" style="display: block; width: 100%; max-width: 600px; height: auto; border: 0; background-color: #eef5fb; font-family: Arial, Helvetica, sans-serif; font-size: 18px; line-height: 26px; color: #24405f;" />',
        '                  </td>',
        '                </tr>',
        '                <tr>',
        '                  <td style="padding: 36px 40px 40px;">',
        '                    ' . $greetingHtml,
        '                    <h1 style="margin: 0 0 18px; font-family: Arial, Helvetica, sans-serif; font-size: 30px; line-height: 36px; font-weight: 700; color: #1f3554;">' . escape_html($headline) . '</h1>',
        '                    ' . $bodyHtml,
        '                    <p style="margin: 24px 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 24px; color: #24405f;">' . $signoffHtml . '</p>',
        '                  </td>',
        '                </tr>',
        '              </table>',
        '            </td>',
        '          </tr>',
        '        </table>',
        '      </td>',
        '    </tr>',
        '  </table>',
        '</body>',
        '</html>',
    ]);
}

function escape_html(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
