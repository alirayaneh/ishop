import type { AdminNavItem, ResourceConfig } from '~/types/admin'

const statusOptions = [
  { label: 'Enabled', value: 1 },
  { label: 'Disabled', value: 2 }
]

const featuredOptions = [
  { label: 'Featured', value: 1 },
  { label: 'Regular', value: 2 }
]

const yesNoOptions = [
  { label: 'Yes', value: 1 },
  { label: 'No', value: 0 }
]

const directionOptions = [
  { label: 'Left to right', value: 'ltr' },
  { label: 'Right to left', value: 'rtl' }
]

const bannerTypeOptions = [
  { label: 'Category', value: 1 },
  { label: 'Sub category', value: 2 },
  { label: 'Brand', value: 3 },
  { label: 'Product', value: 4 },
  { label: 'URL', value: 5 }
]

const titleSlugFields = [
  { key: 'title', label: 'Title', required: true },
  { key: 'slug', label: 'Slug', required: true },
  { key: 'meta_title', label: 'Meta title' },
  { key: 'meta_description', label: 'Meta description', type: 'textarea' as const },
  { key: 'meta_keywords', label: 'Meta keywords' },
  { key: 'status', label: 'Status', type: 'select' as const, options: statusOptions }
]

const titleSlugImageFields = [
  ...titleSlugFields,
  { key: 'featured', label: 'Featured', type: 'select' as const, options: featuredOptions },
  { key: 'image', label: 'Image', type: 'file' as const }
]

