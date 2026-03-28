"use client";

import { useState } from "react";
import { useAccounts, useCreateAccount, useDeleteAccount, useSlots, useBindSlot, useUnbindSlot } from "@/lib/hooks";
import { gatewayClient, type TradingAccount, type Slot } from "@/lib/api";
import { formatDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  MoreVertical,
  Trash2,
  Link2,
  Unlink,
  Server,
  Wallet,
  TrendingUp,
  Activity,
  RefreshCw,
  Target,
  TrendingUp as TrendingUpIcon,
  TrendingDown,
  DollarSign,
  Clock,
  Crosshair,
  X,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { StatCard, StatsGrid } from "@/components/dashboard/stat-card";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import { useEngagements, useCloseEngagement } from "@/lib/hooks";
import { type Engagement } from "@/lib/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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

const phaseColors: Record<string, string> = {
  pending: "bg-yellow-500",
  entering: "bg-blue-500",
  holding: "bg-green-500",
  exiting: "bg-orange-500",
  closed: "bg-gray-500",
};

const brokerOptions = [
  { value: "mt5", label: "MetaTrader 5", icon: "📊" },
  { value: "interactive_brokers", label: "Interactive Brokers", icon: "🏢" },
  { value: "binance", label: "Binance", icon: "🪙" },
  { value: "okx", label: "OKX", icon: "📈" },
];

const sourceOptions = [
  { value: "demo", label: "Demo", description: "Practice account" },
  { value: "live", label: "Live", description: "Real money account" },
];

// ============= ACCOUNTS COMPONENTS =============

function AccountStats({ accounts, loading }: { accounts: TradingAccount[]; loading: boolean }) {
  const activeAccounts = accounts.filter((a) => a.is_active).length;
  const connectedAccounts = accounts.filter(
    (a) => a.mt5_connection?.status === "connected"
  ).length;
  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  return (
    <StatsGrid>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Total Accounts"
          value={accounts.length}
          description="All trading accounts"
          icon={Wallet}
          loading={loading}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Active Accounts"
          value={activeAccounts}
          description="Ready for trading"
          icon={Activity}
          loading={loading}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Connected"
          value={connectedAccounts}
          description="MT5 online"
          icon={Server}
          loading={loading}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Total Balance"
          value={`$${totalBalance.toLocaleString()}`}
          description="Combined equity"
          icon={TrendingUp}
          loading={loading}
        />
      </motion.div>
    </StatsGrid>
  );
}

function CreateAccountDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [brokerType, setBrokerType] = useState("");
  const [accountSource, setAccountSource] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const createMutation = useCreateAccount();

  const handleCreate = () => {
    if (!name.trim() || !brokerType || !accountSource) {
      toast.error("Please fill in all required fields");
      return;
    }

    createMutation.mutate(
      {
        name: name.trim(),
        broker_type: brokerType,
        account_source: accountSource,
        account_number: accountNumber || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully");
          setOpen(false);
          setName("");
          setBrokerType("");
          setAccountSource("");
          setAccountNumber("");
        },
        onError: (error) => {
          toast.error("Failed to create account", {
            description: error instanceof Error ? error.message : "Unknown error",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Trading Account</DialogTitle>
          <DialogDescription>
            Add a new trading account to your portfolio.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name *</Label>
            <Input
              id="name"
              placeholder="e.g., My MT5 Live Account"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Broker Type *</Label>
            <Select value={brokerType} onValueChange={setBrokerType}>
              <SelectTrigger>
                <SelectValue placeholder="Select broker" />
              </SelectTrigger>
              <SelectContent>
                {brokerOptions.map((broker) => (
                  <SelectItem key={broker.value} value={broker.value}>
                    <span className="mr-2">{broker.icon}</span>
                    {broker.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Account Type *</Label>
            <Select value={accountSource} onValueChange={setAccountSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {sourceOptions.map((source) => (
                  <SelectItem key={source.value} value={source.value}>
                    <div>
                      <div>{source.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {source.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number (Optional)</Label>
            <Input
              id="accountNumber"
              placeholder="Your broker account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BindSlotDialog({
  account,
  open,
  onOpenChange,
}: {
  account: TradingAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: slots } = useSlots();
  const bindMutation = useBindSlot();
  const unbindMutation = useUnbindSlot();
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const availableSlots = slots?.filter((s) => s.status === "idle") || [];
  const currentSlot = slots?.find((s) => s.account_id === account.id);

  const handleBind = (slot: Slot) => {
    bindMutation.mutate(
      { nodeSeq: slot.node_seq, slotIdx: slot.slot_idx, accountId: account.id },
      {
        onSuccess: () => {
          toast.success(`Account bound to slot ${slot.node_seq}-${slot.slot_idx}`);
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Failed to bind slot", {
            description: error instanceof Error ? error.message : "Unknown error",
          });
        },
      }
    );
  };

  const handleUnbind = () => {
    if (!currentSlot) return;
    unbindMutation.mutate(
      { nodeSeq: currentSlot.node_seq, slotIdx: currentSlot.slot_idx },
      {
        onSuccess: () => {
          toast.success("Account unbound from slot");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Failed to unbind slot", {
            description: error instanceof Error ? error.message : "Unknown error",
          });
        },
      }
    );
  };

  const handleRefresh = async () => {
    const token = await getToken();
    if (!token) return;
    
    try {
      await gatewayClient.getAccount(token, account.id);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account status refreshed");
    } catch {
      toast.error("Failed to refresh account");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Slot Binding</DialogTitle>
          <DialogDescription>
            Bind your account to a trading slot for automated execution.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {currentSlot ? (
            <div className="rounded-lg border border-success/20 bg-success/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Currently Bound</p>
                  <p className="text-sm text-muted-foreground">
                    Slot {currentSlot.node_seq}-{currentSlot.slot_idx}
                  </p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-muted p-4">
              <p className="text-sm text-muted-foreground">
                This account is not bound to any slot.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Available Slots</Label>
            {availableSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No available slots. All slots are currently in use.
              </p>
            ) : (
              <div className="space-y-2">
                {availableSlots.map((slot) => (
                  <div
                    key={`${slot.node_seq}-${slot.slot_idx}`}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Slot {slot.node_seq}-{slot.slot_idx}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleBind(slot)}
                      disabled={bindMutation.isPending}
                    >
                      <Link2 className="mr-2 h-4 w-4" />
                      Bind
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {currentSlot && (
            <Button
              variant="destructive"
              onClick={handleUnbind}
              disabled={unbindMutation.isPending}
            >
              <Unlink className="mr-2 h-4 w-4" />
              Unbind
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AccountCard({
  account,
  onBind,
}: {
  account: TradingAccount;
  onBind: (account: TradingAccount) => void;
}) {
  const deleteMutation = useDeleteAccount();
  const isConnected = account.mt5_connection?.status === "connected";

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${account.name}"?`)) {
      deleteMutation.mutate(account.id, {
        onSuccess: () => toast.success("Account deleted"),
        onError: (error) =>
          toast.error("Failed to delete", {
            description: error instanceof Error ? error.message : "Unknown error",
          }),
      });
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-success/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <span className="text-lg">
                {brokerOptions.find((b) => b.value === account.broker_type)?.icon || "💼"}
              </span>
            </div>
            <div>
              <CardTitle className="text-base">{account.name}</CardTitle>
              <CardDescription className="text-xs">
                {account.broker_type} · {account.account_source}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                isConnected ? "bg-success" : "bg-muted-foreground"
              }`}
              title={isConnected ? "Connected" : "Disconnected"}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onBind(account)}>
                  <Link2 className="mr-2 h-4 w-4" />
                  Manage Slot
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="font-semibold">${account.balance?.toLocaleString() || "0"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Equity</p>
            <p className="font-semibold">${account.equity?.toLocaleString() || "0"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Margin</p>
            <p className="font-semibold">${account.margin?.toLocaleString() || "0"}</p>
          </div>
        </div>
        {account.account_number && (
          <p className="mt-3 text-xs text-muted-foreground">
            Account: {account.account_number}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Created {formatDate(account.created_at)}
        </p>
      </CardContent>
    </Card>
  );
}

// ============= POSITIONS COMPONENTS =============

function PositionsStats({ engagements, loading }: { engagements: Engagement[]; loading: boolean }) {
  const activePositions = engagements.filter((e) => e.phase !== "closed").length;
  const longPositions = engagements.filter((e) => e.direction === "long" && e.phase !== "closed").length;
  const shortPositions = engagements.filter((e) => e.direction === "short" && e.phase !== "closed").length;
  const totalUnrealizedPnl = engagements
    .filter((e) => e.phase !== "closed")
    .reduce((sum, e) => sum + (e.unrealized_pnl || 0), 0);

  return (
    <StatsGrid>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Active Positions"
          value={activePositions}
          description="Open trades"
          icon={Target}
          loading={loading}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Long Positions"
          value={longPositions}
          description="Buy direction"
          icon={TrendingUpIcon}
          loading={loading}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Short Positions"
          value={shortPositions}
          description="Sell direction"
          icon={TrendingDown}
          loading={loading}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Unrealized PnL"
          value={`$${totalUnrealizedPnl.toFixed(2)}`}
          description="Current session"
          icon={DollarSign}
          loading={loading}
          trend={totalUnrealizedPnl >= 0 ? { value: 0, label: "Profit" } : { value: 0, label: "Loss" }}
        />
      </motion.div>
    </StatsGrid>
  );
}

function PositionCard({ engagement }: { engagement: Engagement }) {
  const closeMutation = useCloseEngagement();
  const isProfit = (engagement.unrealized_pnl || 0) >= 0;
  const isActive = engagement.phase !== "closed";

  const handleClose = () => {
    if (confirm(`Close position in ${engagement.instrument_symbol}?`)) {
      closeMutation.mutate(engagement.id, {
        onSuccess: () => toast.success("Position closed"),
        onError: (error) =>
          toast.error("Failed to close position", {
            description: error instanceof Error ? error.message : "Unknown error",
          }),
      });
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${engagement.direction === "long" ? "bg-green-500/10" : "bg-red-500/10"}`}>
              {engagement.direction === "long" ? (
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div>
              <CardTitle className="text-base">{engagement.instrument_symbol}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs capitalize">{engagement.direction}</Badge>
                <Badge className={`text-xs text-white ${phaseColors[engagement.phase] || "bg-gray-500"}`}>
                  {engagement.phase}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isActive && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleClose} disabled={closeMutation.isPending}>
                    <X className="mr-2 h-4 w-4 text-destructive" />
                    Close Position
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Quantity</p>
            <p className="font-semibold">{engagement.quantity.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Entry Price</p>
            <p className="font-semibold">${engagement.entry_price?.toFixed(4) || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current Price</p>
            <p className="font-semibold">${engagement.current_price?.toFixed(4) || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Unrealized PnL</p>
            <p className={`font-semibold ${isProfit ? "text-green-500" : "text-red-500"}`}>
              ${engagement.unrealized_pnl?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>

        {(engagement.stop_loss || engagement.take_profit) && (
          <div className="mt-3 rounded-lg bg-muted p-2 text-xs">
            {engagement.stop_loss && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Stop Loss</span>
                <span className="font-mono">${engagement.stop_loss.toFixed(4)}</span>
              </div>
            )}
            {engagement.take_profit && (
              <div className="flex items-center justify-between mt-1">
                <span className="text-muted-foreground">Take Profit</span>
                <span className="font-mono">${engagement.take_profit.toFixed(4)}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatDate(engagement.created_at)}
        </div>
      </CardContent>
    </Card>
  );
}

function PositionsList({
  engagements,
  loading,
}: {
  engagements: Engagement[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (engagements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Crosshair className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No Active Positions</h3>
        <p className="text-sm text-muted-foreground">
          You don&apos;t have any open positions at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {engagements.map((engagement) => (
        <PositionCard key={engagement.id} engagement={engagement} />
      ))}
    </div>
  );
}

// ============= MAIN PAGE =============

export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState("accounts");
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: engagementsData, isLoading: engagementsLoading } = useEngagements();
  const [selectedAccount, setSelectedAccount] = useState<TradingAccount | null>(null);
  const [bindDialogOpen, setBindDialogOpen] = useState(false);

  const accountsList = Array.isArray(accounts) ? accounts : [];
  const engagements = Array.isArray(engagementsData) ? engagementsData : [];
  
  const activeEngagements = engagements.filter((e) => e.phase !== "closed");

  const handleBind = (account: TradingAccount) => {
    setSelectedAccount(account);
    setBindDialogOpen(true);
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
          <p className="text-muted-foreground">
            Manage trading accounts and monitor positions.
          </p>
        </div>
        <CreateAccountDialog />
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="accounts">
              <Wallet className="mr-2 h-4 w-4" />
              Accounts
            </TabsTrigger>
            <TabsTrigger value="positions">
              <Target className="mr-2 h-4 w-4" />
              Positions ({activeEngagements.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="mt-6 space-y-6">
            <AccountStats accounts={accountsList} loading={accountsLoading} />
            
            {accountsLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : accountsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Wallet className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No Trading Accounts</h3>
                <p className="text-sm text-muted-foreground">
                  Add your first trading account to get started.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {accountsList.map((account) => (
                  <AccountCard key={account.id} account={account} onBind={handleBind} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="positions" className="mt-6 space-y-6">
            <PositionsStats engagements={activeEngagements} loading={engagementsLoading} />
            <PositionsList engagements={activeEngagements} loading={engagementsLoading} />
          </TabsContent>
        </Tabs>
      </motion.div>

      {selectedAccount && (
        <BindSlotDialog
          account={selectedAccount}
          open={bindDialogOpen}
          onOpenChange={setBindDialogOpen}
        />
      )}
    </motion.div>
  );
}
