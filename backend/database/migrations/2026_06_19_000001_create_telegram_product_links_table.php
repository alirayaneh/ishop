<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('telegram_product_links', function (Blueprint $table) {
            $table->id();
            $table->string('idempotency_key')->unique();
            $table->unsignedBigInteger('vendor_id')->index();
            $table->string('telegram_channel_id', 128)->index();
            $table->unsignedBigInteger('telegram_message_id')->index();
            $table->unsignedBigInteger('post_version_id')->nullable();
            $table->unsignedBigInteger('product_id')->nullable()->index();
            $table->string('status', 32)->default('draft');
            $table->decimal('confidence', 5, 2)->default(0);
            $table->json('payload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('telegram_product_links');
    }
};
