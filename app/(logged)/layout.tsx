import { AuthGuard } from "@/auth/guard";
import { FiltersCleanup } from "@/components/filters-cleanup";
import { AppNavbar } from "@/components/navbar";
import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function LoggedLayout({ children }: Props) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-muted">
          <AppNavbar />
          {children}
          <FiltersCleanup />
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
