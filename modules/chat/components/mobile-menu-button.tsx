"use client";

import { IconButton } from "@/components/ui/icon-button";
import { MenuIcon } from "@/components/ui/icons";
import { useSidebarContext } from "@/modules/sidebar/sidebar-context";

export function MobileMenuButton() {
  const { openMobileSidebar } = useSidebarContext();

  return (
    <IconButton label="Open sidebar" onClick={openMobileSidebar} className="md:hidden">
      <MenuIcon className="h-5 w-5" />
    </IconButton>
  );
}
