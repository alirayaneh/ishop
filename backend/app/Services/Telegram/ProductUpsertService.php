<?php

namespace App\Services\Telegram;

use App\Models\Helper\Utils;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\TelegramProductLink;
use App\Models\UpdatedInventory;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;

class ProductUpsertService
{
    public function upsert(array $payload): array
    {
        $key = $payload['idempotency_key'] ?? null;
        if ($key) {
            $existing = TelegramProductLink::where('idempotency_key', $key)->first();
            if ($existing && $existing->product_id) {
                return [
                    'product_id' => $existing->product_id,
                    'status' => $existing->status,
                    'idempotent' => true,
                ];
            }
        }

        $product = $this->findLinkedProduct($payload);
        $isNew = !$product;

        if ($isNew) {
            $product = $this->createProduct($payload);
        } else {
            $this->updateProduct($product, $payload);
        }

        $this->syncImages($product, $payload['images'] ?? []);
        $this->ensureInventory($product, $payload);

        $status = ($payload['status'] ?? 'draft') === 'ready' ? 'published' : 'draft';
        TelegramProductLink::updateOrCreate(
            ['idempotency_key' => $key ?: $this->fallbackKey($payload)],
            [
                'vendor_id' => $payload['vendor_id'],
                'telegram_channel_id' => (string) $payload['telegram_channel_id'],
                'telegram_message_id' => (int) $payload['telegram_message_id'],
                'post_version_id' => $payload['post_version_id'] ?? null,
                'product_id' => $product->id,
                'status' => $status,
                'confidence' => $payload['confidence'] ?? 0,
                'payload' => $payload,
            ]
        );

        return [
            'product_id' => $product->id,
            'status' => $status,
            'idempotent' => false,
        ];
    }

    public function markUnavailable(array $payload): array
    {
        $link = TelegramProductLink::where('telegram_channel_id', (string) $payload['telegram_channel_id'])
            ->where('telegram_message_id', (int) $payload['telegram_message_id'])
            ->first();

        if (!$link || !$link->product_id) {
            return ['updated' => false];
        }

        Product::where('id', $link->product_id)->update(['status' => 0]);
        $link->update(['status' => 'unavailable']);

        return ['updated' => true, 'product_id' => $link->product_id];
    }

    private function findLinkedProduct(array $payload): ?Product
    {
        $link = TelegramProductLink::where('telegram_channel_id', (string) $payload['telegram_channel_id'])
            ->where('telegram_message_id', (int) $payload['telegram_message_id'])
            ->whereNotNull('product_id')
            ->first();

        return $link ? Product::find($link->product_id) : null;
    }

    private function createProduct(array $payload): Product
    {
        $title = Str::limit($payload['title'] ?? 'Telegram Product', 250);
        $description = $payload['description'] ?? $title;
        $price = (float) ($payload['price'] ?? 0);
        if ($price <= 0) {
            $price = 1;
        }

        $slugBase = Str::slug($title) ?: 'telegram-product';
        $slug = $slugBase . '-' . ($payload['telegram_message_id'] ?? time());

        return Product::create([
            'id' => Utils::idGenerator(new Product()),
            'title' => $title,
            'slug' => $slug,
            'description' => $description,
            'overview' => $description,
            'meta_title' => $title,
            'meta_description' => Str::limit(strip_tags($description), 250),
            'meta_keywords' => 'telegram,import',
            'selling' => $price,
            'purchased' => $price,
            'offered' => $price,
            'unit' => config('telegram-ingestion.default_unit'),
            'tax_rule_id' => config('telegram-ingestion.default_tax_rule_id'),
            'shipping_rule_id' => config('telegram-ingestion.default_shipping_rule_id'),
            'admin_id' => (int) $payload['vendor_id'],
            'status' => ($payload['status'] ?? 'draft') === 'ready'
                ? config('telegram-ingestion.published_status')
                : config('telegram-ingestion.draft_status'),
            'image' => Config::get('constants.media.DEFAULT_IMAGE'),
            'refundable' => 0,
        ]);
    }

    private function updateProduct(Product $product, array $payload): void
    {
        $title = Str::limit($payload['title'] ?? $product->title, 250);
        $description = $payload['description'] ?? $product->description;
        $price = (float) ($payload['price'] ?? $product->selling);
        if ($price <= 0) {
            $price = $product->selling ?: 1;
        }

        $product->update([
            'title' => $title,
            'description' => $description,
            'overview' => $description,
            'meta_title' => $title,
            'meta_description' => Str::limit(strip_tags($description), 250),
            'selling' => $price,
            'purchased' => $price,
            'offered' => $price,
            'status' => ($payload['status'] ?? 'draft') === 'ready'
                ? config('telegram-ingestion.published_status')
                : config('telegram-ingestion.draft_status'),
        ]);
    }

    private function syncImages(Product $product, array $images): void
    {
        if (empty($images)) {
            return;
        }

        ProductImage::where('product_id', $product->id)->delete();
        foreach ($images as $index => $image) {
            $url = is_array($image) ? ($image['url'] ?? null) : $image;
            if (!$url) {
                continue;
            }
            ProductImage::create([
                'product_id' => $product->id,
                'image' => $url,
            ]);
        }
    }

    private function ensureInventory(Product $product, array $payload): void
    {
        $inventory = UpdatedInventory::where('product_id', $product->id)->first();
        if ($inventory) {
            return;
        }

        UpdatedInventory::create([
            'product_id' => $product->id,
            'quantity' => 1,
            'price' => $product->selling,
        ]);
    }

    private function fallbackKey(array $payload): string
    {
        return sprintf(
            'tg:%s:%s:v%s',
            $payload['telegram_channel_id'] ?? 'unknown',
            $payload['telegram_message_id'] ?? 0,
            $payload['post_version_id'] ?? 0
        );
    }
}
