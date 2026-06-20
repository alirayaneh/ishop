<?php

namespace App\Http\Controllers\Internal;

use App\Http\Controllers\Controller;
use App\Models\Helper\Response;
use App\Services\Telegram\ProductUpsertService;
use Illuminate\Http\Request;

class TelegramProductController extends Controller
{
    public function __construct(private ProductUpsertService $service)
    {
    }

    public function upsert(Request $request)
    {
        try {
            $payload = $request->validate([
                'vendor_id' => 'required|integer|min:1',
                'telegram_channel_id' => 'required|string',
                'telegram_message_id' => 'required|integer|min:1',
                'post_version_id' => 'nullable|integer',
                'title' => 'required|string|max:512',
                'description' => 'nullable|string',
                'price' => 'nullable|numeric|min:0',
                'currency' => 'nullable|string|max:8',
                'images' => 'nullable|array',
                'attributes' => 'nullable|array',
                'status' => 'nullable|string|in:draft,ready,synced',
                'confidence' => 'nullable|numeric|min:0|max:1',
                'idempotency_key' => 'nullable|string|max:256',
            ]);

            $result = $this->service->upsert($payload);

            return response()->json(new Response('', $result, 200, 'Product synced'));
        } catch (\Throwable $e) {
            return response()->json(new Response('', null, 500, $e->getMessage()), 500);
        }
    }

    public function updateFromPost(Request $request)
    {
        return $this->upsert($request);
    }

    public function markUnavailable(Request $request)
    {
        try {
            $payload = $request->validate([
                'telegram_channel_id' => 'required|string',
                'telegram_message_id' => 'required|integer|min:1',
            ]);

            $result = $this->service->markUnavailable($payload);

            return response()->json(new Response('', $result, 200, 'Product marked unavailable'));
        } catch (\Throwable $e) {
            return response()->json(new Response('', null, 500, $e->getMessage()), 500);
        }
    }
}
