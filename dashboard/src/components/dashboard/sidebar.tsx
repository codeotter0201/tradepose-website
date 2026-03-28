"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Key,
  BarChart3,
  CreditCard,
  Settings,
  Menu,
  X,
  Zap,
  Wallet,
  FolderOpen,
  Beaker,
  Cpu,
  Sparkles,
  Plus,
  CandlestickChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { motion } from "framer-motion";

// ========== Navigation Groups ==========
interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  soon?: boolean;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Trading",
    icon: Wallet,
    items: [
      { name: "Instruments", href: "/dashboard/instruments", icon: CandlestickChart },
      { name: "Strategy", href: "/dashboard/strategies", icon: Sparkles },
      { name: "Portfolio", href: "/dashboard/portfolio", icon: FolderOpen },
      { name: "Backtests", href: "/dashboard/backtests", icon: Beaker },
    ],
  },
  {
    label: "Automation",
    icon: Cpu,
    items: [
      { name: "Accounts", href: "/dashboard/accounts", icon: Wallet },
      { name: "Engagements", href: "/dashboard/engagements", icon: Cpu },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    items: [
      { name: "Usage", href: "/dashboard/usage", icon: BarChart3 },
      { name: "API Keys", href: "/dashboard/api-keys", icon: Key },
      { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

// ========== Nav Group Component ==========
function NavGroupSection({
  group,
  onItemClick,
}: {
  group: NavGroup;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="px-3 py-2">
      {/* Group Label */}
      <div className="mb-2 flex items-center gap-2 px-3">
        <group.icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {group.label}
        </span>
      </div>

      {/* Group Items */}
      <nav className="flex flex-col gap-0.5">
        {group.items.map((item, index) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                href={item.soon ? "#" : item.href}
                onClick={(e) => {
                  if (item.soon) {
                    e.preventDefault();
                    return;
                  }
                  onItemClick?.();
                }}
                className={cn(
                  "group relative flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-success/10 text-success"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  item.soon && "opacity-60 cursor-not-allowed hover:bg-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-success"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {item.soon && (
                  <Badge
                    variant="secondary"
                    className="h-5 px-1.5 text-[10px] font-normal"
                  >
                    Soon
                  </Badge>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );
}

// ========== Separator Component ==========
function SidebarSeparator() {
  return (
    <div className="my-2 px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}

// ========== Quick Actions ==========
function QuickActions() {
  return (
    <div className="px-3 py-2">
      <div className="mb-2 flex items-center gap-2 px-3">
        <Plus className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Actions
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-2 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/dashboard/accounts">
            <Plus className="h-4 w-4" />
            Add Account
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-2 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/dashboard/portfolios">
            <Plus className="h-4 w-4" />
            Create Portfolio
          </Link>
        </Button>
      </div>
    </div>
  );
}

// ========== Upgrade Card ==========
function UpgradeCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-success/20 bg-gradient-to-br from-success/10 to-transparent p-4">
      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/20">
            <Zap className="h-4 w-4 text-success" />
          </div>
          <span className="font-semibold text-sm">Upgrade to Pro</span>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Get 10x more API requests and advanced features.
        </p>
        <Link href="/dashboard/billing">
          <Button size="sm" className="w-full bg-success hover:bg-success/90">
            Upgrade Now
          </Button>
        </Link>
      </div>
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-success/5 blur-2xl" />
    </div>
  );
}

// ========== Main Sidebar ==========
export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      {/* Header */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success transition-transform group-hover:scale-110">
            <span className="text-sm font-bold text-success-foreground">TP</span>
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            TradePose
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* Dashboard Group */}
        <NavGroupSection group={navigationGroups[0]} />

        <SidebarSeparator />

        {/* Trading Group */}
        <NavGroupSection group={navigationGroups[1]} />

        <SidebarSeparator />

        {/* Automation Group */}
        <NavGroupSection group={navigationGroups[2]} />

        <SidebarSeparator />

        {/* Settings Group */}
        <NavGroupSection group={navigationGroups[3]} />
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-4">
        <QuickActions />
        <UpgradeCard />
      </div>
    </aside>
  );
}

// ========== Mobile Sidebar ==========
export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-sidebar p-0">
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success">
              <span className="text-sm font-bold text-success-foreground">TP</span>
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">
              TradePose
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex h-[calc(100vh-4rem)] flex-col overflow-y-auto py-2">
          <NavGroupSection group={navigationGroups[0]} onItemClick={() => setOpen(false)} />
          <SidebarSeparator />
          <NavGroupSection group={navigationGroups[1]} onItemClick={() => setOpen(false)} />
          <SidebarSeparator />
          <NavGroupSection group={navigationGroups[2]} onItemClick={() => setOpen(false)} />
          <SidebarSeparator />
          <NavGroupSection group={navigationGroups[3]} onItemClick={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
