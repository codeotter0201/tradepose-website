"use client";

import { useAuth } from "@clerk/clerk-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Breadcrumb } from "@/components/dashboard/breadcrumb";
import { PageSkeleton } from "@/components/dashboard/loading-skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isHandshaking = searchParams.has("__clerk_handshake");

  useEffect(() => {
    if (isLoaded && !isSignedIn && !isHandshaking) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, isHandshaking]);

  if (!isLoaded || !isSignedIn) return <PageSkeleton />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <div className="flex items-center gap-2 border-b border-border/50 bg-card/50 px-4 py-2 lg:px-6">
          <Breadcrumb />
        </div>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Suspense fallback={<PageSkeleton />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
