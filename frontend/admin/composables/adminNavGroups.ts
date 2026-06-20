import type { AdminNavGroup } from '~/types/admin'

export const adminNavGroups: AdminNavGroup[] = [
  {
    id: 'main',
    label: 'Main',
    items: [{ label: 'Dashboard', to: '/' }]
  },
  {
    id: 'catalog',
    label: 'Catalog',
    items: [
      { label: 'Products', to: '/products', gate: 'product' },
      { label: 'Categories', to: '/categories', gate: 'category' },
      { label: 'Sub categories', to: '/sub-categories', gate: 'subcategory' },
      { label: 'Brands', to: '/brands', gate: 'brand' },
      { label: 'Attributes', to: '/attributes', gate: 'attribute' },
      { label: 'Tax rules', to: '/tax-rules', gate: 'tax_rule' },
      { label: 'Shipping rules', to: '/shipping-rules', gate: 'shipping_rule' },
      { label: 'Product collections', to: '/product-collections', gate: 'product_collection' },
      { label: 'Bundle deals', to: '/bundle-deals', gate: 'bundle_deal' },
      { label: 'Vouchers', to: '/vouchers', gate: 'voucher' },
      { label: 'Flash sales', to: '/flash-sales', gate: 'flash_sale' }
    ]
  },
  {
    id: 'orders',
    label: 'Orders',
    items: [
      { label: 'Orders', to: '/orders', gate: 'order' },
      { label: 'POS manager', to: '/pos/manager', gate: 'pos' },
      { label: 'POS orders', to: '/pos/order', gate: 'pos' },
      { label: 'POS configuration', to: '/pos/configuration', gate: 'pos_setting' }
    ]
  },
  {
    id: 'users',
    label: 'Users',
    items: [
      { label: 'Users', to: '/users', gate: 'user' },
      { label: 'Guest users', to: '/guest-users', gate: 'user' },
      { label: 'User addresses', to: '/user-addresses', gate: 'user' },
      { label: 'Subscribers', to: '/subscribers', gate: 'subscriber' },
      { label: 'Email formats', to: '/subscription-email-formats', gate: 'subscription_email_format' },
      { label: 'Roles', to: '/roles-permissions', gate: 'role' },
      { label: 'Admins / Vendors', to: '/admins-vendors', gate: 'admin' },
      { label: 'Withdrawal accounts', to: '/withdrawal-accounts', gate: 'withdrawal_account' },
      { label: 'Withdrawal requests', to: '/withdrawal-requests', gate: 'withdrawal_request' },
      { label: 'Reviews', to: '/rating-reviews', gate: 'rating_review' }
    ]
  },
  {
    id: 'cms',
    label: 'Content',
    items: [
      { label: 'Pages', to: '/pages', gate: 'page' },
      { label: 'Home slider', to: '/home-slider', gate: 'home_slider' },
      { label: 'Banners', to: '/banners', gate: 'banner' },
      { label: 'Site features', to: '/site-features', gate: 'site_feature' },
      { label: 'Footer links', to: '/footer-links', gate: 'footer_link' },
      { label: 'Footer image links', to: '/footer-image-links', gate: 'footer_image_link' },
      { label: 'Header links', to: '/header-links', gate: 'header_link' },
      { label: 'Custom scripts', to: '/custom-scripts', gate: 'custom_script' },
      { label: 'User messages', to: '/user-messages', gate: 'message' },
      { label: 'Images', to: '/images', gate: 'image' },
      { label: 'Bulk upload', to: '/bulk-upload', gate: 'bulk_upload' }
    ]
  },
  {
    id: 'store',
    label: 'Store',
    items: [
      { label: 'Site setting', to: '/site-setting' },
      { label: 'Store', to: '/store' }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    items: [
      { label: 'Currency', to: '/setting/currency', gate: 'setting' },
      { label: 'Address', to: '/setting/address', gate: 'setting' },
      { label: 'Payment', to: '/setting/payment', gate: 'payment' },
      { label: 'Social login', to: '/setting/social-login', gate: 'setting' },
      { label: 'SMTP', to: '/setting/smtp', gate: 'setting' },
      { label: 'Media storage', to: '/setting/media-storage', gate: 'setting' },
      { label: 'Miscellaneous', to: '/setting/miscellaneous', gate: 'setting' },
      { label: 'Analytics', to: '/setting/analytics', gate: 'setting' },
      { label: 'Languages', to: '/setting/languages', gate: 'language' },
      { label: 'Plugins', to: '/setting/plugins', gate: 'plugin' },
      { label: 'Clear cache', to: '/setting/clear-cache', gate: 'setting' }
    ]
  }
]
