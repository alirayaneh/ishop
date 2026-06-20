<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TelegramProductLink extends Model
{
    protected $fillable = [
        'idempotency_key',
        'vendor_id',
        'telegram_channel_id',
        'telegram_message_id',
        'post_version_id',
        'product_id',
        'status',
        'confidence',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
        'confidence' => 'float',
    ];
}
