<?php

use Illuminate\Support\Facades\Route;

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$rules = [
    'admin_login' => [
        'required' => ['email', 'password'],
        'properties' => [
            'email' => ['type' => 'string', 'format' => 'email'],
            'password' => ['type' => 'string', 'minLength' => 6],
        ],
    ],
    'admin_signup' => [
        'required' => ['username', 'email', 'password'],
        'properties' => [
            'username' => ['type' => 'string'],
            'email' => ['type' => 'string', 'format' => 'email'],
            'password' => ['type' => 'string', 'minLength' => 6],
            'name' => ['type' => 'string'],
            'phone' => ['type' => 'string'],
        ],
    ],
    'verifyCode' => [
        'required' => ['email', 'code', 'password'],
        'properties' => [
            'email' => ['type' => 'string', 'format' => 'email'],
            'code' => ['type' => 'string'],
            'password' => ['type' => 'string', 'minLength' => 6],
        ],
    ],
    'forgotPassword' => [
        'required' => ['email'],
        'properties' => ['email' => ['type' => 'string', 'format' => 'email']],
    ],
    'admin_password' => [
        'required' => ['password', 'new_password'],
        'properties' => [
            'password' => ['type' => 'string', 'minLength' => 6],
            'new_password' => ['type' => 'string', 'minLength' => 6],
        ],
    ],
    'admin' => [
        'required' => ['username', 'roles', 'email'],
        'properties' => [
            'username' => ['type' => 'string'],
            'roles' => ['type' => 'array', 'items' => ['type' => 'string']],
            'email' => ['type' => 'string', 'format' => 'email'],
            'name' => ['type' => 'string'],
            'password' => ['type' => 'string', 'minLength' => 6],
            'active' => ['type' => 'boolean'],
            'verified' => ['type' => 'boolean'],
            'commission' => ['type' => 'number'],
        ],
    ],
    'role' => ['required' => ['name'], 'properties' => ['name' => ['type' => 'string'], 'permissions' => ['type' => 'array', 'items' => ['type' => 'string']]]],
    'category' => ['required' => ['title', 'slug', 'meta_title', 'meta_description'], 'properties' => stringProps(['title', 'slug', 'meta_title', 'meta_description', 'meta_keywords']) + ['status' => ['type' => 'integer']]],
    'subCategory' => ['required' => ['title', 'category_id', 'slug', 'meta_title', 'meta_description'], 'properties' => stringProps(['title', 'slug', 'meta_title', 'meta_description', 'meta_keywords']) + ['category_id' => intProp(), 'status' => intProp(), 'featured' => boolProp()]],
    'brand' => ['required' => ['title', 'slug'], 'properties' => stringProps(['title', 'slug']) + ['status' => intProp(), 'featured' => boolProp()]],
    'productMain' => [
        'required' => ['title', 'unit', 'meta_title', 'meta_description', 'description', 'overview', 'selling', 'purchased', 'tax_rule_id', 'shipping_rule_id'],
        'properties' => stringProps(['title', 'unit', 'meta_title', 'meta_description', 'meta_keywords', 'description', 'overview', 'badge', 'video', 'warranty']) + [
            'selling' => numProp(), 'purchased' => numProp(), 'offered' => numProp(),
            'tax_rule_id' => intProp(), 'shipping_rule_id' => intProp(), 'category_id' => intProp(),
            'subcategory_id' => intProp(), 'brand_id' => intProp(), 'bundle_deal_id' => intProp(),
            'status' => intProp(), 'refundable' => boolProp(),
        ],
    ],
    'attribute' => ['required' => ['title'], 'properties' => stringProps(['title'])],
    'tag' => ['required' => ['title'], 'properties' => stringProps(['title'])],
    'cart' => ['required' => ['product_id', 'inventory_id', 'quantity'], 'properties' => ['product_id' => intProp(), 'inventory_id' => intProp(), 'quantity' => intProp(), 'user_id' => intProp(), 'selected' => boolProp()]],
    'shippingCart' => ['required' => ['cart'], 'properties' => ['cart' => ['type' => 'array', 'items' => ['type' => 'object']]]],
    'updatedInventory' => ['required' => ['inventories'], 'properties' => ['inventories' => ['type' => 'array', 'items' => ['type' => 'object']]]],
    'address' => ['required' => ['address_1', 'city', 'state', 'zip', 'country'], 'properties' => stringProps(['address_1', 'address_2', 'city', 'state', 'zip', 'country'])],
    'currency' => ['required' => ['currency', 'currency_icon', 'currency_position'], 'properties' => stringProps(['currency', 'currency_icon', 'currency_position'])],
    'analytics' => ['required' => ['enable_ga', 'enable_pixel'], 'properties' => ['enable_ga' => boolProp(), 'enable_pixel' => boolProp(), 'ga_id' => ['type' => 'string'], 'pixel_id' => ['type' => 'string']]],
    'miscellaneous' => ['required' => ['attach_pdf', 'send_seller_email', 'cookie_banner', 'vendor_registration', 'guest_checkout'], 'properties' => ['attach_pdf' => boolProp(), 'send_seller_email' => boolProp(), 'cookie_banner' => boolProp(), 'vendor_registration' => boolProp(), 'guest_checkout' => boolProp(), 'translate_pdf' => boolProp()]],
    'siteSetting' => ['required' => ['site_name', 'meta_title', 'meta_description'], 'properties' => stringProps(['site_name', 'meta_title', 'meta_description', 'meta_keywords', 'copyright_text'])],
    'store' => ['required' => ['name', 'slug'], 'properties' => stringProps(['name', 'slug', 'meta_title', 'meta_description', 'meta_keywords'])],
    'withdrawalAccount' => ['required' => ['account_number', 'account_name', 'bank_name', 'branch_name', 'title', 'default'], 'properties' => stringProps(['account_number', 'account_name', 'bank_name', 'branch_name', 'title']) + ['default' => boolProp()]],
    'withdrawal' => ['required' => ['amount'], 'properties' => ['amount' => numProp(), 'withdrawal_account_id' => intProp()]],
    'withdrawalCancel' => ['required' => ['id', 'message'], 'properties' => ['id' => intProp(), 'message' => ['type' => 'string']]],
    'withdrawalApprove' => ['required' => ['id'], 'properties' => ['id' => intProp(), 'message' => ['type' => 'string']]],
    'payment' => ['required' => ['cash_on_delivery'], 'properties' => ['cash_on_delivery' => boolProp(), 'paypal' => boolProp(), 'stripe' => boolProp(), 'razorpay' => boolProp(), 'flutterwave' => boolProp(), 'iyzico' => boolProp()]],
    'user_address' => ['required' => ['country', 'city', 'zip', 'address_1', 'email', 'name', 'phone'], 'properties' => stringProps(['country', 'city', 'zip', 'address_1', 'address_2', 'email', 'name', 'phone']) + ['user_id' => intProp()]],
    'sendSubscriptionEmail' => ['required' => ['id'], 'properties' => ['id' => intProp()]],
    'subscriptionEmail' => ['required' => ['title', 'subject', 'body'], 'properties' => stringProps(['title', 'subject', 'body'])],
    'contactUs' => ['required' => ['id'], 'properties' => ['id' => intProp(), 'replied' => boolProp(), 'reply' => ['type' => 'string']]],
    'page' => ['required' => ['title', 'slug', 'page_from_component', 'meta_title', 'meta_description'], 'properties' => stringProps(['title', 'slug', 'description', 'meta_title', 'meta_description', 'meta_keywords']) + ['page_from_component' => boolProp()]],
    'footerLink' => ['required' => ['page_id', 'type'], 'properties' => ['page_id' => intProp(), 'type' => intProp()]],
    'serviceAndAbout' => ['required' => ['service_links', 'about_links'], 'properties' => ['service_links' => ['type' => 'array', 'items' => ['type' => 'object']], 'about_links' => ['type' => 'array', 'items' => ['type' => 'object']]]],
    'footerImageLink' => ['required' => ['title', 'link', 'type'], 'properties' => stringProps(['title', 'link']) + ['type' => intProp(), 'status' => intProp()]],
    'homeSlider' => ['required' => ['source_type', 'type', 'slug', 'title'], 'properties' => stringProps(['slug', 'title', 'url', 'tags']) + ['source_type' => intProp(), 'type' => intProp(), 'status' => intProp()]],
    'banner' => ['required' => ['source_type', 'type', 'closable', 'slug', 'title'], 'properties' => stringProps(['slug', 'title', 'url']) + ['source_type' => intProp(), 'type' => intProp(), 'closable' => intProp(), 'status' => intProp()]],
    'flashSale' => ['required' => ['title', 'start_time', 'end_time', 'status'], 'properties' => ['title' => ['type' => 'string'], 'start_time' => ['type' => 'string'], 'end_time' => ['type' => 'string'], 'status' => intProp()]],
    'taxRules' => ['required' => ['title', 'type', 'price'], 'properties' => ['title' => ['type' => 'string'], 'type' => intProp(), 'price' => numProp()]],
    'voucherRules' => ['required' => ['title', 'code', 'type', 'price'], 'properties' => stringProps(['title', 'code']) + ['type' => intProp(), 'price' => numProp(), 'capped_price' => numProp(), 'min_spend' => numProp(), 'status' => intProp()]],
    'voucherValidity' => ['required' => ['voucher', 'price'], 'properties' => ['voucher' => ['type' => 'string'], 'price' => numProp()]],
    'bundleDeals' => ['required' => ['title', 'buy', 'free'], 'properties' => ['title' => ['type' => 'string'], 'buy' => intProp(), 'free' => intProp()]],
    'shippingRule' => ['required' => ['title', 'shipping_places'], 'properties' => ['title' => ['type' => 'string'], 'single_price' => numProp(), 'shipping_places' => ['type' => 'array', 'items' => ['type' => 'object']]]],
    'customScript' => ['required' => ['route_pattern'], 'properties' => stringProps(['route_pattern', 'script']) + ['status' => intProp()]],
    'orderStatus' => ['required' => ['id'], 'properties' => ['id' => intProp(), 'status' => intProp(), 'payment_status' => intProp(), 'payment_method' => ['type' => 'string']]],
    'language' => ['required' => ['name', 'code'], 'properties' => stringProps(['name', 'code', 'direction']) + ['status' => intProp(), 'default' => boolProp(), 'predefined' => boolProp()]],
    'siteFeature' => ['required' => ['detail'], 'properties' => stringProps(['detail', 'title']) + ['status' => intProp()]],
    'imageAttribute' => ['required' => ['product_image_id'], 'properties' => ['product_image_id' => intProp(), 'attribute_value_id' => intProp()]],
];