const resourceEntries: ResourceConfig[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    list: { method: 'GET', path: 'dashboard' },
    columns: ['total_orders', 'total_products', 'total_users', 'total_sales']
  },
  {
    key: 'categories',
    title: 'Categories',
    gate: 'category',
    list: { method: 'GET', path: 'category/all' },
    find: { method: 'GET', path: 'category/find/{id}' },
    save: { method: 'POST', path: 'category/action/{id?}' },
    remove: { method: 'DELETE', path: 'category/delete/{id}' },
    upload: { method: 'POST', path: 'category/upload/{id?}' },
    columns: ['title', 'slug', 'featured', 'status', 'created'],
    fields: titleSlugImageFields
  },
  {
    key: 'sub-categories',
    title: 'Sub categories',
    gate: 'subcategory',
    list: { method: 'GET', path: 'subcategory/all' },
    find: { method: 'GET', path: 'subcategory/find/{id}' },
    save: { method: 'POST', path: 'subcategory/action/{id?}' },
    remove: { method: 'DELETE', path: 'subcategory/delete/{id}' },
    upload: { method: 'POST', path: 'subcategory/upload/{id?}' },
    columns: ['title', 'slug', 'category', 'featured', 'status', 'created'],
    fields: [
      ...titleSlugImageFields,
      { key: 'category_id', label: 'Category ID', type: 'number' as const, required: true }
    ]
  },
  {
    key: 'brands',
    title: 'Brands',
    gate: 'brand',
    list: { method: 'GET', path: 'brand/all' },
    find: { method: 'GET', path: 'brand/find/{id}' },
    save: { method: 'POST', path: 'brand/action/{id?}' },
    remove: { method: 'DELETE', path: 'brand/delete/{id}' },
    upload: { method: 'POST', path: 'brand/upload/{id?}' },
    columns: ['title', 'slug', 'featured', 'status', 'created'],
    fields: titleSlugImageFields
  },
  {
    key: 'products',
    title: 'Products',
    pageComponent: 'product',
    gate: 'product',
    list: { method: 'GET', path: 'product/all' },
    find: { method: 'GET', path: 'product/find/{id}' },
    save: { method: 'POST', path: 'product/action/{id?}' },
    remove: { method: 'DELETE', path: 'product/delete/{id}' },
    upload: { method: 'POST', path: 'product/upload/{id?}' },
    columns: ['title', 'status', 'brand', 'purchased', 'selling', 'offered', 'created'],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'slug', label: 'Slug', required: true },
      { key: 'unit', label: 'Unit', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'overview', label: 'Overview', type: 'textarea' },
      { key: 'meta_title', label: 'Meta title', required: true },
      { key: 'meta_description', label: 'Meta description', type: 'textarea', required: true },
      { key: 'tax_rule_id', label: 'Tax rule ID', type: 'number', required: true },
      { key: 'shipping_rule_id', label: 'Shipping rule ID', type: 'number', required: true },
      { key: 'purchased', label: 'Purchased price', type: 'number' },
      { key: 'selling', label: 'Selling price', type: 'number' },
      { key: 'offered', label: 'Offered price', type: 'number' },
      { key: 'warranty', label: 'Warranty' },
      { key: 'refundable', label: 'Refundable', type: 'checkbox' },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions },
      { key: 'image', label: 'Image', type: 'file' }
    ]
  },
  {
    key: 'attributes',
    title: 'Attributes',
    gate: 'attribute',
    list: { method: 'GET', path: 'attribute/all' },
    find: { method: 'GET', path: 'attribute/find/{id}' },
    save: { method: 'POST', path: 'attribute/action/{id?}' },
    remove: { method: 'DELETE', path: 'attribute/delete/{id}' },
    columns: ['title', 'created'],
    fields: [{ key: 'title', label: 'Title', required: true }]
  },
  {
    key: 'tax-rules',
    title: 'Tax rules',
    gate: 'tax_rule',
    list: { method: 'GET', path: 'tax-rule/all' },
    find: { method: 'GET', path: 'tax-rule/find/{id}' },
    save: { method: 'POST', path: 'tax-rule/action/{id?}' },
    remove: { method: 'DELETE', path: 'tax-rule/delete/{id}' },
    columns: ['title', 'type', 'price', 'status', 'created'],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'type', label: 'Type' },
      { key: 'price', label: 'Price', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions }
    ]
  },
  {
    key: 'shipping-rules',
    title: 'Shipping rules',
    gate: 'shipping_rule',
    list: { method: 'GET', path: 'shipping-rule/all' },
    find: { method: 'GET', path: 'shipping-rule/find/{id}' },
    save: { method: 'POST', path: 'shipping-rule/action/{id?}' },
    remove: { method: 'DELETE', path: 'shipping-rule/delete/{id}' },
    columns: ['title', 'price', 'status', 'created'],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'single_price', label: 'Single shipping price', type: 'number' },
      { key: 'shipping_places', label: 'Shipping places', type: 'array', wide: true, hint: 'JSON array accepted by the backend.' }
    ]
  },
  {
    key: 'product-collections',
    title: 'Product collections',
    gate: 'product_collection',
    list: { method: 'GET', path: 'product-collection/all' },
    find: { method: 'GET', path: 'product-collection/find/{id}' },
    save: { method: 'POST', path: 'product-collection/action/{id?}' },
    remove: { method: 'DELETE', path: 'product-collection/delete/{id}' },
    columns: ['title', 'slug', 'status', 'created'],
    fields: titleSlugFields
  },
  {
    key: 'bundle-deals',
    title: 'Bundle deals',
    gate: 'bundle_deal',
    list: { method: 'GET', path: 'bundle-deal/all' },
    find: { method: 'GET', path: 'bundle-deal/find/{id}' },
    save: { method: 'POST', path: 'bundle-deal/action/{id?}' },
    remove: { method: 'DELETE', path: 'bundle-deal/delete/{id}' },
    columns: ['title', 'buy', 'free', 'status', 'created'],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'buy', label: 'Buy', type: 'number' },
      { key: 'free', label: 'Free', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions }
    ]
  },
  {
    key: 'vouchers',
    title: 'Vouchers',
    gate: 'voucher',
    list: { method: 'GET', path: 'voucher/all' },
    find: { method: 'GET', path: 'voucher/find/{id}' },
    save: { method: 'POST', path: 'voucher/action/{id?}' },
    remove: { method: 'DELETE', path: 'voucher/delete/{id}' },
    columns: ['title', 'code', 'price', 'status', 'created'],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'code', label: 'Code', required: true },
      { key: 'type', label: 'Type', type: 'number', required: true },
      { key: 'price', label: 'Price', type: 'number' },
      { key: 'capped_price', label: 'Capped price', type: 'number' },
      { key: 'min_spend', label: 'Minimum spend', type: 'number' },
      { key: 'usage_limit', label: 'Usage limit', type: 'number' },
      { key: 'limit_per_customer', label: 'Limit per customer', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions }
    ]
  },
  {
    key: 'flash-sales',
    title: 'Flash sales',
    gate: 'flash_sale',
    list: { method: 'GET', path: 'flash-sale/all' },
    find: { method: 'GET', path: 'flash-sale/find/{id}' },
    save: { method: 'POST', path: 'flash-sale/action/{id?}' },
    remove: { method: 'DELETE', path: 'flash-sale/delete/{id}' },
    columns: ['title', 'start_time', 'end_time', 'status', 'created'],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'start_time', label: 'Start time' },
      { key: 'end_time', label: 'End time' },
      { key: 'products', label: 'Products', type: 'array', wide: true, hint: 'JSON array of flash-sale products and prices.' },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions }
    ]
  },
  {
    key: 'orders',
    title: 'Orders',
    pageComponent: 'order',
    gate: 'order',
    list: { method: 'GET', path: 'order/all' },
    find: { method: 'GET', path: 'order/find/{id}' },
    save: { method: 'POST', path: 'order/update-status' },
    remove: { method: 'DELETE', path: 'order/delete/{id}' },
    columns: ['id', 'order', 'user', 'total_amount', 'order_method', 'status', 'created']
  },
  {
    key: 'registered-users',
    title: 'Registered users',
    routePath: '/users',
    gate: 'user',
    list: { method: 'GET', path: 'user/all' },
    remove: { method: 'DELETE', path: 'user/delete/{id}' },
    columns: ['name', 'email', 'verified', 'created'],
    columnLabels: { verified: 'Verified', created_at: 'Created' },
    listOptions: { noCreate: true }
  },
  {
    key: 'guest-users',
    title: 'Guest users',
    gate: 'user',
    list: { method: 'GET', path: 'guest-user/all' },
    remove: { method: 'DELETE', path: 'guest-user/delete/{id}' },
    columns: ['name', 'email', 'created'],
    listOptions: { noCreate: true }
  },
  {
    key: 'user-addresses',
    title: 'User addresses',
    routePath: '/user-addresses',
    gate: 'user',
    list: { method: 'GET', path: 'user/address/all' },
    save: { method: 'POST', path: 'user/address/action' },
    remove: { method: 'DELETE', path: 'user/address/delete/{id}' },
    columns: ['name', 'email', 'phone', 'country', 'city', 'created'],
    fields: [
      { key: 'user_id', label: 'User ID', type: 'number' },
      { key: 'name', label: 'Name', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'phone', label: 'Phone', required: true },
      { key: 'country', label: 'Country', required: true },
      { key: 'state', label: 'State' },
      { key: 'city', label: 'City', required: true },
      { key: 'zip', label: 'Zip', required: true },
      { key: 'address_1', label: 'Address 1', type: 'textarea', required: true },
      { key: 'address_2', label: 'Address 2', type: 'textarea' }
    ]
  },
  {
    key: 'subscribers',
    title: 'Subscribers',
    gate: 'subscriber',
    list: { method: 'GET', path: 'subscriber/all' },
    remove: { method: 'DELETE', path: 'subscriber/delete/{id}' },
    columns: ['email', 'created'],
    listOptions: { noCreate: true }
  },
  {
    key: 'subscribers-send-email',
    title: 'Send subscription email',
    routePath: '/subscribers/send-email',
    gate: 'subscriber',
    save: { method: 'POST', path: 'subscriber/send-subscription-email' },
    fields: [
      { key: 'format_id', label: 'Email format', required: true }
    ]
  },
  {
    key: 'subscription-email-formats',
    title: 'Subscription email formats',
    gate: 'subscription_email_format',
    list: { method: 'GET', path: 'subscription-email-format/all' },
    find: { method: 'GET', path: 'subscription-email-format/find/{id}' },
    save: { method: 'POST', path: 'subscription-email-format/action/{id?}' },
    remove: { method: 'DELETE', path: 'subscription-email-format/delete/{id}' },
    columns: ['title', 'subject', 'status', 'created'],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'subject', label: 'Subject', required: true },
      { key: 'body', label: 'Body', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions }
    ]
  },
  {
    key: 'roles-permissions',
    title: 'Roles and permissions',
    pageComponent: 'role',
    gate: 'role',
    list: { method: 'GET', path: 'role/all' },
    find: { method: 'GET', path: 'role/find/{id}' },
    save: { method: 'POST', path: 'role/action/{id?}' },
    remove: { method: 'DELETE', path: 'role/delete/{id}' },
    columns: ['name', 'created'],
    fields: [{ key: 'name', label: 'Name', required: true }]
  },
  {
    key: 'admins-vendors',
    title: 'Admins and vendors',
    gate: 'admin',
    list: { method: 'GET', path: 'admin-data/all' },
    find: { method: 'GET', path: 'admin-data/find/{id}' },
    save: { method: 'POST', path: 'admin-data/action/{id?}' },
    remove: { method: 'DELETE', path: 'admin-data/delete/{id}' },
    columns: ['name', 'email', 'role', 'status', 'created'],
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'password', label: 'Password', type: 'password' },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions }
    ]
  },
  {
    key: 'withdrawal-requests',
    title: 'Withdrawal requests',
    pageComponent: 'withdrawal',
    gate: 'withdrawal',
    list: { method: 'GET', path: 'withdrawal-request/all' },
    find: { method: 'GET', path: 'withdrawal-request/find' },
    remove: { method: 'DELETE', path: 'withdrawal-request/delete/{id}' },
    columns: ['id', 'admin', 'amount', 'status', 'created']
  },
  {
    key: 'withdrawal-accounts',
    title: 'Withdrawal accounts',
    gate: 'withdrawal_account',
    list: { method: 'GET', path: 'withdrawal-account/all' },
    find: { method: 'GET', path: 'withdrawal-account/find/{id}' },
    save: { method: 'POST', path: 'withdrawal-account/action/{id?}' },
    remove: { method: 'DELETE', path: 'withdrawal-account/delete/{id}' },
    columns: ['title', 'account', 'created'],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'account_number', label: 'Account number', required: true },
      { key: 'account_name', label: 'Account name', required: true },
      { key: 'bank_name', label: 'Bank name', required: true },
      { key: 'branch_name', label: 'Branch name', required: true },
      { key: 'default', label: 'Default', type: 'checkbox', required: true }
    ]
  },
  {
    key: 'pages',
    title: 'Pages',
    gate: 'page',
    list: { method: 'GET', path: 'page/all' },
    find: { method: 'GET', path: 'page/find/{id}' },
    save: { method: 'POST', path: 'page/action/{id?}' },
    remove: { method: 'DELETE', path: 'page/delete/{id}' },
    columns: ['title', 'slug', 'status', 'created'],
    fields: [
      ...titleSlugFields,
      { key: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  {
    key: 'home-slider',
    title: 'Home slider',
    gate: 'home_slider',
    list: { method: 'GET', path: 'home-slider-image/all' },
    find: { method: 'GET', path: 'home-slider-image/find/{id}' },
    save: { method: 'POST', path: 'home-slider-image/action/{id?}' },
    remove: { method: 'DELETE', path: 'home-slider-image/delete/{id}' },
    upload: { method: 'POST', path: 'home-slider-image/upload/{id?}' },
    columns: ['title', 'status', 'created'],
    fields: titleSlugImageFields
  },
  {
    key: 'banners',
    title: 'Banners',
    gate: 'banner',
    list: { method: 'GET', path: 'banner/all' },
    find: { method: 'GET', path: 'banner/find/{id}' },
    save: { method: 'POST', path: 'banner/action/{id?}' },
    upload: { method: 'POST', path: 'banner/upload/{id?}' },
    columns: ['title', 'status', 'created'],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'slug', label: 'Slug', required: true },
      { key: 'source_type', label: 'Source type', type: 'select', options: bannerTypeOptions, required: true },
      { key: 'type', label: 'Banner type', type: 'number', required: true },
      { key: 'closable', label: 'Closable', type: 'select', options: yesNoOptions, required: true },
      { key: 'url', label: 'URL' },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions },
      { key: 'image', label: 'Image', type: 'file' }
    ]
  },
  {
    key: 'footer-image-links',
    title: 'Footer image links',
    gate: 'footer_image_link',
    list: { method: 'GET', path: 'footer-image-link/all' },
    find: { method: 'GET', path: 'footer-image-link/find/{id}' },
    save: { method: 'POST', path: 'footer-image-link/action/{footerImageLink?}' },
    remove: { method: 'DELETE', path: 'footer-image-link/delete/{id}' },
    upload: { method: 'POST', path: 'footer-image-link/image/{id?}' },
    columns: ['title', 'link', 'type', 'status', 'created'],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'link', label: 'Link', required: true },
      { key: 'type', label: 'Type', type: 'number', required: true },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions },
      { key: 'image', label: 'Image', type: 'file' }
    ]
  },
  {
    key: 'footer-links',
    title: 'Footer links',
    pageComponent: 'footer-links',
    gate: 'footer_link',
    list: { method: 'GET', path: 'footer-link/all' },
    save: { method: 'POST', path: 'footer-link/payment-social-action/{id?}' },
    remove: { method: 'DELETE', path: 'footer-link/delete/{id}' },
    columns: ['title', 'link', 'created'],
    fields: [
      { key: 'page_id', label: 'Page ID', type: 'number', required: true },
      { key: 'type', label: 'Type', type: 'number', required: true },
      { key: 'service_links', label: 'Service links', type: 'array', wide: true },
      { key: 'about_links', label: 'About links', type: 'array', wide: true }
    ]
  },
  {
    key: 'header-links',
    title: 'Header links',
    gate: 'header_link',
    list: { method: 'GET', path: 'header-link/all' },
    save: { method: 'POST', path: 'header-link/action' },
    columns: ['title', 'link', 'created'],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'link', label: 'Link' }
    ]
  },
  {
    key: 'site-features',
    title: 'Site features',
    gate: 'site_feature',
    list: { method: 'GET', path: 'site-feature/all' },
    find: { method: 'GET', path: 'site-feature/find/{id}' },
    save: { method: 'POST', path: 'site-feature/action/{id?}' },
    remove: { method: 'DELETE', path: 'site-feature/delete/{id}' },
    upload: { method: 'POST', path: 'site-feature/upload/{id?}' },
    columns: ['title', 'status', 'created'],
    fields: titleSlugImageFields
  },
  {
    key: 'custom-scripts',
    title: 'Custom scripts',
    gate: 'custom_script',
    list: { method: 'GET', path: 'custom-script/all' },
    find: { method: 'GET', path: 'custom-script/find/{id}' },
    save: { method: 'POST', path: 'custom-script/action/{id?}' },
    remove: { method: 'DELETE', path: 'custom-script/delete/{id}' },
    columns: ['title', 'status', 'created'],
    fields: [
      { key: 'route_pattern', label: 'Route pattern', required: true },
      { key: 'script', label: 'Script', type: 'textarea', wide: true },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions }
    ]
  },
  {
    key: 'rating-reviews',
    title: 'Rating reviews',
    gate: 'rating_review',
    list: { method: 'GET', path: 'rating-review/all' },
    remove: { method: 'DELETE', path: 'rating-review/delete/{id}' },
    columns: ['product', 'user', 'rating', 'review', 'created']
  },
  {
    key: 'images',
    title: 'Images',
    gate: 'image',
    list: { method: 'GET', path: 'images/all' },
    save: { method: 'POST', path: 'images/upload' },
    remove: { method: 'DELETE', path: 'images/delete/{image}' },
    columns: ['image', 'title', 'created'],
    fields: [{ key: 'images', label: 'Images', type: 'file', required: true, multiple: true, accept: 'image/*' }]
  },
  {
    key: 'bulk-upload',
    title: 'Bulk upload',
    pageComponent: 'bulk-upload',
    list: { method: 'GET', path: 'bulk/export' },
    save: { method: 'POST', path: 'bulk/import' },
    fields: [{ key: 'file', label: 'Import file', type: 'file', required: true }]
  },
  {
    key: 'site-setting',
    title: 'Site setting',
    list: { method: 'GET', path: 'site-setting/find' },
    save: { method: 'POST', path: 'site-setting/action' },
    upload: { method: 'POST', path: 'site-setting/upload' },
    fields: [
      { key: 'site_name', label: 'Site name', required: true },
      { key: 'meta_title', label: 'Meta title', required: true },
      { key: 'meta_description', label: 'Meta description', type: 'textarea', required: true },
      { key: 'meta_keywords', label: 'Meta keywords' },
      { key: 'copyright_text', label: 'Copyright text' },
      { key: 'header_logo', label: 'Header logo', type: 'file' },
      { key: 'footer_logo', label: 'Footer logo', type: 'file' }
    ]
  },
  {
    key: 'store',
    title: 'Store',
    list: { method: 'GET', path: 'store/find' },
    save: { method: 'POST', path: 'store/action' },
    upload: { method: 'POST', path: 'store/upload-logo' },
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'slug', label: 'Slug', required: true },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Phone' },
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'meta_title', label: 'Meta title' },
      { key: 'meta_description', label: 'Meta description', type: 'textarea' },
      { key: 'image', label: 'Logo', type: 'file' }
    ]
  },
  {
    key: 'pos-configuration',
    title: 'POS configuration',
    list: { method: 'GET', path: 'pos-setting/find' },
    save: { method: 'POST', path: 'pos-setting/action' },
    upload: { method: 'POST', path: 'pos-setting/upload' },
    fields: [
      { key: 'width', label: 'Paper width', type: 'number' },
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'header_text', label: 'Header text', type: 'textarea' },
      { key: 'footer_text', label: 'Footer text', type: 'textarea' },
      { key: 'is_default', label: 'Default', type: 'checkbox' },
      { key: 'image', label: 'Image', type: 'file' }
    ]
  },
  {
    key: 'pos-order',
    title: 'POS orders',
    list: { method: 'GET', path: 'pos-order/all' },
    save: { method: 'POST', path: 'pos-order/action' },
    remove: { method: 'DELETE', path: 'pos-order/delete/{id}' },
    columns: ['id', 'user', 'total_amount', 'status', 'created']
  },
  {
    key: 'setting-currency',
    title: 'Currency setting',
    routePath: '/setting/currency',
    settingsLayout: true,
    list: { method: 'GET', path: 'setting/find' },
    save: { method: 'POST', path: 'setting/currency' },
    fields: [
      { key: 'currency', label: 'Currency' },
      { key: 'currency_icon', label: 'Currency icon' },
      { key: 'currency_position', label: 'Currency position' }
    ]
  },
  {
    key: 'setting-address',
    title: 'Address setting',
    routePath: '/setting/address',
    settingsLayout: true,
    list: { method: 'GET', path: 'setting/find' },
    save: { method: 'POST', path: 'setting/address' },
    fields: [
      { key: 'address_1', label: 'Address 1', required: true },
      { key: 'address_2', label: 'Address 2' },
      { key: 'city', label: 'City', required: true },
      { key: 'state', label: 'State', required: true },
      { key: 'zip', label: 'Zip', required: true },
      { key: 'country', label: 'Country', required: true }
    ]
  },
  {
    key: 'setting-payment',
    title: 'Payment setting',
    routePath: '/setting/payment',
    settingsLayout: true,
    list: { method: 'GET', path: 'payment/find' },
    save: { method: 'POST', path: 'payment/save' },
    fields: [
      { key: 'cash_on_delivery', label: 'Cash on delivery', type: 'checkbox', required: true },
      { key: 'paypal', label: 'Paypal', type: 'checkbox' },
      { key: 'paypal_key', label: 'Paypal key' },
      { key: 'paypal_secret', label: 'Paypal secret', type: 'password' },
      { key: 'stripe', label: 'Stripe', type: 'checkbox' },
      { key: 'stripe_key', label: 'Stripe key' },
      { key: 'stripe_secret', label: 'Stripe secret', type: 'password' },
      { key: 'razorpay', label: 'Razorpay', type: 'checkbox' },
      { key: 'razorpay_key', label: 'Razorpay key' },
      { key: 'razorpay_secret', label: 'Razorpay secret', type: 'password' },
      { key: 'flutterwave', label: 'Flutterwave', type: 'checkbox' },
      { key: 'flutterwave_public_key', label: 'Flutterwave public key' },
      { key: 'flutterwave_secret_key', label: 'Flutterwave secret key', type: 'password' },
      { key: 'iyzico', label: 'Iyzico', type: 'checkbox' },
      { key: 'bank', label: 'Bank payment', type: 'checkbox' }
    ]
  },
  {
    key: 'setting-social-login',
    title: 'Social login',
    routePath: '/setting/social-login',
    settingsLayout: true,
    list: { method: 'GET', path: 'setting/social-login-find' },
    save: { method: 'POST', path: 'setting/social-login-action' },
    fields: [
      { key: 'facebook_login', label: 'Facebook login', type: 'checkbox' },
      { key: 'facebook_client_id', label: 'Facebook client ID' },
      { key: 'facebook_client_secret', label: 'Facebook client secret' },
      { key: 'google_login', label: 'Google login', type: 'checkbox' },
      { key: 'google_client_id', label: 'Google client ID' },
      { key: 'google_client_secret', label: 'Google client secret' }
    ]
  },
  {
    key: 'setting-smtp',
    title: 'SMTP',
    routePath: '/setting/smtp',
    settingsLayout: true,
    list: { method: 'GET', path: 'setting/smtp-find' },
    save: { method: 'POST', path: 'setting/smtp-action' },
    fields: [
      { key: 'smtp_host', label: 'SMTP host' },
      { key: 'smtp_port', label: 'SMTP port', type: 'number' },
      { key: 'smtp_encryption', label: 'Encryption' },
      { key: 'smtp_username', label: 'Username' },
      { key: 'smtp_password', label: 'Password', type: 'password' },
      { key: 'mail_from_address', label: 'From address', type: 'email' },
      { key: 'mail_from_name', label: 'From name' }
    ]
  },
  {
    key: 'setting-media-storage',
    title: 'Media storage',
    routePath: '/setting/media-storage',
    settingsLayout: true,
    list: { method: 'GET', path: 'setting/media-storage-find' },
    save: { method: 'POST', path: 'setting/media-storage-action' },
    fields: [
      { key: 'media_storage', label: 'Storage driver' },
      { key: 'gcs_project_id', label: 'GCS project ID' },
      { key: 'gcs_bucket', label: 'GCS bucket' },
      { key: 'gcs_key_file', label: 'GCS key file', type: 'textarea' }
    ]
  },
  {
    key: 'setting-miscellaneous',
    title: 'Miscellaneous',
    routePath: '/setting/miscellaneous',
    settingsLayout: true,
    list: { method: 'GET', path: 'setting/find' },
    save: { method: 'POST', path: 'setting/miscellaneous' },
    fields: [
      { key: 'purchase_key', label: 'Purchase key' },
      { key: 'attach_pdf', label: 'Attach invoice PDF', type: 'checkbox', required: true },
      { key: 'send_seller_email', label: 'Send seller email', type: 'checkbox', required: true },
      { key: 'cookie_banner', label: 'Cookie banner', type: 'checkbox', required: true },
      { key: 'vendor_registration', label: 'Vendor registration', type: 'checkbox', required: true },
      { key: 'guest_checkout', label: 'Guest checkout', type: 'checkbox', required: true },
      { key: 'translate_pdf', label: 'Translate PDF', type: 'checkbox' },
      { key: 'vendor_registration_fee', label: 'Registration fee', type: 'number' }
    ]
  },
  {
    key: 'setting-analytics',
    title: 'Analytics',
    routePath: '/setting/analytics',
    settingsLayout: true,
    list: { method: 'GET', path: 'setting/find' },
    save: { method: 'POST', path: 'setting/analytics' },
    fields: [
      { key: 'enable_ga', label: 'Enable Google Analytics', type: 'checkbox', required: true },
      { key: 'ga_id', label: 'Google Analytics ID' },
      { key: 'enable_pixel', label: 'Enable Facebook Pixel', type: 'checkbox', required: true },
      { key: 'pixel_id', label: 'Facebook Pixel ID' }
    ]
  },
  {
    key: 'setting-clear-cache',
    title: 'Clear cache',
    routePath: '/setting/clear-cache',
    settingsLayout: true,
    save: { method: 'POST', path: 'clear-cache' }
  },
  {
    key: 'setting-plugins',
    title: 'Plugins',
    routePath: '/setting/plugins',
    settingsLayout: true,
    gate: 'plugin',
    list: { method: 'GET', path: 'plugin/all' },
    save: { method: 'POST', path: 'plugin/activate' },
    upload: { method: 'POST', path: 'plugin/upload' },
    remove: { method: 'DELETE', path: 'plugin/delete/{id}' },
    columns: ['name', 'version', 'active', 'created'],
    fields: [
      { key: 'code', label: 'Activation code', required: true },
      { key: 'name', label: 'Plugin name', required: true },
      { key: 'file', label: 'Plugin zip', type: 'file', accept: '.zip' }
    ],
    listOptions: { noEdit: true }
  },
  {
    key: 'user-messages',
    title: 'User messages',
    routePath: '/user-messages',
    gate: 'message',
    list: { method: 'GET', path: 'user-message/all' },
    find: { method: 'GET', path: 'user-message/find/{id}' },
    remove: { method: 'DELETE', path: 'user-message/delete/{id}' },
    save: { method: 'POST', path: 'user-message/action/{contactUs?}' },
    columns: ['name', 'email', 'replied', 'viewed', 'created'],
    listOptions: { noCreate: true },
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'subject', label: 'Subject' },
      { key: 'message', label: 'Message', type: 'textarea', wide: true },
      { key: 'reply', label: 'Reply', type: 'textarea', wide: true }
    ]
  },
  {
    key: 'profile',
    title: 'Profile',
    routePath: '/profile',
    list: { method: 'GET', path: 'profile' },
    save: { method: 'POST', path: 'update' },
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'username', label: 'Username' },
      { key: 'phone', label: 'Phone' }
    ]
  },
  {
    key: 'pos-terminal',
    title: 'POS terminal',
    routePath: '/pos',
    gate: 'pos_setting',
    pageComponent: 'pos-terminal'
  },
  {
    key: 'setting-languages',
    title: 'Languages',
    routePath: '/setting/languages',
    settingsLayout: true,
    gate: 'language',
    list: { method: 'GET', path: 'language/all' },
    find: { method: 'GET', path: 'language/find/{id}' },
    save: { method: 'POST', path: 'language/action/{id?}' },
    remove: { method: 'DELETE', path: 'language/delete/{id}' },
    columns: ['name', 'code', 'direction', 'status', 'created'],
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'code', label: 'Code', required: true },
      { key: 'direction', label: 'Direction', type: 'select', options: directionOptions },
      { key: 'default', label: 'Default', type: 'checkbox' },
      { key: 'predefined', label: 'Predefined', type: 'checkbox' },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions }
    ]
  }
]

