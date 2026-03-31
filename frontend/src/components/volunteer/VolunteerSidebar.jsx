import {
    LayoutDashboard,
    ClipboardList,
    Clock,
    CheckCircle2,
    User,
    LogOut,
  } from "lucide-react";
  
  import { NavLink } from "@/components/NavLink";
  import { useNavigate } from "react-router-dom";
  import { toast } from "sonner";
  
  import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    useSidebar,
  } from "@/components/ui/sidebar";
  
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";
  import { volunteers } from "@/data/mockData";
  
      function getInitials(name) {
      if (!name) return "";

      return name
        .split(" ")             
        .map(word => word[0])   
        .join("")               
        .toUpperCase();
    }


  const currentVolunteer = JSON.parse(localStorage.getItem("user"));
  const name = currentVolunteer ? currentVolunteer.name : "Volunteer";
  const avatar = getInitials(name);
  console.log("avatar:", avatar);
  
  
  const mainNav = [
    { title: "Dashboard", url: "/volunteer", icon: LayoutDashboard },
    { title: "My Complaints", url: "/volunteer/complaints", icon: ClipboardList },
    { title: "In Progress", url: "/volunteer/in-progress", icon: Clock },
    { title: "Resolved", url: "/volunteer/resolved", icon: CheckCircle2 },
    { title: "Profile", url: "/profile", icon: User },
  ];
  
  export function VolunteerSidebar() {
    const { state } = useSidebar();
    const collapsed = state === "collapsed";
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user")
      toast.success("Logged out successfully");
      navigate("/login");
    };
  
    return (
      <Sidebar variant="inset" collapsible="icon">
        <SidebarContent>
          {/* Brand */}
          <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5 text-primary-foreground" />
            </div>
  
            {!collapsed && (
              <div className="overflow-hidden">
                <h2 className="text-sm font-bold text-sidebar-foreground truncate">
                  CivicIssue
                </h2>
                <p className="text-[10px] text-muted-foreground truncate">
                  Volunteer Portal
                </p>
              </div>
            )}
          </div>
  
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className="hover:bg-sidebar-accent/50 transition-colors"
                        activeClassName="bg-sidebar-accent text-primary font-medium"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
  
        <SidebarFooter className="border-t border-sidebar-border p-3">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {avatar}
                </AvatarFallback>
              </Avatar>
  
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">
                  {currentVolunteer.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  Volunteer
                </p>
              </div>
  
              <button
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center text-muted-foreground hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </SidebarFooter>
      </Sidebar>
    );
  }