$routeRuleMap = [
    'login' => 'admin_login', 'signup' => 'admin_signup', 'forgot-password' => 'forgotPassword',
    'verify-code' => 'verifyCode', 'update' => 'admin_signup', 'update-password' => 'admin_password',
    'admin-data/action' => 'admin', 'role/action' => 'role', 'category/action' => 'category',
    'subcategory/action' => 'subCategory', 'brand/action' => 'brand', 'product/action' => 'productMain',
    'attribute/action' => 'attribute', 'tag/action' => 'tag', 'cart/action' => 'cart',
    'cart/update-shipping' => 'shippingCart', 'updated-inventory/action' => 'updatedInventory',
    'setting/address' => 'address', 'setting/currency' => 'currency', 'setting/analytics' => 'analytics',
    'setting/miscellaneous' => 'miscellaneous', 'site-setting/action' => 'siteSetting',
    'store/action' => 'store', 'withdrawal-account/action' => 'withdrawalAccount',
    'withdrawal-request/withdraw' => 'withdrawal', 'withdrawal-request/cancel' => 'withdrawalCancel',
    'withdrawal-request/approve' => 'withdrawalApprove', 'payment/save' => 'payment',
    'user/address/action' => 'user_address', 'subscriber/send-subscription-email' => 'sendSubscriptionEmail',
    'subscription-email-format/action' => 'subscriptionEmail', 'user-message/action' => 'contactUs',
    'page/action' => 'page', 'footer-link/payment-social-action' => 'footerLink',
    'footer-link/service-about-action' => 'serviceAndAbout', 'footer-image-link/action' => 'footerImageLink',
    'home-slider-image/action' => 'homeSlider', 'banner/action' => 'banner', 'flash-sale/action' => 'flashSale',
    'tax-rule/action' => 'taxRules', 'voucher/action' => 'voucherRules', 'voucher/validity' => 'voucherValidity',
    'bundle-deal/action' => 'bundleDeals', 'shipping-rule/action' => 'shippingRule',
    'custom-script/action' => 'customScript', 'order/update-status' => 'orderStatus',
    'order/payment-status' => 'orderStatus', 'order/payment-method' => 'orderStatus',
    'language/action' => 'language', 'site-feature/action' => 'siteFeature',
    'product-image-attributes/action' => 'imageAttribute',
];

