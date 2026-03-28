const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.tradepose.com";

export interface ApiKey {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  last_used: string | null;
  revoked: boolean;
}

export interface CreateApiKeyResponse {
  id: string;
  name: string;
  user_id: string;
  api_key: string;  // Gateway returns 'api_key', not 'key'
  created_at: string;
}

export interface UsageStats {
  date: string;
  requests: number;
}

export interface Subscription {
  id: string;
  plan: string;
  status: string;
  current_period_end: string;
}

export interface UserProfile {
  id: string;
  clerk_id: string;
  email: string;
  plan: string;
  created_at: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  broker_type: string;
  account_source: string;
  account_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  mt5_connection?: {
    status: "connected" | "disconnected" | "error";
    last_connected?: string;
    server?: string;
  };
  balance?: number;
  equity?: number;
  margin?: number;
}

export interface CreateAccountRequest {
  name: string;
  broker_type: string;
  account_source: string;
  account_number?: string;
  credentials?: Record<string, string>;
}

export interface Slot {
  node_seq: number;
  slot_idx: number;
  status: "idle" | "bound" | "error";
  account_id?: string;
  account_name?: string;
  broker_type?: string;
}

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  archived: boolean;
  binding_count?: number;
  account_count?: number;
  strategy_count?: number;
}

export interface CreatePortfolioRequest {
  name: string;
  description?: string;
}

export interface Binding {
  id: string;
  portfolio_id: string;
  account_id: string;
  portfolio_name?: string;
  account_name?: string;
  broker_type?: string;
  created_at: string;
}

export interface CreateBindingRequest {
  portfolio_id: string;
  account_id: string;
}

export type TaskStatus = "pending" | "running" | "completed" | "failed";
export type TaskType = "backtest" | "export" | "optimization";

export interface Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  name: string;
  description?: string;
  progress?: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateTaskRequest {
  type: TaskType;
  name: string;
  description?: string;
  config: Record<string, unknown>;
}

export type EngagementPhase = "pending" | "entering" | "holding" | "exiting" | "closed";

export interface Instrument {
  id: number;
  symbol: string;
  account_source: string;
  broker_type: string;
  market_type: string;
  base_currency: string;
  quote_currency: string;
  tick_size: string;
  lot_size: string;
  price_precision: number;
  quantity_precision: number;
  contract_size: string;
  point_value: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BlueprintTrigger {
  condition: string;
}

export interface Blueprint {
  id: string;
  name: string;
  direction: string;
  trend_type?: string;
  entry_triggers: BlueprintTrigger[];
  exit_triggers: BlueprintTrigger[];
  note?: string;
}

export interface StrategyIndicator {
  name: string;
  expr: string;
  output_type?: string;
}

export interface Strategy {
  id: string;
  name: string;
  note?: string;
  base_instrument: string;
  base_freq: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  base_blueprint: Blueprint;
  advanced_blueprints: Blueprint[];
  indicators: StrategyIndicator[];
  volatility_indicator?: Record<string, unknown>;
}

export interface StrategyListResponse {
  strategies: Strategy[];
}

export interface InstrumentListResponse {
  instruments: Instrument[];
  count: number;
  total: number;
  limit: number;
  offset: number;
}

export interface Engagement {
  id: string;
  account_id: string;
  portfolio_id?: string;
  instrument_id: string;
  instrument_symbol: string;
  direction: "long" | "short";
  phase: EngagementPhase;
  quantity: number;
  entry_price?: number;
  current_price?: number;
  unrealized_pnl?: number;
  realized_pnl?: number;
  stop_loss?: number;
  take_profit?: number;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

class GatewayClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { token?: string } = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (fetchOptions.headers) {
      const existingHeaders = fetchOptions.headers as Record<string, string>;
      Object.assign(headers, existingHeaders);
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `API Error: ${response.status}`);
    }

