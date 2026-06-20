# Original Admin Feature Audit

Source of truth used for this audit:

- Original built admin UI in `backend/public/_nuxt`.
- Admin API documentation in `backend/docs/admin-openapi.json`.
- Current Nuxt admin source in `frontend/admin`.

## Original Sidebar Map

The original admin panel sidebar includes these groups and entries:

- Dashboard
- Product
  - Categories
  - Brands
  - Attributes
  - Tax rules
  - Shipping rules
  - Product collections
  - Bundle deals
  - Vouchers
  - Products
- Flash sales
- POS
  - POS manager
  - POS order
  - POS configuration
- Orders
- Rating reviews
- Users
  - Registered users
  - Guest users
- Subscription
  - Subscribers
  - Subscription email formats
- Bulk upload
- Roles and permissions
- Admins / Vendors
- Withdrawal
  - Withdrawal requests
  - Withdrawal accounts
- UI
  - Pages
  - Home slider
  - Banners
  - Footer links
  - Header links
  - Site features
  - Site setting
  - Custom scripts
- Store
- Settings

## Header / Global Actions

- Sidebar toggle.
- Logo link to dashboard.
- Clear cache button.
- Language selector.
- User messages popover with recent messages and link to all messages.
- More menu with profile and logout.
- Activation/dashboard notices.

## Current Implementation Status

Implemented or wired in the open Nuxt admin:

- Dashboard
- Auth pages: login, forgot password, verify code
- Generic list/create/edit/delete pages
- Product list/detail form with inventory basics
- Order list/detail with status, payment status, payment method, delivered email, cancellation refund
- Roles and permissions
- Withdrawal requests
- Footer links
- Bulk upload
- POS terminal shell
- Subscription send email
- Settings sub-navigation
- Image, plugin, site setting, store, POS setting uploads
- User messages via `user-message/action/{contactUs?}`

Recently aligned with backend/OpenAPI:

- Optional Laravel model route params like `{role?}` and `{admin?}` now work with generic edit forms.
- `images/delete/{image}` and multi-image upload use the correct backend parameter/file keys.
- Site setting, store, and POS setting uploads send `photo`; site logos also send `type`.
- Payment, address, analytics, miscellaneous, language, shipping rule, voucher, withdrawal account, footer image link, and user address forms now expose the required backend fields.
- Sidebar now includes POS manager, user addresses, footer image links, withdrawal accounts, and withdrawal requests with closer permission gates.

## Remaining Deep-Parity Work

These sections still need richer page-specific components to match every detail of the original UI:

- Product detail: category/subcategory selectors, product collections, multiple images gallery, video upload, image attribute assignment, updated inventory matrix, WYSIWYG image upload.
- Attributes: nested attribute values UI.
- Flash sales: product search and flash-sale product price table.
- Banners and home slider: source selectors for category/subcategory/brand/product/URL.
- Footer/header links: separate service/about/payment/social structures.
- POS manager: full cart/customer/voucher/payment flow.
- Order detail: full address/country rendering, calculated totals table, cancellation state panel, bank transaction details.
- Store/site settings: image previews and dedicated logo upload actions.
- Plugins: upload/install flow feedback and activation state controls.
- Internationalization: replace remaining English hardcoded labels with backend localization keys.
