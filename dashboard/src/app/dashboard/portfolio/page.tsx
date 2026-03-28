"use client";

import { useState } from "react";
import { usePortfolios } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FolderOpen, Layers, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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

// Mock allocations data
const mockAllocations = [
  {
    id: "a1",
    portfolio_name: "Alpha Fund",
    strategy_name: "Trend Following",
    blueprint_name: "Long Trend",
    symbol: "BTCUSDT",
  },
  {
    id: "a2",
    portfolio_name: "Alpha Fund",
    strategy_name: "Mean Reversion",
    blueprint_name: "Base Blueprint",
    symbol: "EURUSD",
  },
  {
    id: "a3",
    portfolio_name: "Beta Portfolio",
    strategy_name: "Trend Following",
    blueprint_name: "Short Trend",
    symbol: "ETHUSDT",
  },
];

function PortfolioCard({ portfolio }: { portfolio: { id: string; name: string; binding_count?: number; account_count?: number } }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{portfolio.name}</CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{portfolio.account_count || 0} accounts</span>
                <span>•</span>
                <span>{portfolio.binding_count || 0} bindings</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="rounded-lg bg-muted p-2 text-center">
            <p className="text-xs text-muted-foreground">Accounts</p>
            <p className="font-semibold">{portfolio.account_count || 0}</p>
          </div>
          <div className="rounded-lg bg-muted p-2 text-center">
            <p className="text-xs text-muted-foreground">Bindings</p>
            <p className="font-semibold">{portfolio.binding_count || 0}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href={`/dashboard/portfolio/${portfolio.id}`}>
            Manage Portfolio
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function AllocationsList() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockAllocations.map((allocation) => (
        <Card key={allocation.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">{allocation.strategy_name}</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Portfolio: {allocation.portfolio_name}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Blueprint:</span>
                <Badge variant="outline">{allocation.blueprint_name}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Symbol:</span>
                <Badge>{allocation.symbol}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("portfolios");
  const { data: portfolios, isLoading } = usePortfolios();

  const portfoliosList = Array.isArray(portfolios) ? portfolios : [];

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
          <p className="text-muted-foreground">
            Manage portfolios and their strategy allocations.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Portfolio
        </Button>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="portfolios">
              <FolderOpen className="mr-2 h-4 w-4" />
              Portfolios
            </TabsTrigger>
            <TabsTrigger value="allocations">
              <Layers className="mr-2 h-4 w-4" />
              Allocations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolios" className="mt-6">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : portfoliosList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No Portfolios</h3>
                <p className="text-sm text-muted-foreground">
                  Create your first portfolio to get started.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {portfoliosList.map((portfolio) => (
                  <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="allocations" className="mt-6">
            <AllocationsList />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
