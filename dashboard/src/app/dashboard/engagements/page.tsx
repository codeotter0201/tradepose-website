"use client";

import { useState } from "react";
import { useEngagements, useCloseEngagement } from "@/lib/hooks";
import { type Engagement } from "@/lib/api";
import { formatDistanceToNow } from "@/lib/date";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  MoreVertical,
  Target,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Crosshair,
  X,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { StatCard, StatsGrid } from "@/components/dashboard/stat-card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const phaseColors: Record<string, string> = {
  pending: "bg-yellow-500",
  entering: "bg-blue-500",
  holding: "bg-green-500",
  exiting: "bg-orange-500",
  closed: "bg-gray-500",
};

function EngagementsStats({ engagements, loading }: { engagements: Engagement[]; loading: boolean }) {
  const activePositions = engagements.filter((e) => e.phase !== "closed").length;
  const longPositions = engagements.filter((e) => e.direction === "long" && e.phase !== "closed").length;
  const shortPositions = engagements.filter((e) => e.direction === "short" && e.phase !== "closed").length;
  const totalUnrealizedPnl = engagements
    .filter((e) => e.phase !== "closed")
    .reduce((sum, e) => sum + (e.unrealized_pnl || 0), 0);

  return (
    <StatsGrid>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Active Engagements"
          value={activePositions}
          description="Open trades"
          icon={Target}
          loading={loading}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Long"
          value={longPositions}
          description="Buy direction"
          icon={TrendingUp}
          loading={loading}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Short"
          value={shortPositions}
          description="Sell direction"
          icon={TrendingDown}
          loading={loading}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Unrealized PnL"
          value={`$${totalUnrealizedPnl.toFixed(2)}`}
          description="Current session"
          icon={DollarSign}
          loading={loading}
          trend={totalUnrealizedPnl >= 0 ? { value: 0, label: "Profit" } : { value: 0, label: "Loss" }}
        />
      </motion.div>
    </StatsGrid>
  );
}

function EngagementCard({ engagement }: { engagement: Engagement }) {
  const closeMutation = useCloseEngagement();
  const isProfit = (engagement.unrealized_pnl || 0) >= 0;
  const isActive = engagement.phase !== "closed";

  const handleClose = () => {
    if (confirm(`Close engagement in ${engagement.instrument_symbol}?`)) {
      closeMutation.mutate(engagement.id, {
        onSuccess: () => toast.success("Engagement closed"),
        onError: (error) =>
          toast.error("Failed to close", {
            description: error instanceof Error ? error.message : "Unknown error",
          }),
      });
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${engagement.direction === "long" ? "bg-green-500/10" : "bg-red-500/10"}`}>
              {engagement.direction === "long" ? (
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div>
              <CardTitle className="text-base">{engagement.instrument_symbol}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs capitalize">{engagement.direction}</Badge>
                <Badge className={`text-xs text-white ${phaseColors[engagement.phase] || "bg-gray-500"}`}>
                  {engagement.phase}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isActive && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleClose} disabled={closeMutation.isPending}>
                    <X className="mr-2 h-4 w-4 text-destructive" />
                    Close
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Quantity</p>
            <p className="font-semibold">{engagement.quantity.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Entry</p>
            <p className="font-semibold">${engagement.entry_price?.toFixed(4) || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="font-semibold">${engagement.current_price?.toFixed(4) || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">PnL</p>
            <p className={`font-semibold ${isProfit ? "text-green-500" : "text-red-500"}`}>
              ${engagement.unrealized_pnl?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>

        {(engagement.stop_loss || engagement.take_profit) && (
          <div className="mt-3 rounded-lg bg-muted p-2 text-xs">
            {engagement.stop_loss && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">SL</span>
                <span className="font-mono">${engagement.stop_loss.toFixed(4)}</span>
              </div>
            )}
            {engagement.take_profit && (
              <div className="flex items-center justify-between mt-1">
                <span className="text-muted-foreground">TP</span>
                <span className="font-mono">${engagement.take_profit.toFixed(4)}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatDistanceToNow(engagement.created_at)}
        </div>
      </CardContent>
    </Card>
  );
}

function EngagementsList({
  engagements,
  loading,
}: {
  engagements: Engagement[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (engagements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Crosshair className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No Active Engagements</h3>
        <p className="text-sm text-muted-foreground">
          No engagement configs or trades available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {engagements.map((engagement) => (
        <EngagementCard key={engagement.id} engagement={engagement} />
      ))}
    </div>
  );
}

export default function EngagementsPage() {
  const [activeTab, setActiveTab] = useState("active");
  const { data: allEngagements, isLoading } = useEngagements();

  const engagements = Array.isArray(allEngagements) ? allEngagements : [];
  const activeEngagements = engagements.filter((e) => e.phase !== "closed");
  const closedEngagements = engagements.filter((e) => e.phase === "closed");

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold tracking-tight">Engagements</h2>
        <p className="text-muted-foreground">
          Monitor automated trading engagements and their lifecycle.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <EngagementsStats engagements={activeEngagements} loading={isLoading} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">Active ({activeEngagements.length})</TabsTrigger>
            <TabsTrigger value="history">History ({closedEngagements.length})</TabsTrigger>
            <TabsTrigger value="all">All ({engagements.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <EngagementsList engagements={activeEngagements} loading={isLoading} />
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <EngagementsList engagements={closedEngagements} loading={isLoading} />
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            <EngagementsList engagements={engagements} loading={isLoading} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
