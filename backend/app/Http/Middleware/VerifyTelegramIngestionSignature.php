<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyTelegramIngestionSignature
{
    public function handle(Request $request, Closure $next): Response
    {
        $secret = config('telegram-ingestion.hmac_secret');
        $timestamp = $request->header('X-Timestamp');
        $signature = $request->header('X-Signature');

        if (!$secret || !$timestamp || !$signature) {
            return response()->json(['status' => 401, 'message' => 'Missing auth headers'], 401);
        }

        if (abs(time() - (int) $timestamp) > 300) {
            return response()->json(['status' => 401, 'message' => 'Timestamp expired'], 401);
        }

        $body = $request->getContent();
        $expected = hash_hmac('sha256', $timestamp . '.' . $body, $secret);

        if (!hash_equals($expected, $signature)) {
            return response()->json(['status' => 401, 'message' => 'Invalid signature'], 401);
        }

        return $next($request);
    }
}
