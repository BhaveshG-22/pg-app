"use client"

import * as React from "react"
import Link from "next/link"
import {
  Home,
  Settings2,
  Users2,
  Bookmark,
  ChevronLeft,
  Menu,
  ImageIcon,
  Heart,
  Sparkles,
  Bug,
  User,
  Mountain,
  Camera,
  Clock,
  Images,
  CreditCard,
  ShoppingCart,
  BarChart3,
  Crown,
  Bell,
  Upload,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePresets } from "@/contexts/PresetContext"

// Static navigation data
const getNavigationData = (studioItems: any[]) => ({
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Studio",
      // url: studioItems.length > 0 ? `/studio/${studioItems[0].slug || studioItems[0].id}` : "/studio/1",
      url: "/studio",
      icon: Sparkles,
      items: studioItems.map((preset: any) => ({
        title: preset.title,
        url: `/studio/${preset.slug || preset.id}`,
      })),
    },
    {
      title: "My Creations",
      url: "#",
      icon: ImageIcon,
      items: [
        {
          title: "All Images",
          url: "/dashboard/creations/all",
          icon: Images,
        },
        {
          title: "Favorites",
          url: "/dashboard/creations/favorites", 
          icon: Heart,
        },
        {
          title: "History",
          url: "/dashboard/creations/history",
          icon: Clock,
        },
      ],
    },
    {
      title: "Credits",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Buy Credits",
          url: "/dashboard/credits/buy",
          icon: ShoppingCart,
        },
        {
          title: "Usage",
          url: "/dashboard/credits/usage",
          icon: BarChart3,
        },
        {
          title: "Plans",
          url: "/dashboard/credits/plans",
          icon: Crown,
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/dashboard/settings/profile",
          icon: User,
        },
        {
          title: "Upload Preferences",
          url: "/dashboard/settings/upload",
          icon: Upload,
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/notifications",
          icon: Bell,
        },
      ],
    },
  ],
});


function SidebarToggleButton() {
  const { state, toggleSidebar } = useSidebar()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={toggleSidebar}
        className="hover:!bg-transparent hover:!text-sidebar-foreground active:!bg-transparent justify-start"
      >
        {state === "collapsed" ? (
          <Menu className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const { presets, loading } = usePresets()
  
  const navigationData = React.useMemo(() => {
    return getNavigationData(presets)
  }, [presets])

  if (loading) {
    return (
      <Sidebar collapsible="icon" className="select-none" {...props}>
        <SidebarContent className="px-4 mt-1">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sidebar-foreground"></div>
          </div>
        </SidebarContent>
        <SidebarFooter className="px-4 pb-3">
          <SidebarMenu className="space-y-1">
            <SidebarToggleButton />
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
  }

  return (
    <Sidebar collapsible="icon" className="select-none" {...props}>
      <SidebarContent className="px-4 mt-1">
        <NavMain items={navigationData.navMain} />
      </SidebarContent>
      <SidebarFooter className="px-4 pb-3">
        <SidebarMenu className="space-y-1">
          {/* Report Issue Button - Only visible when sidebar is expanded */}
          {state !== "collapsed" && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="hover:!bg-transparent hover:!text-red-300 active:!bg-transparent justify-start text-red-400"
              >
                <Link href="/report-issue">
                  <Bug className="h-5 w-5" />
                  <span>Report an Issue</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          <SidebarToggleButton />
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