export const adminResources = resourceEntries

export const adminResourceMap = Object.fromEntries(
  adminResources.map((resource) => [resource.key, resource])
) as Record<string, ResourceConfig>

export const adminNav: AdminNavItem[] = [
  { label: 'Dashboard', to: '/', resource: 'dashboard' },
  { label: 'Products', to: '/products', resource: 'products' },
  { label: 'Categories', to: '/categories', resource: 'categories' },
  { label: 'Sub categories', to: '/sub-categories', resource: 'sub-categories' },
  { label: 'Brands', to: '/brands', resource: 'brands' },
  { label: 'Attributes', to: '/attributes', resource: 'attributes' },
  { label: 'Tax rules', to: '/tax-rules', resource: 'tax-rules' },
  { label: 'Shipping rules', to: '/shipping-rules', resource: 'shipping-rules' },
  { label: 'Product collections', to: '/product-collections', resource: 'product-collections' },
  { label: 'Bundle deals', to: '/bundle-deals', resource: 'bundle-deals' },
  { label: 'Vouchers', to: '/vouchers', resource: 'vouchers' },
  { label: 'Flash sales', to: '/flash-sales', resource: 'flash-sales' },
  { label: 'Orders', to: '/orders', resource: 'orders' },
  { label: 'POS orders', to: '/pos/order', resource: 'pos-order' },
  { label: 'POS manager', to: '/pos/manager', resource: 'pos-terminal' },
  { label: 'Users', to: '/registered-users', resource: 'registered-users' },
  { label: 'Guests', to: '/guest-users', resource: 'guest-users' },
  { label: 'User addresses', to: '/user-addresses', resource: 'user-addresses' },
  { label: 'Subscribers', to: '/subscribers', resource: 'subscribers' },
  { label: 'Roles', to: '/roles-permissions', resource: 'roles-permissions' },
  { label: 'Admins/Vendors', to: '/admins-vendors', resource: 'admins-vendors' },
  { label: 'Withdrawal requests', to: '/withdrawal-requests', resource: 'withdrawal-requests' },
  { label: 'Pages', to: '/pages', resource: 'pages' },
  { label: 'Home slider', to: '/home-slider', resource: 'home-slider' },
  { label: 'Banners', to: '/banners', resource: 'banners' },
  { label: 'Footer links', to: '/footer-links', resource: 'footer-links' },
  { label: 'Footer image links', to: '/footer-image-links', resource: 'footer-image-links' },
  { label: 'Header links', to: '/header-links', resource: 'header-links' },
  { label: 'Site features', to: '/site-features', resource: 'site-features' },
  { label: 'Images', to: '/images', resource: 'images' },
  { label: 'Site setting', to: '/site-setting', resource: 'site-setting' },
  { label: 'Store', to: '/store', resource: 'store' },
  { label: 'Currency', to: '/setting/currency', resource: 'setting-currency' },
  { label: 'Payment', to: '/setting/payment', resource: 'setting-payment' },
  { label: 'Languages', to: '/setting/languages', resource: 'setting-languages' }
]

