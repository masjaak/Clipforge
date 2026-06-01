import { Outlet, Navigate } from "react-router";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../ui/sidebar";

const MOCK_AUTHED = true;

export function AuthLayout() {
  if (!MOCK_AUTHED) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="bg-background min-h-screen">
        <header className="flex h-12 items-center gap-2 px-4 border-b border-border/50 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="h-4 w-px bg-border/50" />
          <BreadcrumbArea />
        </header>
        <div className="flex-1">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function BreadcrumbArea() {
  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <span className="text-foreground/40">ClipForge</span>
    </div>
  );
}
