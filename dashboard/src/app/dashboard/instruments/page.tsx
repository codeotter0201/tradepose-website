"use client";

import { useState } from "react";
import { useInstruments } from "@/lib/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
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

export default function InstrumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [accountSource, setAccountSource] = useState<string>("all");
  const [marketType, setMarketType] = useState<string>("all");

  const { data: instrumentsData, isLoading } = useInstruments({
    symbol: searchQuery || undefined,
    account_source: accountSource === "all" ? undefined : accountSource,
    market_type: marketType === "all" ? undefined : marketType,
    limit: 100,
  });

  const instruments = instrumentsData?.instruments || [];
  const totalCount = instrumentsData?.total || 0;

  // Stats
  const futuresCount = instruments.filter((i) => i.market_type === "futures").length;
  const spotCount = instruments.filter((i) => i.market_type === "spot").length;
  const activeCount = instruments.filter((i) => i.status === "active").length;

  const clearFilters = () => {
    setSearchQuery("");
    setAccountSource("all");
    setMarketType("all");
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold tracking-tight">Trading Instruments</h2>
        <p className="text-muted-foreground">
          Browse available trading instruments and their specifications.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants}>
        <StatsGrid>
          <StatCard
            title="Total Instruments"
            value={totalCount}
            description="Available for trading"
            icon={BarChart3}
            loading={isLoading}
          />
          <StatCard
            title="Futures"
            value={futuresCount}
            description="Futures contracts"
            icon={TrendingUp}
            loading={isLoading}
          />
          <StatCard
            title="Spot"
            value={spotCount}
            description="Spot markets"
            icon={TrendingDown}
            loading={isLoading}
          />
          <StatCard
            title="Active"
            value={activeCount}
            description="Currently active"
            icon={BarChart3}
            loading={isLoading}
          />
        </StatsGrid>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by symbol (e.g., BTC, EURUSD)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={accountSource} onValueChange={setAccountSource}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Account Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="BINANCE">Binance</SelectItem>
                  <SelectItem value="FTMO">FTMO</SelectItem>
                  <SelectItem value="FIVEPERCENT">5%ers</SelectItem>
                </SelectContent>
              </Select>
              <Select value={marketType} onValueChange={setMarketType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Market Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Markets</SelectItem>
                  <SelectItem value="spot">Spot</SelectItem>
                  <SelectItem value="futures">Futures</SelectItem>
                </SelectContent>
              </Select>
              {(searchQuery || accountSource !== "all" || marketType !== "all") && (
                <Button variant="ghost" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Instruments Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Instruments List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : instruments.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No instruments found matching your criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Market</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead className="text-right">Tick Size</TableHead>
                      <TableHead className="text-right">Lot Size</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {instruments.map((instrument) => (
                      <TableRow key={instrument.id}>
                        <TableCell className="font-medium">
                          {instrument.symbol}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {instrument.broker_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {instrument.account_source}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={instrument.market_type === "futures" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {instrument.market_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {instrument.base_currency}/{instrument.quote_currency}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs">
                          {instrument.tick_size}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs">
                          {instrument.lot_size}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={instrument.status === "active" ? "default" : "secondary"}
                            className={
                              instrument.status === "active"
                                ? "bg-green-500 text-white"
                                : ""
                            }
                          >
                            {instrument.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
