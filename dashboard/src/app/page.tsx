"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Key, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Key,
    title: "API Key Management",
    description:
      "Create, manage, and revoke API keys with ease. Track usage and set permissions.",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description:
      "Monitor your API usage with detailed charts and insights. Track trends over time.",
  },
  {
    icon: Zap,
    title: "High Performance",
    description:
      "Built on Rust for maximum performance. Handle thousands of requests per second.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade security with JWT authentication and encrypted data transmission.",
  },
];

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success">
              <span className="text-sm font-bold text-success-foreground">
                TP
              </span>
            </div>
            <span className="text-lg font-semibold">TradePose</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Quantitative Trading
              <br />
              <span className="text-success">Made Simple</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              TradePose is a powerful quantitative trading platform that helps
              you build, test, and deploy trading strategies with ease.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="https://docs.tradepose.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  Documentation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-card py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything you need to trade smarter
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A complete platform for quantitative trading
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-lg border border-border bg-background p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                    <feature.icon className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-card p-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to get started?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Create your free account and start trading in minutes.
              </p>
              <div className="mt-8">
                <Link href="/sign-up">
                  <Button size="lg" className="gap-2">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-success">
                <span className="text-xs font-bold text-success-foreground">
                  TP
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                TradePose &copy; {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link
                href="https://docs.tradepose.com"
                className="hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
