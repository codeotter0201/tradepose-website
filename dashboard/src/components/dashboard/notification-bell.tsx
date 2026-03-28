"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success";
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to TradePose",
    description: "Your account has been successfully created.",
    time: "2 hours ago",
    read: false,
    type: "success",
  },
  {
    id: "2",
    title: "API Quota at 80%",
    description: "You have used 80% of your monthly API quota.",
    time: "1 day ago",
    read: false,
    type: "warning",
  },
];

export function NotificationBell() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-success text-[10px] font-medium text-success-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between border-b pb-3">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {notifications.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex cursor-pointer flex-col gap-1 rounded-lg p-3 transition-colors hover:bg-muted",
                  !notification.read && "bg-muted/50"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.read && (
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-success" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {notification.description}
                </p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
