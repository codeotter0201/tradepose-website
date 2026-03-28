"use client";

import { useAuth } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gatewayClient } from "@/lib/api";


// ========== Query Keys ==========
export const QUERY_KEYS = {
  API_KEYS: ["api-keys"] as const,
  USAGE: (period: string) => ["usage", period] as const,
  SUBSCRIPTION: ["subscription"] as const,
  PROFILE: ["profile"] as const,
  ACCOUNTS: ["accounts"] as const,
  SLOTS: ["slots"] as const,
  PORTFOLIOS: ["portfolios"] as const,
  BINDINGS: ["bindings"] as const,
  TASKS: ["tasks"] as const,
  ENGAGEMENTS: ["engagements"] as const,
  INSTRUMENTS: ["instruments"] as const,
  STRATEGIES: ["strategies"] as const,
};

// ========== Cache Configuration ==========
const CACHE_CONFIG = {
  // 静态数据缓存较长时间
  static: {
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 10 * 60 * 1000, // 10分钟
  },
  // 半动态数据
  semiDynamic: {
    staleTime: 60 * 1000, // 1分钟
    gcTime: 5 * 60 * 1000, // 5分钟
  },
  // 实时数据
  realtime: {
    staleTime: 0,
    gcTime: 60 * 1000, // 1分钟
  },
};

// ========== Token Cache ==========
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getCachedToken(getToken: () => Promise<string | null>) {
  const now = Date.now();
  // Token 缓存 30 秒
  if (cachedToken && tokenExpiry > now) {
    return cachedToken;
  }

  const token = await getToken();
  if (token) {
    cachedToken = token;
    tokenExpiry = now + 30 * 1000; // 30秒缓存
  }
  return token;
}

// ========== Dashboard Stats ==========

export function useDashboardStats() {
  const { getToken } = useAuth();

  const { data: keys, isLoading: keysLoading } = useQuery({
    queryKey: QUERY_KEYS.API_KEYS,
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.listApiKeys(token);
    },
    ...CACHE_CONFIG.static,
  });

  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: QUERY_KEYS.SUBSCRIPTION,
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.getSubscription(token);
    },
    ...CACHE_CONFIG.semiDynamic,
  });

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: QUERY_KEYS.USAGE("30d"),
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return gatewayClient.getUsage(token, {
        from_date: thirtyDaysAgo.toISOString().split("T")[0],
      });
    },
    ...CACHE_CONFIG.semiDynamic,
  });

  const activeKeys = Array.isArray(keys) ? keys.filter((k) => !k.revoked).length : 0;
  const totalRequests = Array.isArray(usage)
    ? usage.reduce((sum, day) => sum + day.requests, 0)
    : 0;
  const quotaLimit = subscription?.plan === "pro" ? 100000 : 10000;
  const quotaPercent = quotaLimit > 0 ? Math.round((totalRequests / quotaLimit) * 100) : 0;

  return {
    totalRequests,
    activeKeys,
    totalKeys: Array.isArray(keys) ? keys.length : 0,
    quotaUsed: totalRequests,
    quotaLimit,
    quotaPercent,
    plan: subscription?.plan ?? "free",
    planStatus: subscription?.status ?? "active",
    usage: Array.isArray(usage) ? usage : [],
    keys: Array.isArray(keys) ? keys : [],
    isLoading: keysLoading || usageLoading || subscriptionLoading,
  };
}

// ========== API Keys Hooks ==========

export function useApiKeys() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.API_KEYS,
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.listApiKeys(token);
    },
    ...CACHE_CONFIG.static,
  });
}

export function useCreateApiKey() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.createApiKey(token, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.API_KEYS });
    },
  });
}

export function useRevokeApiKey() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (keyId: string) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.revokeApiKey(token, keyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.API_KEYS });
    },
  });
}

// ========== Usage Hooks ==========

export function useUsage(period: "7d" | "30d" | "90d" = "30d") {
  const { getToken } = useAuth();

  const getDaysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split("T")[0];
  };

  const periodDays = { "7d": 7, "30d": 30, "90d": 90 };

  return useQuery({
    queryKey: QUERY_KEYS.USAGE(period),
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.getUsage(token, {
        from_date: getDaysAgo(periodDays[period]),
      });
    },
    ...CACHE_CONFIG.semiDynamic,
  });
}

