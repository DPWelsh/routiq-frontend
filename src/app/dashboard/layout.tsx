import { ClientDashboardLayout } from "@/components/layout/client-dashboard-layout"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <ClientDashboardLayout>
        {children}
      </ClientDashboardLayout>
    </AuthGuard>
  )
} 