"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon | React.ComponentType<any>
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { state, setOpen } = useSidebar()
  const [collapsibleStates, setCollapsibleStates] = useState<Record<string, boolean>>({})
  
  // Reset collapsible states when sidebar collapses
  useEffect(() => {
    if (state === "collapsed") {
      setCollapsibleStates({})
    }
  }, [state])
  
  const handleItemClick = (item: any, event: React.MouseEvent) => {
    // If sidebar is collapsed and the item has children, expand the sidebar
    if (state === "collapsed" && item.items && item.items.length > 0) {
      event.preventDefault()
      event.stopPropagation()
      setOpen(true)
      // Set the collapsible to open after sidebar expands
      setTimeout(() => {
        setCollapsibleStates(prev => ({ ...prev, [item.title]: true }))
      }, 100)
    }
  }
  
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={collapsibleStates[item.title] || item.isActive}
            onOpenChange={(open) => setCollapsibleStates(prev => ({ ...prev, [item.title]: open }))}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  tooltip={item.title}
                  className={item.isActive ? "bg-white/10 text-white hover:bg-white/20" : "hover:bg-white/5 text-gray-400 hover:text-white"}
                  asChild={!item.items || item.items.length === 0}
                  onClick={(event) => handleItemClick(item, event)}
                >
                  {!item.items || item.items.length === 0 ? (
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  ) : (
                    <>
                      {item.icon && <item.icon />}
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </>
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {state !== "collapsed" && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