export function useUsageStats(period: "7d" | "30d" | "90d" = "30d") {
  const { getToken } = useAuth();
  const periodDays = { "7d": 7, "30d": 30, "90d": 90 };
  const days = periodDays[period];

  const getDaysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split("T")[0];
  };

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: QUERY_KEYS.USAGE(period),
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      const date = new Date();
      date.setDate(date.getDate() - days);
      return gatewayClient.getUsage(token, {
        from_date: date.toISOString().split("T")[0],
      });
    },
    ...CACHE_CONFIG.semiDynamic,
  });

  const { data: prevUsage, isLoading: prevLoading } = useQuery({
    queryKey: ["usage-prev", period],
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.getUsage(token, {
        from_date: getDaysAgo(days * 2),
        to_date: getDaysAgo(days),
      });
    },
    ...CACHE_CONFIG.semiDynamic,
    enabled: !!usage, // 只在 usage 加载后才加载 prevUsage
  });

  const usageArray = Array.isArray(usage) ? usage : [];
  const prevUsageArray = Array.isArray(prevUsage) ? prevUsage : [];

  const totalRequests = usageArray.reduce((sum, day) => sum + day.requests, 0);
  const prevTotalRequests = prevUsageArray.reduce((sum, day) => sum + day.requests, 0);

  const avgDaily = usageArray.length
    ? Math.round(totalRequests / usageArray.length)
    : 0;
  const maxDaily = usageArray.length
    ? Math.max(...usageArray.map((d) => d.requests))
    : 0;

  const trend =
    prevTotalRequests > 0
      ? Math.round(((totalRequests - prevTotalRequests) / prevTotalRequests) * 100)
      : 0;

  return {
    usage: usageArray,
    totalRequests,
    avgDaily,
    maxDaily,
    trend,
    isLoading: usageLoading || prevLoading,
  };
}

// ========== Subscription Hooks ==========

export function useSubscription() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.SUBSCRIPTION,
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.getSubscription(token);
    },
    ...CACHE_CONFIG.semiDynamic,
  });
}

export function useCreateCheckout() {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (plan: string) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.createCheckoutSession(token, plan);
    },
  });
}

// ========== Accounts Hooks ==========

export function useAccounts(archived?: boolean) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.ACCOUNTS, archived],
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.listAccounts(token, archived);
    },
    ...CACHE_CONFIG.semiDynamic,
  });
}

export function useAccount(accountId: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.ACCOUNTS, accountId],
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.getAccount(token, accountId);
    },
    enabled: !!accountId,
    ...CACHE_CONFIG.semiDynamic,
  });
}

export function useCreateAccount() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Parameters<typeof gatewayClient.createAccount>[1]) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.createAccount(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS });
    },
  });
}

export function useUpdateAccount() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId, data }: { accountId: string; data: Parameters<typeof gatewayClient.updateAccount>[2] }) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.updateAccount(token, accountId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.ACCOUNTS, variables.accountId] });
    },
  });
}

export function useDeleteAccount() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountId: string) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.deleteAccount(token, accountId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS });
    },
  });
}

// ========== Slots Hooks ==========

export function useSlots() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.SLOTS,
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.listSlots(token);
    },
    ...CACHE_CONFIG.semiDynamic,
  });
}

export function useBindSlot() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nodeSeq, slotIdx, accountId }: { nodeSeq: number; slotIdx: number; accountId: string }) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.bindSlot(token, nodeSeq, slotIdx, accountId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SLOTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS });
    },
  });
}

export function useUnbindSlot() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nodeSeq, slotIdx }: { nodeSeq: number; slotIdx: number }) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.unbindSlot(token, nodeSeq, slotIdx);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SLOTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS });
    },
  });
}

// ========== Portfolios Hooks ==========

export function usePortfolios(archived?: boolean) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.PORTFOLIOS, archived],
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.listPortfolios(token, archived);
    },
    ...CACHE_CONFIG.static,
  });
}

