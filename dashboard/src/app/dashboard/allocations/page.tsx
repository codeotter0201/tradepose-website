"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, Layers, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AllocationsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <Layers className="h-10 w-10 text-success" />
        </div>

        {/* Badge */}
        <Badge variant="secondary" className="mb-4">
          <Clock className="mr-1 h-3 w-3" />
          Coming Soon
        </Badge>

        {/* Title */}
        <h1 className="mb-4 text-3xl font-bold tracking-tight">
          Strategy Allocations
        </h1>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
          Allocate strategies and blueprints to your portfolios. Map trading 
          instruments and configure how signals are distributed across your 
          trading accounts.
        </p>

        {/* Feature Preview Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Portfolio Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Link strategies to portfolios with specific blueprints
              </p>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Instrument Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Map theoretical instruments to actual trading symbols
              </p>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Auto-Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Automatically generate engagement configs from allocations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <Button variant="outline" asChild>
          <Link href="/dashboard/portfolios">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolios
          </Link>
        </Button>

        {/* Notification Signup */}
        <div className="mt-12 rounded-lg border bg-card p-6">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>Want early access? Contact us at </span>
            <a 
              href="mailto:support@tradepose.com" 
              className="text-success hover:underline"
            >
              support@tradepose.com
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
