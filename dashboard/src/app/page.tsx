"use client";

import { useAuth, useSignIn, useSignUp } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Key, BarChart3, Zap, Shield,
  CheckCircle2, Users, Database,
  ArrowRight, ExternalLink, Loader2,
} from "lucide-react";
import { LayoutGroup, motion } from "framer-motion";

// ─── Brand SVG icons ──────────────────────────────────────────────────────────

function IconGitHub({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function IconGoogle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// ─── Mode config ──────────────────────────────────────────────────────────────

const MODES = {
  signin: {
    cardTitle: "Sign in to TradePose",
    cardSubtitle: "No password needed — use your social account.",
    mobileHeading: "Welcome back",
    heading: (<>Welcome back<br /><span className="text-success">to TradePose</span></>),
    sub: "Sign in to access your strategies, analytics, and API keys.",
    bullets: [
      { icon: Key,       text: "Fine-grained API key management & permissions" },
      { icon: BarChart3, text: "Real-time strategy performance dashboards" },
      { icon: Zap,       text: "Rust-powered signal engine, millions of bars/s" },
      { icon: Shield,    text: "Enterprise-grade security, SOC 2-ready" },
    ],
    trust: [
      "Trusted by 10,000+ quant traders worldwide",
      "99.9% uptime SLA across all regions",
    ],
    toggleText: "Don't have an account?",
    toggleCta: "Create account",
    toggleTarget: "signup" as const,
  },
  signup: {
    cardTitle: "Create your account",
    cardSubtitle: "Free during beta — no credit card required.",
    mobileHeading: "Get started free",
    heading: (<>Start trading<br /><span className="text-success">smarter today</span></>),
    sub: "Professional-grade quantitative trading tools — free during beta.",
    bullets: [
      { icon: CheckCircle2, text: "Free during beta — no credit card required" },
      { icon: Users,        text: "Join 10,000+ traders building real edge" },
      { icon: Database,     text: "10+ years of clean, normalized market data" },
      { icon: Shield,       text: "SOC 2-ready infrastructure, end-to-end encrypted" },
    ],
    trust: [
      "Used by hedge funds & independent retail traders",
      "Cancel anytime — your data is always exportable",
    ],
    toggleText: "Already have an account?",
    toggleCta: "Sign in",
    toggleTarget: "signin" as const,
  },
};

type OAuthStrategy = "oauth_github" | "oauth_google";

// ─── FLIP transition — Quintic Out for silky deceleration ────────────────────

const flipTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [oauthLoading, setOauthLoading] = useState<OAuthStrategy | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) router.push("/dashboard");
  }, [isLoaded, isSignedIn, router]);

  async function handleOAuth(strategy: OAuthStrategy) {
    setOauthLoading(strategy);
    try {
      if (mode === "signin" && signInLoaded && signIn) {
        await signIn.authenticateWithRedirect({
          strategy,
          redirectUrl: "/sign-in",
          redirectUrlComplete: "/dashboard",
        });
      } else if (signUpLoaded && signUp) {
        await signUp.authenticateWithRedirect({
          strategy,
          redirectUrl: "/sign-up",
          redirectUrlComplete: "/dashboard",
        });
      }
    } catch {
      setOauthLoading(null);
    }
  }

  function switchTo(next: "signin" | "signup") {
    setMode(next);
    setOauthLoading(null);
  }

  const c = MODES[mode];
  const isReady = mode === "signin" ? signInLoaded : signUpLoaded;

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background">

      {/* ── Header ── */}
      <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b border-border px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-success">
            <span className="text-xs font-bold text-success-foreground">TP</span>
          </div>
          <span className="font-semibold tracking-tight">TradePose</span>
        </div>
        <Link
          href="https://tradepose.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          tradepose.com
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </header>

      {/* ── Main ── */}
      <main className="relative min-h-0 flex-1 overflow-hidden overflow-y-auto">

        {/* Ambient glow behind the glass card */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-success/4 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 translate-x-1/2 translate-y-1/2 rounded-full bg-success/3 blur-3xl" />
        </div>

        {/*
         * ── Layout-level shuffle (FLIP via Framer Motion `layout`) ──────────
         *
         * The outer wrapper is STABLE — it never remounts or slides.
         * Only the two children swap visual positions via CSS `order`.
         *
         * How it works:
         *   1. Both panels are always mounted (no AnimatePresence key flip).
         *   2. `layout` + `layoutId` tell Framer Motion to track each panel's
         *      real DOM position on every render.
         *   3. When `mode` changes, `order` flips → Framer Motion records the
         *      old position, lets React commit the new DOM, then animates each
         *      panel from old → new position (FLIP / Shared-Element style).
         *   4. The outer container stays still. Only the children move.
         *
         * Desktop sign-in : [marketing(order:1) | card(order:2)]  ← left / right
         * Desktop sign-up : [card(order:1) | marketing(order:2)]  ← left / right
         *
         * Mobile: marketing is `hidden md:flex`, so only the card is visible
         *         on small screens — no positional swap needed.
         */}
        <div className="flex min-h-full items-center justify-center px-6 py-16 sm:py-20 sm:px-10">
          <LayoutGroup>
            <div className="flex w-full max-w-[960px] flex-col items-center gap-10 md:flex-row md:items-center md:gap-16 lg:gap-20">

              {/* ── Marketing panel ── */}
              <motion.section
                layout
                layoutId="panel-marketing"
                transition={flipTransition}
                // sign-in → order 1 (left)  |  sign-up → order 2 (right)
                style={{ order: mode === "signin" ? 1 : 2 }}
                className="hidden flex-1 flex-col md:flex"
              >
                <motion.div
                  // Fade content on mode change so text switch feels intentional
                  key={mode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="max-w-xl"
                >
                  <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
                    {c.heading}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {c.sub}
                  </p>
                  <ul className="mt-10 space-y-3">
                    {c.bullets.map((b) => (
                      <li key={b.text} className="flex items-center gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-success/10">
                          <b.icon className="h-4 w-4 text-success" />
                        </div>
                        <span className="text-sm leading-snug text-muted-foreground">
                          {b.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 space-y-3 border-t border-border pt-8">
                    {c.trust.map((t) => (
                      <div key={t} className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success/80" />
                        <span className="text-sm font-medium text-slate-300">{t}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.section>

              {/* ── Auth card ── */}
              <motion.div
                layout
                layoutId="panel-card"
                transition={flipTransition}
                // sign-in → order 2 (right)  |  sign-up → order 1 (left)
                style={{ order: mode === "signin" ? 2 : 1 }}
                className="w-full shrink-0 sm:w-[400px]"
              >
                {/* Mobile-only brand anchor */}
                <motion.div
                  key={mode + "-mobile-brand"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="mb-6 text-center md:hidden"
                >
                  <h1 className="text-2xl font-bold tracking-tight">{c.mobileHeading}</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">{c.cardSubtitle}</p>
                </motion.div>

                {/* Card shell */}
                <div className="rounded-2xl border border-white/[0.07] bg-card/90 p-8 shadow-[0_24px_48px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl">

                  {/* Card heading — fades on mode switch */}
                  <motion.div
                    key={mode + "-card-heading"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="mb-7 text-center"
                  >
                    <h2 className="text-lg font-semibold">{c.cardTitle}</h2>
                    <p className="mt-1 hidden text-sm text-muted-foreground md:block">
                      {c.cardSubtitle}
                    </p>
                  </motion.div>

                  {/* OAuth buttons */}
                  <div className="flex flex-col gap-3">
                    <motion.button
                      whileHover={{ y: -1, boxShadow: "0 6px 20px rgba(0,0,0,0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOAuth("oauth_github")}
                      disabled={!isReady || oauthLoading !== null}
                      aria-label="Continue with GitHub"
                      className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#24292e] font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {oauthLoading === "oauth_github"
                        ? <Loader2 className="h-5 w-5 animate-spin" />
                        : <IconGitHub className="h-5 w-5" />
                      }
                      Continue with GitHub
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -1, boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOAuth("oauth_google")}
                      disabled={!isReady || oauthLoading !== null}
                      aria-label="Continue with Google"
                      className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-border bg-transparent font-medium text-foreground transition-all hover:border-foreground/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {oauthLoading === "oauth_google"
                        ? <Loader2 className="h-5 w-5 animate-spin" />
                        : <IconGoogle className="h-5 w-5" />
                      }
                      Continue with Google
                    </motion.button>
                  </div>

                  {/* Toggle */}
                  <div className="mt-7 flex items-center justify-center gap-3">
                    <span className="text-sm text-muted-foreground">{c.toggleText}</span>
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => switchTo(c.toggleTarget)}
                      className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-success/40 px-4 py-2 text-sm font-medium text-success transition-colors hover:border-success hover:bg-success/10"
                    >
                      {c.toggleCta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

            </div>
          </LayoutGroup>
        </div>
      </main>
    </div>
  );
}