export const routeAliases: Record<string, string> = {
  '': 'dashboard',
  users: 'registered-users',
  'registered-users': 'registered-users',
  'user-addresses': 'user-addresses',
  profile: 'profile',
  'subscribers/send-email': 'subscribers-send-email',
  pos: 'pos-terminal',
  'pos/manager': 'pos-terminal',
  'pos/order': 'pos-order',
  'pos/configuration': 'pos-configuration',
  'user-messages': 'user-messages',
  'setting/plugins': 'setting-plugins',
  'setting/currency': 'setting-currency',
  'setting/address': 'setting-address',
  'setting/payment': 'setting-payment',
  'setting/social-login': 'setting-social-login',
  'setting/smtp': 'setting-smtp',
  'setting/media-storage': 'setting-media-storage',
  'setting/miscellaneous': 'setting-miscellaneous',
  'setting/analytics': 'setting-analytics',
  'setting/clear-cache': 'setting-clear-cache',
  'setting/languages': 'setting-languages'
}

export function resolveResourceKey(path: string) {
  const normalized = path.replace(/^\/+|\/+$/g, '')
  if (!normalized) return 'dashboard'
  if (routeAliases[normalized]) return routeAliases[normalized]

  const parts = normalized.split('/').filter(Boolean)
  const base = parts.length > 1 && parts[0] === 'setting'
    ? `${parts[0]}/${parts[1]}`
    : parts.length > 1 && parts[0] === 'subscribers'
      ? `${parts[0]}/${parts[1]}`
      : parts[0] || ''

  return routeAliases[base] || base
}
