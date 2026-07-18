"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { EmptyState } from "./empty-state";
import { StatusBadge } from "./status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  RotateCcw,
  Building2,
  Briefcase,
  MessageCircleOff,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { formatDateTime, formatRelative } from "@/lib/format";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function TrashView() {
  const queryClient = useQueryClient();
  const [purgingId, setPurgingId] = useState<string | null>(null);

  const { data: records, isLoading } = useQuery({
    queryKey: ["trash"],
    queryFn: api.listTrash,
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => api.restoreJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("已恢复到主界面");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const purgeMutation = useMutation({
    mutationFn: (id: string) => api.purgeJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("已永久删除");
      setPurgingId(null);
    },
    onError: (e: Error) => {
      toast.error(e.message);
      setPurgingId(null);
    },
  });

  const list = records ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-lg font-semibold">回收站</h1>
          <p className="text-xs text-muted-foreground">
            已移除的记录将在此处保留，可恢复或永久删除。
          </p>
        </div>
        <Badge variant="secondary" className="bg-muted">
          共 {list.length} 条
        </Badge>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-xl border bg-muted/40"
            />
          ))}
        </div>
      )}

      {!isLoading && list.length === 0 && (
        <EmptyState
          icon={<Trash2 className="h-10 w-10" />}
          title="回收站为空"
          description="移除的记录会显示在这里，可随时恢复。"
        />
      )}

      {!isLoading && list.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <div
              key={r.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
            >
              {/* 顶部状态色条 */}
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-rose-400/70 to-rose-300/30" />

              {/* 企业 + 岗位 */}
              <div className="mt-1 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm font-semibold">
                      {r.companyName}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{r.positionName}</span>
                  </div>
                </div>
                <StatusBadge status={r.status} className="shrink-0" />
              </div>

              {/* 移除理由 */}
              <div className="mt-3 rounded-lg border border-dashed bg-rose-50/40 p-2.5 dark:bg-rose-950/10">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] text-rose-600 dark:text-rose-300">
                  <MessageCircleOff className="h-3 w-3" />
                  移除理由
                </div>
                <div className="text-xs leading-relaxed text-foreground/80">
                  {r.removeReason || "未填写理由"}
                </div>
              </div>

              {/* 时间 */}
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                移除于 {formatDateTime(r.trashedAt)}
                <span className="text-muted-foreground/60">
                  （{formatRelative(r.trashedAt)}）
                </span>
              </div>

              {/* 操作 */}
              <div className="mt-3 flex items-center gap-2 border-t pt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1.5"
                  onClick={() => restoreMutation.mutate(r.id)}
                  disabled={
                    restoreMutation.isPending || purgeMutation.isPending
                  }
                >
                  {restoreMutation.isPending &&
                  restoreMutation.variables === r.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="h-3.5 w-3.5" />
                  )}
                  恢复
                </Button>

                <AlertDialog
                  open={purgingId === r.id}
                  onOpenChange={(o) => setPurgingId(o ? r.id : null)}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                      disabled={
                        restoreMutation.isPending || purgeMutation.isPending
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      永久删除
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-rose-600" />
                        确认永久删除？
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        此操作不可恢复。将彻底删除
                        <span className="mx-1 font-medium text-foreground">
                          {r.companyName} · {r.positionName}
                        </span>
                        的所有信息。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-rose-600 hover:bg-rose-700"
                        onClick={() => purgeMutation.mutate(r.id)}
                      >
                        永久删除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
