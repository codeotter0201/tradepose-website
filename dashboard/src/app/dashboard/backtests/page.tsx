"use client";

import { useState } from "react";
import { useTasks, useCreateTask, QUERY_KEYS } from "@/lib/hooks";
import { gatewayClient, type Task, type TaskStatus, type TaskType } from "@/lib/api";
import { formatDistanceToNow, formatDate } from "@/lib/date";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Plus,
  MoreVertical,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  BarChart3,
  FileArchive,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { StatCard, StatsGrid } from "@/components/dashboard/stat-card";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

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

const statusColors: Record<TaskStatus, string> = {
  pending: "bg-yellow-500",
  running: "bg-blue-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
};

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  running: <Loader2 className="h-4 w-4 animate-spin" />,
  completed: <CheckCircle2 className="h-4 w-4" />,
  failed: <XCircle className="h-4 w-4" />,
};

function BacktestsStats({ tasks, loading }: { tasks: Task[]; loading: boolean }) {
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const runningCount = tasks.filter((t) => t.status === "running").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const failedCount = tasks.filter((t) => t.status === "failed").length;

  return (
    <StatsGrid>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Pending"
          value={pendingCount}
          description="Queued tasks"
          icon={Clock}
          loading={loading}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Running"
          value={runningCount}
          description="Active tasks"
          icon={Loader2}
          loading={loading}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Completed"
          value={completedCount}
          description="Successful"
          icon={CheckCircle2}
          loading={loading}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Failed"
          value={failedCount}
          description="Errors"
          icon={XCircle}
          loading={loading}
        />
      </motion.div>
    </StatsGrid>
  );
}

function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<TaskType>("backtest");
  const [description, setDescription] = useState("");
  const createMutation = useCreateTask();

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Please enter a task name");
      return;
    }

    createMutation.mutate(
      {
        type,
        name: name.trim(),
        description: description || undefined,
        config: {},
      },
      {
        onSuccess: () => {
          toast.success("Task created successfully");
          setOpen(false);
          setName("");
          setType("backtest");
          setDescription("");
        },
        onError: (error) => {
          toast.error("Failed to create task", {
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
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Submit a new backtest or export task.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Task Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Strategy A Backtest Q1 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Task Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as TaskType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backtest">Backtest</SelectItem>
                <SelectItem value="export">Export Data</SelectItem>
                <SelectItem value="optimization">Optimization</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TaskCard({ task }: { task: Task }) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const handleDownload = async () => {
    const token = await getToken();
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    try {
      const blob = await gatewayClient.downloadTaskResult(token, task.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `task-${task.id}-results.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Download started");
    } catch {
      toast.error("Failed to download results");
    }
  };

  const handleRefresh = async () => {
    const token = await getToken();
    if (!token) return;

    try {
      await gatewayClient.getTask(token, task.id);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      toast.success("Task status refreshed");
    } catch {
      toast.error("Failed to refresh");
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${statusColors[task.status]} bg-opacity-10`}
            >
              <span className="text-white">{statusIcons[task.status]}</span>
            </div>
            <div>
              <CardTitle className="text-base">{task.name}</CardTitle>
              <CardDescription className="text-xs">
                {task.type} · {formatDistanceToNow(task.created_at)}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </DropdownMenuItem>
              {task.status === "completed" && (
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Results
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {task.description && (
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{task.progress || 0}%</span>
        </div>
        <Progress value={task.progress || 0} className="h-2" />

        <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Created:</span>
            <br />
            {formatDate(task.created_at)}
          </div>
          {task.completed_at && (
            <div>
              <span className="text-muted-foreground">Completed:</span>
              <br />
              {formatDate(task.completed_at)}
            </div>
          )}
        </div>

        {task.error_message && (
          <div className="mt-3 rounded-lg bg-red-500/10 p-2 text-xs text-red-500">
            {task.error_message}
          </div>
        )}

        {task.status === "completed" && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={handleDownload}
          >
            <FileArchive className="mr-2 h-4 w-4" />
            Download Results
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function TasksList({ tasks, loading }: { tasks: Task[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No Tasks</h3>
        <p className="text-sm text-muted-foreground">
          Create your first backtest or export task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default function BacktestsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { data: allTasks, isLoading } = useTasks();

  const tasks = Array.isArray(allTasks) ? allTasks : [];

  const filteredTasks =
    activeTab === "all"
      ? tasks
      : activeTab === "running"
      ? tasks.filter((t) => t.status === "running" || t.status === "pending")
      : activeTab === "completed"
      ? tasks.filter((t) => t.status === "completed")
      : tasks.filter((t) => t.status === activeTab);

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
          <h2 className="text-3xl font-bold tracking-tight">Backtests</h2>
          <p className="text-muted-foreground">
            Manage your backtest tasks and export jobs.
          </p>
        </div>
        <CreateTaskDialog />
      </motion.div>

      <motion.div variants={itemVariants}>
        <BacktestsStats tasks={tasks} loading={isLoading} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              All ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="running">
              Running ({tasks.filter((t) => t.status === "running" || t.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({tasks.filter((t) => t.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed ({tasks.filter((t) => t.status === "failed").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <TasksList tasks={filteredTasks} loading={isLoading} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