$uploadRoutes = [
    'upload', 'image', 'upload-logo', 'upload-images', 'upload-video',
    'wysiwyg-image/upload', 'page-wysiwyg-image/upload', 'feature-wysiwyg-image/upload',
    'bulk/import', 'plugin/upload', 'images/upload',
];

$openapi = [
    'openapi' => '3.0.3',
    'info' => [
        'title' => 'iShop Admin API',
        'version' => '1.0.0',
        'description' => 'Swagger/OpenAPI documentation generated from the Laravel admin routes in routes/api.php.',
    ],
    'servers' => [['url' => env('APP_URL', 'http://localhost')]],
    'tags' => [],
    'paths' => [],
    'components' => [
        'securitySchemes' => [
            'adminBearer' => [
                'type' => 'http',
                'scheme' => 'bearer',
                'bearerFormat' => 'Passport access token with admin scope',
            ],
        ],
        'schemas' => [
            'ApiResponse' => [
                'type' => 'object',
                'properties' => [
                    'data' => ['description' => 'Payload or validation errors. Shape depends on endpoint.', 'nullable' => true],
                    'status' => ['type' => 'integer', 'example' => 200],
                    'token' => ['type' => 'string', 'nullable' => true],
                    'message' => ['type' => 'string', 'nullable' => true],
                ],
            ],
            'ValidationErrorResponse' => [
                'type' => 'object',
                'properties' => [
                    'data' => ['type' => 'object', 'additionalProperties' => ['type' => 'array', 'items' => ['type' => 'string']]],
                    'status' => ['type' => 'integer', 'example' => 201],
                    'token' => ['type' => 'string', 'nullable' => true],
                    'message' => ['type' => 'string', 'nullable' => true],
                ],
            ],
        ],
    ],
];

