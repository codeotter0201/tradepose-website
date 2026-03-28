"use client";

import { Key } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiKey } from "@/lib/api";
import { formatDistanceToNow } from "@/lib/date";

interface RecentKeysProps {
  keys: ApiKey[];
  loading?: boolean;
}

export function RecentKeys({ keys, loading }: RecentKeysProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const activeKeys = keys.filter((k) => !k.revoked).slice(0, 5);

  if (activeKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Key className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No API keys yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeKeys.map((key) => (
        <div key={key.id} className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Key className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium">{key.name || "Unnamed Key"}</p>
            <p className="text-sm text-muted-foreground">
              {key.last_used
                ? `Last used ${formatDistanceToNow(key.last_used)}`
                : "Never used"}
            </p>
          </div>
          <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
            sk_••{key.id.slice(-4)}
          </code>
        </div>
      ))}
    </div>
  );
}
