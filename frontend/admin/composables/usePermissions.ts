import { useAdminAuthStore } from '~/stores/adminAuth'
import { useAdminUiStore } from '~/stores/adminUi'
import type { PermissionAction } from '~/types/admin'

export function usePermissions() {
  const auth = useAdminAuthStore()
  const ui = useAdminUiStore()

  const permissionSet = computed(() => {
    const fromAuth = auth.profile?.permissions
    const fromUi = ui.profile?.permissions
    const list = fromAuth || fromUi || []
    return new Set(Array.isArray(list) ? list : [])
  })

  const isSuperAdmin = computed(() => {
    return Boolean(auth.profile?.super_admin || ui.profile?.super_admin)
  })

  function can(gate: string | undefined, action: PermissionAction = 'view') {
    if (!gate) return true
    if (isSuperAdmin.value) return true
    return permissionSet.value.has(`${gate}.${action}`)
  }

  return { can, isSuperAdmin, permissionSet }
}
