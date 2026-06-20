# Admin API Documentation

This project does not include a Swagger/L5-Swagger package. The admin API documentation is therefore maintained as a standalone OpenAPI 3.0 document:

- `docs/admin-openapi.json`
- generator: `php docs/generate-admin-openapi.php`

## Scope

The OpenAPI file documents every route under `api/admin` from `routes/api.php`.

Current generated coverage:

- Public admin routes: login, signup, forgot password, verification, languages, localization, resources, country phones.
- Protected admin routes: every route inside the `auth:admin` and `scope:admin` group.
- Multipart upload routes: images, logos, videos, bulk import, plugin upload, WYSIWYG uploads.
- CRUD/action routes: schemas are derived from the validation rules in `app/Models/Helper/Validation.php`.

## Authentication

Protected endpoints use Laravel Passport bearer tokens created by `POST /api/admin/login`.

Use this header in Swagger UI or API clients:

```http
Authorization: Bearer <admin_access_token>
```

The token must include the `admin` scope.

## Response Envelope

Most controllers return `App\Models\Helper\Response`:

```json
{
  "data": {},
  "status": 200,
  "token": "",
  "message": ""
}
```

Validation and business-rule errors are commonly returned with HTTP 200 and an internal `status` value of `201`. The OpenAPI document includes both `ApiResponse` and `ValidationErrorResponse` schemas to reflect this behavior.

## Regenerating

After changing admin routes or validation rules, regenerate the Swagger document:

```bash
php docs/generate-admin-openapi.php
```

Then import `docs/admin-openapi.json` into Swagger UI, Redoc, Postman, Insomnia, or Stoplight.

## Notes

- Laravel optional path parameters such as `{id?}` are expanded into two OpenAPI paths, for example `/api/admin/category/action` and `/api/admin/category/action/{id}`.
- Request body schemas intentionally allow `additionalProperties` because several controllers accept optional localized fields and extra model attributes beyond the required validation rules.
- Common list query parameters such as `page`, `per_page`, `q`, `sortby`, `orderby`, `status`, `lang`, and `token` are documented for GET endpoints.
