"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, Layers, Mail, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BlueprintsPage() {
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
          Blueprint Configuration
        </h1>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
          Create strategy blueprints with specific entry and exit triggers. 
          Define directional preferences and trend classifications for each variant.
        </p>

        {/* Feature Preview Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Entry Triggers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Configure entry conditions with multiple trigger types
              </p>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Exit Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Define stop loss, take profit, and trailing stop rules
              </p>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Direction & Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Set Long/Short direction and trend type classification
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Documentation Link */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/dashboard/positions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Positions
            </Link>
          </Button>
        </div>

        {/* Learn More */}
        <Card className="mb-6 border-dashed bg-muted/50">
          <CardContent className="flex items-center justify-center gap-4 py-6">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Learn more about blueprint configuration in our documentation
            </p>
            <Button variant="link" size="sm" className="text-success">
              View Docs
            </Button>
          </CardContent>
        </Card>

        {/* Notification Signup */}
        <div className="rounded-lg border bg-card p-6">
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