foreach ($rules as $name => $schema) {
    $openapi['components']['schemas'][$schemaName = ucfirst($name) . 'Request'] = [
        'type' => 'object',
        'required' => $schema['required'],
        'properties' => $schema['properties'],
        'additionalProperties' => true,
    ];
}

$tags = [];
foreach (Route::getRoutes() as $route) {
    $uri = $route->uri();
    if (!str_starts_with($uri, 'api/admin')) {
        continue;
    }

    $methods = array_values(array_filter($route->methods(), fn ($method) => $method !== 'HEAD'));
    $relative = preg_replace('#^api/admin/?#', '', $uri);
    $tag = tagFromRelativePath($relative);
    $tags[$tag] = true;
    $authenticated = routeNeedsAuth($route->gatherMiddleware());

    foreach ($methods as $method) {
        foreach (pathVariants($uri) as $variant) {
            $operation = [
                'tags' => [$tag],
                'summary' => summaryFromRoute($method, $relative),
                'operationId' => operationId($method, $variant),
                'parameters' => parametersForRoute($variant, $method),
                'responses' => [
                    '200' => ['description' => 'Successful JSON response.', 'content' => jsonResponseContent('ApiResponse')],
                    '201' => ['description' => 'Application-level validation or business error.', 'content' => jsonResponseContent('ValidationErrorResponse')],
                    '401' => ['description' => 'Unauthenticated.'],
                    '403' => ['description' => 'Authenticated admin does not have the required scope or permission.'],
                ],
            ];

            if ($authenticated) {
                $operation['security'] = [['adminBearer' => []]];
            }

            $ruleName = findRuleName($relative, $routeRuleMap);
            if (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
                if ($ruleName) {
                    $operation['requestBody'] = [
                        'required' => true,
                        'content' => [
                            'application/json' => [
                                'schema' => ['$ref' => '#/components/schemas/' . ucfirst($ruleName) . 'Request'],
                            ],
                        ],
                    ];
                } elseif (isUploadRoute($relative, $uploadRoutes)) {
                    $operation['requestBody'] = uploadRequestBody($relative);
                } else {
                    $operation['requestBody'] = [
                        'required' => false,
                        'content' => [
                            'application/json' => [
                                'schema' => ['type' => 'object', 'additionalProperties' => true],
                            ],
                        ],
                    ];
                }
            }

            $openapi['paths']['/' . $variant][strtolower($method)] = $operation;
        }
    }
}

$openapi['tags'] = array_map(fn ($tag) => ['name' => $tag], array_keys($tags));
ksort($openapi['paths']);

