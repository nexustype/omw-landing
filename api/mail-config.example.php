<?php

declare(strict_types=1);

return [
    // Copy these settings from Hostinger Email > Configuration (SMTP).
    // Do not commit real passwords.
    'host' => 'smtp.hostinger.com',
    'port' => 587,
    // Use: 'ssl', 'tls', or 'none'.
    'encryption' => 'tls',
    'username' => 'hello@rideomw.com',
    'password' => 'REPLACE_WITH_MAILBOX_PASSWORD',

    // Envelope + headers.
    'to_email' => 'hello@rideomw.com',
    'from_email' => 'hello@rideomw.com',
    'from_name' => 'OMW',

    // Optional: lock requests to your site origins.
    // Example: ['https://rideomw.com', 'https://www.rideomw.com']
    'allowed_origins' => [],

    // Used in EHLO; keep a real hostname.
    'ehlo_host' => 'rideomw.com',
];
