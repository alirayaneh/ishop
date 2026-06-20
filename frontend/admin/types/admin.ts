export type HttpMethod = 'GET' | 'POST' | 'DELETE'

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete'

export interface AdminEndpoint {
  method: HttpMethod
  path: string
}

export interface FieldConfig {
  key: string
  label: string
  type?: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'file' | 'password' | 'email' | 'date' | 'datetime-local' | 'richtext' | 'array' | 'json'
  required?: boolean
  wide?: boolean
  options?: Array<{ label: string; value: string | number | boolean }>
  hint?: string
  accept?: string
  multiple?: boolean
}

export interface ListOptions {
  noCreate?: boolean
  noBulk?: boolean
  noDelete?: boolean
  noEdit?: boolean
  defaultSort?: string
  defaultSortType?: 'asc' | 'desc'
  searchPlaceholder?: string
}

export interface ResourceConfig {
  key: string
  title: string
  routePath?: string
  gate?: string
  list?: AdminEndpoint
  find?: AdminEndpoint
  save?: AdminEndpoint
  remove?: AdminEndpoint
  upload?: AdminEndpoint
  export?: AdminEndpoint
  import?: AdminEndpoint
  columns?: string[]
  columnLabels?: Record<string, string>
  fields?: FieldConfig[]
  listOptions?: ListOptions
  pageComponent?: string
  uploadFields?: string[]
  settingsLayout?: boolean
}

export interface AdminNavItem {
  label: string
  to: string
  resource?: string
  gate?: string
}

export interface AdminNavGroup {
  id: string
  label: string
  items: AdminNavItem[]
}
