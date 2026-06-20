<?php

return [
    'hmac_secret' => env('TELEGRAM_INGESTION_HMAC_SECRET', 'change-me'),
    'allowed_ips' => array_filter(explode(',', env('TELEGRAM_INGESTION_ALLOWED_IPS', '127.0.0.1,host.docker.internal'))),
    'default_tax_rule_id' => (int) env('TELEGRAM_INGESTION_DEFAULT_TAX_RULE_ID', 1),
    'default_shipping_rule_id' => (int) env('TELEGRAM_INGESTION_DEFAULT_SHIPPING_RULE_ID', 1),
    'default_unit' => env('TELEGRAM_INGESTION_DEFAULT_UNIT', 'piece'),
    'draft_status' => 2,
    'published_status' => 1,
];
