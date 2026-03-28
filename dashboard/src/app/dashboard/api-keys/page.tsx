"use client";

import { useState } from "react";
import { gatewayClient, type CreateApiKeyResponse } from "@/lib/api";
import { formatDistanceToNow, formatDate } from "@/lib/date";
import { useAuth } from "@clerk/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/hooks";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  Plus,
  Copy,
  Trash2,
  Key,
  AlertTriangle,
  Check,
  ShieldAlert,
} from "lucide-react";
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

function CreateKeyDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [newKey, setNewKey] = useState<CreateApiKeyResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (keyName: string) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.createApiKey(token, keyName);
    },
    onSuccess: (data) => {
      if (!data || typeof data !== "object" || !data.api_key) {
        toast.error("Failed to create API key", {
          description: "Invalid response from server",
        });
        return;
      }
      setNewKey(data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.API_KEYS });
    },
    onError: (error) => {
      toast.error("Failed to create API key", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Please enter a key name");
      return;
    }
    createMutation.mutate(name);
  };

  const handleCopy = async () => {
    if (newKey?.api_key) {
      await navigator.clipboard.writeText(newKey.api_key);
      setCopied(true);
      toast.success("API key copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setNewKey(null);
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(o) : handleClose())}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {!newKey ? (
          <>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Give your API key a name to help you identify it later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production Key"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Key"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-yellow-500">
                <AlertTriangle className="h-5 w-5" />
                Save Your API Key
              </DialogTitle>
              <DialogDescription>
                This is the only time you will see this key. Copy it now and
                store it securely.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <code className="flex-1 rounded-md bg-muted p-3 font-mono text-sm break-all">
                    {newKey.api_key}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function RevokeKeyDialog({
  keyId,
  keyName,
}: {
  keyId: string;
  keyName: string;
}) {
  const [open, setOpen] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const revokeMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.revokeApiKey(token, keyId);
    },
    onSuccess: () => {
      toast.success("API key revoked");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.API_KEYS });
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to revoke API key", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke API Key</DialogTitle>
          <DialogDescription>
            Are you sure you want to revoke &quot;{keyName}&quot;? This action
            cannot be undone and any applications using this key will stop
            working.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => revokeMutation.mutate()}
            disabled={revokeMutation.isPending}
          >
            {revokeMutation.isPending ? "Revoking..." : "Revoke Key"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function KeysTable({ keys, loading }: { keys: Awaited<ReturnType<typeof gatewayClient.listApiKeys>>; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (keys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Key className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No API Keys</h3>
        <p className="text-sm text-muted-foreground">
          Create your first API key to get started.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Key</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Last Used</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keys.map((key) => (
          <TableRow key={key.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                {key.name || "Unnamed Key"}
              </div>
            </TableCell>
            <TableCell>
              <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                sk_••••{key.id.slice(-4)}
              </code>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(key.created_at)}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {key.last_used ? formatDistanceToNow(key.last_used) : "Never"}
            </TableCell>
            <TableCell>
              <Badge variant={key.revoked ? "destructive" : "default"}>
                {key.revoked ? "Revoked" : "Active"}
              </Badge>
            </TableCell>
            <TableCell>
              {!key.revoked && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <RevokeKeyDialog
                          keyId={key.id}
                          keyName={key.name || "Unnamed Key"}
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Revoke key</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ApiKeysPage() {
  const { getToken } = useAuth();

  const { data: keys, isLoading } = useQuery({
    queryKey: QUERY_KEYS.API_KEYS,
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return gatewayClient.listApiKeys(token);
    },
  });

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight">API Keys</h2>
          <p className="text-muted-foreground">
            Manage your API keys for accessing TradePose services.
          </p>
        </div>
        <CreateKeyDialog />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
            <CardDescription>
              API keys are used to authenticate requests to the TradePose API.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KeysTable keys={Array.isArray(keys) ? keys : []} loading={isLoading} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-500">
              <ShieldAlert className="h-5 w-5" />
              Security Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
              <li>Never share your API keys publicly or commit them to version control.</li>
              <li>Rotate your keys regularly (every 90 days recommended).</li>
              <li>Use separate keys for development and production environments.</li>
              <li>Revoke unused keys immediately.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
