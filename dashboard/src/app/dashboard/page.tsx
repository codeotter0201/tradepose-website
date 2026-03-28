"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Key, TrendingUp, CreditCard, ArrowRight } from "lucide-react";
import { useDashboardStats } from "@/lib/hooks";
import { StatCard, StatsGrid } from "@/components/dashboard/stat-card";
import { UsageChartEnhanced } from "@/components/dashboard/usage-chart-enhanced";
import { RecentKeys } from "@/components/dashboard/recent-keys";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function DashboardPage() {
  const {
    totalRequests,
    activeKeys,
    totalKeys,
    quotaUsed,
    quotaLimit,
    quotaPercent,
    plan,
    planStatus,
    usage,
    keys,
    isLoading,
  } = useDashboardStats();

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your account overview.
        </p>
      </motion.div>

      <StatsGrid>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Requests"
            value={totalRequests.toLocaleString()}
            description="Last 30 days"
            icon={Activity}
            loading={isLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Active API Keys"
            value={activeKeys}
            description={`${totalKeys} total keys`}
            icon={Key}
            loading={isLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Quota Usage"
            value={`${quotaPercent}%`}
            description={`${quotaUsed.toLocaleString()} / ${quotaLimit.toLocaleString()}`}
            icon={TrendingUp}
            loading={isLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Current Plan"
            value={plan.toUpperCase()}
            description={planStatus}
            icon={CreditCard}
            loading={isLoading}
          />
        </motion.div>
      </StatsGrid>

      <motion.div
        className="grid gap-6 lg:grid-cols-7"
        variants={itemVariants}
      >
        <Card className="lg:col-span-4 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-success/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Usage Trend</CardTitle>
            <Link href="/dashboard/usage">
              <Button variant="ghost" size="sm" className="gap-1">
                View Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <UsageChartEnhanced data={usage} loading={isLoading} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-success/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent API Keys</CardTitle>
            <Link href="/dashboard/api-keys">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <RecentKeys keys={keys} loading={isLoading} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
