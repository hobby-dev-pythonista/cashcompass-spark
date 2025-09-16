import { useState } from "react";
import { 
  LayoutDashboard, 
  Tag, 
  Receipt, 
  RefreshCw, 
  Upload,
  LogOut,
  Settings,
  TrendingUp,
  Wallet
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Expenses", url: "/expenses", icon: Receipt },
  { title: "Expense Types", url: "/expense-types", icon: Tag },
  { title: "Recurring", url: "/recurring", icon: RefreshCw },
  { title: "Bulk Upload", url: "/bulk-upload", icon: Upload },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar
      className="border-r border-border"
      collapsible="icon"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-foreground">FinanceTracker</h2>
              <p className="text-xs text-muted-foreground">Personal Finance</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/'}
                      className={getNavCls}
                    >
                      <item.icon className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'}`} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user info */}
      <SidebarFooter className="p-4 border-t border-border">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          {!isCollapsed && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 justify-start"
              disabled
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className={isCollapsed ? "w-full" : ""}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}