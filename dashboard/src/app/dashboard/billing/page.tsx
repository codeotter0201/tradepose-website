"use client";

import { useSubscription, useCreateCheckout } from "@/lib/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Check, Zap, Building2 } from "lucide-react";
import { formatDate } from "@/lib/date";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    description: "For personal projects and testing",
    features: [
      "10,000 API requests/month",
      "1 API key",
      "Community support",
      "Basic analytics",
    ],
    icon: null,
    cta: "Current Plan",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For professional traders and small teams",
    features: [
      "100,000 API requests/month",
      "10 API keys",
      "Priority support",
      "Advanced analytics",
      "Webhook notifications",
      "Custom rate limits",
    ],
    icon: Zap,
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with custom needs",
    features: [
      "Unlimited API requests",
      "Unlimited API keys",
      "Dedicated support",
      "Custom SLA",
      "On-premise deployment",
      "Custom integrations",
    ],
    icon: Building2,
    cta: "Contact Sales",
    popular: false,
  },
];

function PlanCard({
  plan,
  currentPlan,
  onUpgrade,
  isUpgrading,
}: {
  plan: (typeof plans)[0];
  currentPlan: string;
  onUpgrade: (planId: string) => void;
  isUpgrading: boolean;
}) {
  const isCurrent = plan.id === currentPlan;
  const Icon = plan.icon;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`relative h-full transition-all duration-300 ${
          plan.popular
            ? "border-success shadow-lg shadow-success/10"
            : "hover:border-success/30"
        }`}
      >
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-success text-success-foreground">
              Most Popular
            </Badge>
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-success" />}
            <CardTitle>{plan.name}</CardTitle>
          </div>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">{plan.price}</span>
            <span className="text-muted-foreground">{plan.period}</span>
          </div>
          <ul className="space-y-2">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-success" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            variant={isCurrent ? "outline" : plan.popular ? "default" : "outline"}
            disabled={isCurrent || isUpgrading || plan.id === "enterprise"}
            onClick={() => onUpgrade(plan.id)}
          >
            {isCurrent ? "Current Plan" : plan.cta}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function BillingPage() {
  const { data: subscription, isLoading } = useSubscription();
  const upgradeMutation = useCreateCheckout();

  const currentPlan = subscription?.plan ?? "free";

  const handleUpgrade = (planId: string) => {
    upgradeMutation.mutate(planId, {
      onSuccess: (data) => {
        window.location.href = data.checkout_url;
      },
      onError: (error) => {
        toast.error("Failed to start checkout", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      },
    });
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      ) : (
        <>
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>
                  Your current plan and billing details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <Badge className="uppercase">{currentPlan}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant={
                      subscription?.status === "active" ? "default" : "secondary"
                    }
                  >
                    {subscription?.status ?? "Active"}
                  </Badge>
                </div>
                {subscription?.current_period_end && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Renews</span>
                    <span>{formatDate(subscription.current_period_end)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-lg font-semibold">Available Plans</h3>
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  currentPlan={currentPlan}
                  onUpgrade={handleUpgrade}
                  isUpgrading={upgradeMutation.isPending}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