file_put_contents(__DIR__ . '/admin-openapi.json', json_encode($openapi, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL);

function stringProps(array $names): array
{
    return array_fill_keys($names, ['type' => 'string']);
}

function intProp(): array
{
    return ['type' => 'integer'];
}

function numProp(): array
{
    return ['type' => 'number'];
}

function boolProp(): array
{
    return ['type' => 'boolean'];
}

function tagFromRelativePath(string $relative): string
{
    $first = explode('/', trim($relative, '/'))[0] ?: 'admin';
    if (in_array($first, ['login', 'signup', 'forgot-password', 'verify-code'], true)) {
        return 'Auth';
    }
    if (in_array($first, ['languages', 'localization', 'resource', 'countries-phones'], true)) {
        return 'Public Admin Resources';
    }
    if (in_array($first, ['activate', 'deactivate', 'manual-activation', 'logout', 'profile', 'dashboard', 'order-statistic', 'update', 'update-password', 'clear-cache'], true)) {
        return 'Admin';
    }

    return ucwords(str_replace('-', ' ', $first));
}

function routeNeedsAuth(array $middleware): bool
{
    return (bool) array_filter($middleware, function ($item) {
        if (!is_string($item)) {
            return false;
        }

        return str_contains($item, 'Authenticate:admin') || str_contains($item, 'auth:admin');
    });
}

function operationId(string $method, string $uri): string
{
    $id = strtolower($method) . '_' . preg_replace('/[^A-Za-z0-9]+/', '_', $uri);
    return trim($id, '_');
}

function summaryFromRoute(string $method, string $relative): string
{
    $clean = trim(preg_replace('/\{[^}]+\}/', '', $relative), '/');
    $clean = $clean === '' ? 'admin' : str_replace(['/', '-'], [' ', ' '], $clean);
    return strtoupper($method) . ' ' . $clean;
}

function parametersForRoute(string $uri, string $method): array
{
    preg_match_all('/\{([^}?]+)\}/', $uri, $matches);
    $parameters = [];
    foreach ($matches[1] as $name) {
        $parameters[] = [
            'name' => $name,
            'in' => 'path',
            'required' => true,
            'schema' => ['type' => in_array($name, ['id', 'productId', 'productImageId', 'orderId'], true) ? 'integer' : 'string'],
        ];
    }

    if ($method === 'GET') {
        foreach (['token', 'lang', 'page', 'per_page', 'q', 'query', 'sortby', 'orderby', 'status'] as $name) {
            $parameters[] = ['name' => $name, 'in' => 'query', 'required' => false, 'schema' => ['type' => in_array($name, ['page', 'per_page', 'status'], true) ? 'integer' : 'string']];
        }
    }

    return $parameters;
}

function pathVariants(string $uri): array
{
    if (!str_contains($uri, '?}')) {
        return [$uri];
    }

    return [
        preg_replace('#/\{[^}?]+\?\}#', '', $uri),
        preg_replace('/\{([^}?]+)\?\}/', '{$1}', $uri),
    ];
}

function findRuleName(string $relative, array $routeRuleMap): ?string
{
    $normal = trim(preg_replace('#/\{[^}]+\}#', '', $relative), '/');
    foreach ($routeRuleMap as $route => $rule) {
        if ($normal === $route || str_ends_with($normal, '/' . $route)) {
            return $rule;
        }
    }
    return null;
}

function isUploadRoute(string $relative, array $uploadRoutes): bool
{
    $normal = trim(preg_replace('#/\{[^}]+\}#', '', $relative), '/');
    foreach ($uploadRoutes as $route) {
        if ($normal === $route || str_ends_with($normal, '/' . $route)) {
            return true;
        }
    }
    return false;
}

function uploadRequestBody(string $relative): array
{
    $properties = ['photo' => ['type' => 'string', 'format' => 'binary']];
    if (str_contains($relative, 'video')) {
        $properties = [
            'video_file' => ['type' => 'string', 'format' => 'binary'],
            'thumb' => ['type' => 'string', 'format' => 'binary'],
        ];
    } elseif (str_contains($relative, 'bulk/import') || str_contains($relative, 'plugin/upload')) {
        $properties = ['file' => ['type' => 'string', 'format' => 'binary']];
    } elseif (str_contains($relative, 'images/upload') || str_contains($relative, 'upload-images')) {
        $properties = ['photo[]' => ['type' => 'array', 'items' => ['type' => 'string', 'format' => 'binary']]];
    }

    return [
        'required' => true,
        'content' => [
            'multipart/form-data' => [
                'schema' => [
                    'type' => 'object',
                    'properties' => $properties + ['token' => ['type' => 'string']],
                    'additionalProperties' => true,
                ],
            ],
        ],
    ];
}

function jsonResponseContent(string $schema): array
{
    return ['application/json' => ['schema' => ['$ref' => '#/components/schemas/' . $schema]]];
}
