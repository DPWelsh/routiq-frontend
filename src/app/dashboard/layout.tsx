import { ClientDashboardLayout } from "@/components/layout/client-dashboard-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { TourLauncher } from "@/components/onboarding/tour-launcher"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
    <ClientDashboardLayout>
      {children}
      <TourLauncher />
    </ClientDashboardLayout>
    </AuthGuard>
  )
} 