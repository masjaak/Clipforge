import { useLocation, Link } from "react-router";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator,
  useSidebar,
} from "../ui/sidebar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../ui/utils";

const navMain = [
  { title: "Dashboard", url: "/dashboard" },
  { title: "Projects", url: "/projects" },
  { title: "Clips", url: "/clips" },
  { title: "Exports", url: "/exports" },
];

const navTools = [
  { title: "Templates", url: "/templates" },
  { title: "Settings", url: "/settings" },
  { title: "Billing", url: "/billing" },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (url: string) => location.pathname === url || location.pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="pb-2">
        <div className={cn("flex items-center gap-2.5 px-2 py-1", collapsed && "justify-center")}>
          <div className="size-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm tracking-tight text-foreground">
              ClipForge
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/60 uppercase tracking-widest text-[10px]">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(
                      "rounded-lg transition-all",
                      isActive(item.url)
                        ? "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                    )}
                  >
                    <Link to={item.url}>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/60 uppercase tracking-widest text-[10px]">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navTools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(
                      "rounded-lg transition-all",
                      isActive(item.url)
                        ? "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                    )}
                  >
                    <Link to={item.url}>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent rounded-lg"
                >
                  <Avatar className="size-7 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary/20 text-primary text-xs">U</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left text-xs leading-tight">
                    <span className="font-medium text-foreground truncate">User</span>
                    <span className="text-muted-foreground truncate">user@team.io</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-56 bg-card border-border"
              >
                <DropdownMenuItem className="cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
