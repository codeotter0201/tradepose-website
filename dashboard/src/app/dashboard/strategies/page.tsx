"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useStrategies, useDeleteStrategy } from "@/lib/hooks";
import { Plus, Search, Trash2, Edit, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function StrategiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: strategiesResponse, isLoading } = useStrategies();
  const deleteStrategy = useDeleteStrategy();

  const strategies = strategiesResponse?.strategies ?? [];

  const filteredStrategies = strategies.filter((strategy) =>
    strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    strategy.base_instrument.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-success"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-success" />
              Strategies
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your trading strategies and blueprints
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/strategies/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Strategy
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search strategies by name or instrument..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Strategies Grid */}
      {filteredStrategies.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No strategies yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm text-center">
              Create your first trading strategy to define indicators, volatility measures, and trading rules.
            </p>
            <Button asChild>
              <Link href="/dashboard/strategies/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Strategy
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStrategies.map((strategy, index) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/dashboard/strategies/${strategy.name}`}>
                <Card className="group hover:border-success/50 hover:shadow-md transition-all cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg group-hover:text-success transition-colors">
                          {strategy.name}
                        </CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {strategy.note || "No description"}
                        </CardDescription>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-success transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Instrument:</span>
                        <Badge variant="outline">{strategy.base_instrument}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Frequency:</span>
                        <Badge variant="outline">{strategy.base_freq}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Blueprints:</span>
                        <Badge variant="secondary">
                          1 base + {strategy.advanced_blueprints.length} advanced
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