export function usePortfolio(name: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.PORTFOLIOS, name],
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.getPortfolio(token, name);
    },
    enabled: !!name,
    ...CACHE_CONFIG.semiDynamic,
  });
}

export function useCreatePortfolio() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Parameters<typeof gatewayClient.createPortfolio>[1]) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.createPortfolio(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PORTFOLIOS });
    },
  });
}

export function useUpdatePortfolio() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, data }: { name: string; data: Parameters<typeof gatewayClient.updatePortfolio>[2] }) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.updatePortfolio(token, name, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PORTFOLIOS });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.PORTFOLIOS, variables.name] });
    },
  });
}

export function useDeletePortfolio() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.deletePortfolio(token, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PORTFOLIOS });
    },
  });
}

// ========== Bindings Hooks ==========

export function useBindings() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.BINDINGS,
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.listBindings(token);
    },
    ...CACHE_CONFIG.semiDynamic,
  });
}

export function useCreateBinding() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Parameters<typeof gatewayClient.createBinding>[1]) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.createBinding(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BINDINGS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PORTFOLIOS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS });
    },
  });
}

export function useDeleteBinding() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bindingId: string) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.deleteBinding(token, bindingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BINDINGS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PORTFOLIOS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS });
    },
  });
}

// ========== Tasks Hooks ==========

export function useTasks(status?: Parameters<typeof gatewayClient.listTasks>[1]) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.TASKS, status],
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.listTasks(token, status);
    },
    ...CACHE_CONFIG.realtime,
  });
}

export function useTask(taskId: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.TASKS, taskId],
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.getTask(token, taskId);
    },
    enabled: !!taskId,
    ...CACHE_CONFIG.realtime,
  });
}

export function useCreateTask() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Parameters<typeof gatewayClient.createTask>[1]) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.createTask(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });
}

// ========== Engagements Hooks ==========

export function useEngagements(params?: { phase?: string; account_id?: string; active_only?: boolean }) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.ENGAGEMENTS, params],
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.listEngagements(token, params);
    },
    ...CACHE_CONFIG.realtime,
  });
}

export function useEngagement(engagementId: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.ENGAGEMENTS, engagementId],
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.getEngagement(token, engagementId);
    },
    enabled: !!engagementId,
    ...CACHE_CONFIG.realtime,
  });
}

export function useCreateEngagement() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Parameters<typeof gatewayClient.createEngagement>[1]) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.createEngagement(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENGAGEMENTS });
    },
  });
}

export function useActivateEngagement() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (engagementId: string) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.activateEngagement(token, engagementId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENGAGEMENTS });
    },
  });
}

export function useCloseEngagement() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (engagementId: string) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.closeEngagement(token, engagementId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENGAGEMENTS });
    },
  });
}

// ========== Instruments Hooks ==========

export function useInstruments(params?: { 
  symbol?: string; 
  account_source?: string; 
  broker_type?: string;
  market_type?: string;
  limit?: number;
  offset?: number;
}) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.INSTRUMENTS, params],
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.listInstruments(token, params);
    },
    ...CACHE_CONFIG.static,
  });
}

export function useInstrument(instrumentId: number) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.INSTRUMENTS, instrumentId],
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.getInstrument(token, instrumentId);
    },
    enabled: !!instrumentId,
    ...CACHE_CONFIG.static,
  });
}

// ========== Strategies Hooks ==========

export function useStrategies() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.STRATEGIES,
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.listStrategies(token);
    },
    ...CACHE_CONFIG.static,
  });
}

export function useStrategy(strategyName: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [...QUERY_KEYS.STRATEGIES, strategyName],
    queryFn: async () => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.getStrategy(token, strategyName);
    },
    enabled: !!strategyName,
    ...CACHE_CONFIG.static,
  });
}

export function useCreateStrategy() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Parameters<typeof gatewayClient.createStrategy>[1]) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.createStrategy(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STRATEGIES });
    },
  });
}

export function useDeleteStrategy() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (strategyName: string) => {
      const token = await getCachedToken(getToken);
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.deleteStrategy(token, strategyName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STRATEGIES });
    },
  });
}
