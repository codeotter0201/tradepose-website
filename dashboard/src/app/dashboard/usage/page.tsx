"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, TrendingUp, Calendar } from "lucide-react";
import { formatDate } from "@/lib/date";
import { useUsageStats } from "@/lib/hooks";
import { StatCard, StatsGrid } from "@/components/dashboard/stat-card";
import { UsageChartEnhanced } from "@/components/dashboard/usage-chart-enhanced";
import { motion } from "framer-motion";

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

function UsageTable({ data, loading }: { data: { date: string; requests: number }[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 w-full animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Activity className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No Usage Data</h3>
        <p className="text-sm text-muted-foreground">
          Start making API requests to see your usage statistics.
        </p>
      </div>
    );
  }

  const sortedData = [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Requests</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((item) => (
          <TableRow key={item.date}>
            <TableCell>{formatDate(item.date)}</TableCell>
            <TableCell className="text-right font-mono">
              {item.requests.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function UsagePage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const { usage, totalRequests, avgDaily, maxDaily, trend, isLoading } = useUsageStats(period);

  const periodLabel = period === "7d" ? "7 Days" : period === "30d" ? "30 Days" : "90 Days";

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold tracking-tight">Usage Statistics</h2>
        <p className="text-muted-foreground">
          Monitor your API usage and track request patterns.
        </p>
      </motion.div>

      <StatsGrid>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Requests"
            value={totalRequests.toLocaleString()}
            icon={Activity}
            trend={{ value: trend, label: "vs previous period" }}
            loading={isLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Average Daily"
            value={avgDaily.toLocaleString()}
            description="requests per day"
            icon={TrendingUp}
            loading={isLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Peak Daily"
            value={maxDaily.toLocaleString()}
            description="highest single day"
            icon={TrendingUp}
            loading={isLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Period"
            value={periodLabel}
            description="current view"
            icon={Calendar}
            loading={false}
          />
        </motion.div>
      </StatsGrid>

      <motion.div variants={itemVariants}>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
          <TabsList className="mb-4">
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>

          <TabsContent value={period} className="space-y-6 mt-0">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-success/5">
              <CardHeader>
                <CardTitle>Usage Trend</CardTitle>
                <CardDescription>
                  API requests over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsageChartEnhanced data={usage} loading={isLoading} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Breakdown</CardTitle>
                <CardDescription>
                  Detailed view of daily API requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsageTable data={usage} loading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
