"use client";

import {
  MapPin,
  Link2,
  Calendar,
  Star,
  Pencil,
  Trash2,
  Eye,
  ExternalLink,
} from "lucide-react";
import type { JobRecord } from "@/lib/constants";
import { JOB_STATUS_META } from "@/lib/constants";
import { StatusBadge } from "./status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function JobRow({ record }: { record: JobRecord }) {
  const openDetail = useUIStore((s) => s.openDetail);
  const openEditor = useUIStore((s) => s.openEditor);
  const openRemove = useUIStore((s) => s.openRemove);
  const queryClient = useQueryClient();

  const favMutation = useMutation({
    mutationFn: (fav: boolean) => api.toggleFavorite(record.id, fav),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border bg-card p-4 transition-all hover:shadow-md lg:flex-row lg:items-center lg:gap-4 lg:p-4",
        record.isFavorite && "ring-1 ring-amber-300/60 dark:ring-amber-700/40"
      )}
    >
      {/* 左侧状态色条 */}
      <span
        className={cn(
          "absolute left-0 top-4 bottom-4 w-1 rounded-full",
          JOB_STATUS_META[record.status]?.barClass ?? "bg-slate-300"
        )}
        aria-hidden
      />

      {/* 主体信息 */}
      <button
        onClick={() => openDetail(record)}
        className="flex flex-1 items-start gap-3 pl-3 text-left lg:items-center"
      >
        {/* 企业 + 岗位 */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-sm font-semibold lg:text-base">
              {record.companyName}
            </span>
            <Badge
              variant="secondary"
              className="shrink-0 bg-muted text-muted-foreground"
            >
              {record.companyType}
            </Badge>
            <StatusBadge status={record.status} />
          </div>
          <div className="mt-0.5 truncate text-sm text-muted-foreground">
            {record.positionName}
          </div>
        </div>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground lg:gap-x-5">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate max-w-[8rem]">
              {record.workLocation}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(record.applyDate)}
          </span>
          {record.applyUrl && (
            <a
              href={record.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-sky-600 hover:underline dark:text-sky-400"
            >
              <Link2 className="h-3.5 w-3.5" />
              投递链接
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </button>

      {/* 操作按钮 */}
      <div className="flex items-center justify-end gap-1 pl-3 lg:pl-2">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8",
            record.isFavorite
              ? "text-amber-500 hover:text-amber-600"
              : "text-muted-foreground hover:text-amber-500"
          )}
          onClick={() =>
            favMutation.mutate(!record.isFavorite)
          }
          disabled={favMutation.isPending}
          aria-label={record.isFavorite ? "取消优选" : "加入优选"}
          title={record.isFavorite ? "取消优选" : "加入优选"}
        >
          <Star
            className={cn("h-4 w-4", record.isFavorite && "fill-current")}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => openDetail(record)}
          aria-label="查看详情"
          title="查看详情"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => openEditor(record)}
          aria-label="修改"
          title="修改"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
          onClick={() => openRemove(record)}
          aria-label="移除"
          title="移除"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