    return response.json();
  }

  async listApiKeys(token: string): Promise<ApiKey[]> {
    const response = await this.request<{ keys: ApiKey[]; total: number }>("/api/v1/keys", { token });
    return response.keys ?? [];
  }

  async createApiKey(
    token: string,
    name: string
  ): Promise<CreateApiKeyResponse> {
    return this.request<CreateApiKeyResponse>("/api/v1/keys", {
      method: "POST",
      token,
      body: JSON.stringify({ name }),
    });
  }

  async revokeApiKey(token: string, keyId: string): Promise<void> {
    await this.request(`/api/v1/keys/${keyId}`, {
      method: "DELETE",
      token,
    });
  }

  async getUsage(
    token: string,
    params?: { from_date?: string; to_date?: string }
  ): Promise<UsageStats[]> {
    const searchParams = new URLSearchParams();
    if (params?.from_date) searchParams.set("from_date", params.from_date);
    if (params?.to_date) searchParams.set("to_date", params.to_date);

    const query = searchParams.toString();
    const endpoint = `/api/v1/billing/usage${query ? `?${query}` : ""}`;

    return this.request<UsageStats[]>(endpoint, { token });
  }

  async getSubscription(token: string): Promise<Subscription> {
    return this.request<Subscription>("/api/v1/billing/subscription", { token });
  }

  async createCheckoutSession(
    token: string,
    plan: string
  ): Promise<{ checkout_url: string }> {
    return this.request<{ checkout_url: string }>("/api/v1/billing/checkout", {
      method: "POST",
      token,
      body: JSON.stringify({ plan }),
    });
  }

  async getProfile(token: string): Promise<UserProfile> {
    return this.request<UserProfile>("/api/v1/users/me", { token });
  }

  // Accounts
  async listAccounts(token: string, archived?: boolean): Promise<TradingAccount[]> {
    const params = new URLSearchParams();
    if (archived !== undefined) params.set("archived", String(archived));
    const query = params.toString();
    const endpoint = `/api/v1/accounts${query ? `?${query}` : ""}`;
    return this.request<TradingAccount[]>(endpoint, { token });
  }

  async createAccount(token: string, data: CreateAccountRequest): Promise<TradingAccount> {
    return this.request<TradingAccount>("/api/v1/accounts", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async getAccount(token: string, accountId: string): Promise<TradingAccount> {
    return this.request<TradingAccount>(`/api/v1/accounts/${accountId}`, { token });
  }

  async updateAccount(token: string, accountId: string, data: Partial<CreateAccountRequest>): Promise<TradingAccount> {
    return this.request<TradingAccount>(`/api/v1/accounts/${accountId}`, {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(token: string, accountId: string): Promise<void> {
    await this.request(`/api/v1/accounts/${accountId}`, {
      method: "DELETE",
      token,
    });
  }

  async getMt5Connection(token: string, accountId: string): Promise<TradingAccount["mt5_connection"]> {
    return this.request<TradingAccount["mt5_connection"]>(`/api/v1/accounts/${accountId}/mt5-connection`, { token });
  }

  // Slots
  async listSlots(token: string): Promise<Slot[]> {
    return this.request<Slot[]>("/api/v1/slots", { token });
  }

  async bindSlot(token: string, nodeSeq: number, slotIdx: number, accountId: string): Promise<void> {
    await this.request(`/api/v1/slots/${nodeSeq}/${slotIdx}/bind`, {
      method: "POST",
      token,
      body: JSON.stringify({ account_id: accountId }),
    });
  }

  async unbindSlot(token: string, nodeSeq: number, slotIdx: number): Promise<void> {
    await this.request(`/api/v1/slots/${nodeSeq}/${slotIdx}/unbind`, {
      method: "POST",
      token,
    });
  }

  // Portfolios
  async listPortfolios(token: string, archived?: boolean): Promise<Portfolio[]> {
    const params = new URLSearchParams();
    if (archived !== undefined) params.set("archived", String(archived));
    const query = params.toString();
    const endpoint = `/api/v1/portfolios${query ? `?${query}` : ""}`;
    return this.request<Portfolio[]>(endpoint, { token });
  }

  async createPortfolio(token: string, data: CreatePortfolioRequest): Promise<Portfolio> {
    return this.request<Portfolio>("/api/v1/portfolios", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async getPortfolio(token: string, name: string): Promise<Portfolio> {
    return this.request<Portfolio>(`/api/v1/portfolios/${name}`, { token });
  }

  async updatePortfolio(token: string, name: string, data: Partial<CreatePortfolioRequest>): Promise<Portfolio> {
    return this.request<Portfolio>(`/api/v1/portfolios/${name}`, {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    });
  }

  async deletePortfolio(token: string, name: string): Promise<void> {
    await this.request(`/api/v1/portfolios/${name}`, {
      method: "DELETE",
      token,
    });
  }

  // Bindings
  async listBindings(token: string): Promise<Binding[]> {
    return this.request<Binding[]>("/api/v1/bindings", { token });
  }

  async createBinding(token: string, data: CreateBindingRequest): Promise<Binding> {
    return this.request<Binding>("/api/v1/bindings", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async deleteBinding(token: string, bindingId: string): Promise<void> {
    await this.request(`/api/v1/bindings/${bindingId}`, {
      method: "DELETE",
      token,
    });
  }

  // Tasks
  async listTasks(token: string, status?: TaskStatus): Promise<Task[]> {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    const query = params.toString();
    const endpoint = `/api/v1/export${query ? `?${query}` : ""}`;
    return this.request<Task[]>(endpoint, { token });
  }

  async createTask(token: string, data: CreateTaskRequest): Promise<Task> {
    return this.request<Task>("/api/v1/export", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async getTask(token: string, taskId: string): Promise<Task> {
    return this.request<Task>(`/api/v1/tasks/${taskId}`, { token });
  }

  async downloadTaskResult(token: string, taskId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/v1/tasks/${taskId}/result`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status}`);
    }
    return response.blob();
  }

  // Engagements
  async listEngagements(token: string, params?: { phase?: string; account_id?: string; active_only?: boolean }): Promise<Engagement[]> {
    const searchParams = new URLSearchParams();
    if (params?.phase) searchParams.set("phase", params.phase);
    if (params?.account_id) searchParams.set("account_id", params.account_id);
    if (params?.active_only) searchParams.set("active_only", "true");
    const query = searchParams.toString();
    const endpoint = `/api/v1/engagements${query ? `?${query}` : ""}`;
    return this.request<Engagement[]>(endpoint, { token });
  }

  async getEngagement(token: string, engagementId: string): Promise<Engagement> {
    return this.request<Engagement>(`/api/v1/engagements/${engagementId}`, { token });
  }

  async createEngagement(token: string, data: { account_id: string; instrument_id: string; direction: "long" | "short"; quantity: number }): Promise<Engagement> {
    return this.request<Engagement>("/api/v1/engagements", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async activateEngagement(token: string, engagementId: string): Promise<void> {
    await this.request(`/api/v1/engagements/${engagementId}/activate`, {
      method: "POST",
      token,
    });
  }

  async closeEngagement(token: string, engagementId: string): Promise<void> {
    await this.request(`/api/v1/engagements/${engagementId}/close`, {
      method: "POST",
      token,
    });
  }

  // Instruments
  async listInstruments(token: string, params?: { 
    symbol?: string; 
    account_source?: string; 
    broker_type?: string;
    market_type?: string;
    limit?: number;
    offset?: number;
  }): Promise<InstrumentListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.symbol) searchParams.set("symbol", params.symbol);
    if (params?.account_source) searchParams.set("account_source", params.account_source);
    if (params?.broker_type) searchParams.set("broker_type", params.broker_type);
    if (params?.market_type) searchParams.set("market_type", params.market_type);
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.offset) searchParams.set("offset", String(params.offset));
    const query = searchParams.toString();
    const endpoint = `/api/v1/instruments${query ? `?${query}` : ""}`;
    return this.request<InstrumentListResponse>(endpoint, { token });
  }

  async getInstrument(token: string, instrumentId: number): Promise<Instrument> {
    return this.request<Instrument>(`/api/v1/instruments/${instrumentId}`, { token });
  }

  // Strategies
  async listStrategies(token: string): Promise<StrategyListResponse> {
    return this.request<StrategyListResponse>("/api/v1/strategies", { token });
  }

  async getStrategy(token: string, name: string): Promise<Strategy> {
    return this.request<Strategy>(`/api/v1/strategies/${name}`, { token });
  }

  async createStrategy(token: string, data: {
    name: string;
    note?: string;
    base_instrument: string;
    base_freq: string;
  }): Promise<Strategy> {
    return this.request<Strategy>("/api/v1/strategies", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  async deleteStrategy(token: string, name: string): Promise<void> {
    await this.request(`/api/v1/strategies/${name}`, {
      method: "DELETE",
      token,
    });
  }
}

export const gatewayClient = new GatewayClient();
