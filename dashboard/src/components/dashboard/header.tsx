"use client";

import { UserButton } from "@clerk/react";
import { MobileSidebar } from "./sidebar";
import { GlobalSearch } from "./global-search";
import { NotificationBell } from "./notification-bell";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 flex-col border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <MobileSidebar />
          <h1 className="text-lg font-semibold lg:hidden">TradePose</h1>
          <div className="hidden lg:block">
            <GlobalSearch />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <div className="ml-2 border-l border-border pl-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
