export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      app: {
        title: 'Admin panel',
        search: 'Search',
        save: 'Save',
        create: 'Create',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        logout: 'Logout',
        loading: 'Loading...',
        noData: 'No data found',
        confirmDelete: 'Delete this item?',
        upload: 'Upload',
        import: 'Import',
        export: 'Export'
      }
    }
  }
}))
