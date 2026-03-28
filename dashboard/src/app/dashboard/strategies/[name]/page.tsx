"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStrategy, useDeleteStrategy } from "@/lib/hooks";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Sparkles,
  Code,
  Zap,
  FileText,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function StrategyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const strategyName = params.name as string;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: strategy, isLoading } = useStrategy(strategyName);
  const deleteStrategy = useDeleteStrategy();

  const handleDelete = async () => {
    try {
      await deleteStrategy.mutateAsync(strategyName);
      setDeleteDialogOpen(false);
      router.push("/dashboard/strategies");
    } catch (error) {
      console.error("Failed to delete strategy:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-success"></div>
        </div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Strategy not found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The strategy you are looking for does not exist.
            </p>
            <Button asChild>
              <Link href="/dashboard/strategies">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Strategies
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allBlueprints = [
    { ...strategy.base_blueprint, isBase: true },
    ...strategy.advanced_blueprints.map((bp) => ({ ...bp, isBase: false })),
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/dashboard/strategies"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Strategies
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{strategy.name}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-success" />
              {strategy.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {strategy.note || "No description provided"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Strategy Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Base Instrument</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{strategy.base_instrument}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Base Frequency</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{strategy.base_freq}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{strategy.indicators.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Blueprints</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{allBlueprints.length}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="blueprints" className="space-y-6">
          <TabsList>
            <TabsTrigger value="blueprints">Blueprints</TabsTrigger>
            <TabsTrigger value="indicators">Indicators</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          {/* Blueprints Tab */}
          <TabsContent value="blueprints" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Trading Blueprints</h2>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Blueprint
              </Button>
            </div>

            <div className="grid gap-4">
              {allBlueprints.map((blueprint, index) => (
                <Card
                  key={index}
                  className={blueprint.isBase ? "border-success/50" : ""}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-base">
                          {blueprint.name}
                        </CardTitle>
                        {blueprint.isBase && (
                          <Badge variant="default" className="bg-success">
                            Base
                          </Badge>
                        )}
                        <Badge
                          variant={blueprint.direction === "long" ? "default" : "secondary"}
                        >
                          {blueprint.direction.toUpperCase()}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    {blueprint.trend_type && (
                      <CardDescription>Trend: {blueprint.trend_type}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Entry Triggers */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-success" />
                        Entry Triggers ({blueprint.entry_triggers.length})
                      </h4>
                      <div className="space-y-2">
                        {blueprint.entry_triggers.map((trigger, idx) => (
                          <div
                            key={idx}
                            className="text-sm bg-muted p-2 rounded-md font-mono"
                          >
                            {trigger.condition}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exit Triggers */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        Exit Triggers ({blueprint.exit_triggers.length})
                      </h4>
                      <div className="space-y-2">
                        {blueprint.exit_triggers.map((trigger, idx) => (
                          <div
                            key={idx}
                            className="text-sm bg-muted p-2 rounded-md font-mono"
                          >
                            {trigger.condition}
                          </div>
                        ))}
                      </div>
                    </div>

                    {blueprint.note && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">
                          <FileText className="h-4 w-4 inline mr-1" />
                          {blueprint.note}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Indicators Tab */}
          <TabsContent value="indicators" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Indicators</h2>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Indicator
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {strategy.indicators.map((indicator, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">{indicator.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <code className="text-sm bg-muted p-2 rounded-md block overflow-x-auto">
                      {indicator.expr}
                    </code>
                    {indicator.output_type && (
                      <Badge variant="outline" className="mt-2">
                        {indicator.output_type}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Configuration</CardTitle>
                <CardDescription>
                  Advanced configuration options for this strategy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {strategy.volatility_indicator && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Volatility Indicator</h4>
                    <pre className="text-sm bg-muted p-3 rounded-md overflow-x-auto">
                      {JSON.stringify(strategy.volatility_indicator, null, 2)}
                    </pre>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium mb-2">Full Configuration</h4>
                  <pre className="text-sm bg-muted p-3 rounded-md overflow-x-auto max-h-96">
                    {JSON.stringify(strategy, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Strategy</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{strategy.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteStrategy.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteStrategy.isPending}
            >
              {deleteStrategy.isPending ? "Deleting..." : "Delete Strategy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Plus } from "lucide-react";
