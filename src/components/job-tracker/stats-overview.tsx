"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Briefcase,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { JOB_STATUS_LIST, JOB_STATUS_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store";

export function StatsOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: api.getStats,
  });

  const setView = useUIStore((s) => s.setView);
  const setStatusFilter = useUIStore((s) => s.setStatusFilter);

  const cards = [
    {
      key: "total",
      label: "投递总数",
      value: stats?.total ?? 0,
      icon: Briefcase,
      tint: "text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-300",
      onClick: () => {
        setView("main");
        setStatusFilter("ALL");
      },
    },
    {
      key: "favorite",
      label: "优选记录",
      value: stats?.favorite ?? 0,
      icon: Star,
      tint: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300",
      onClick: () => setView("main"),
    },
    {
      key: "interview",
      label: "流程中",
      value: stats
        ? (stats.byStatus.WRITTEN_TEST +
            stats.byStatus.INTERVIEW +
            stats.byStatus.OC)
        : 0,
      icon: TrendingUp,
      tint: "text-violet-600 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-300",
      onClick: () => {
        setView("main");
        setStatusFilter("INTERVIEW");
      },
    },
    {
      key: "trashed",
      label: "回收站",
      value: stats?.trashed ?? 0,
      icon: Trash2,
      tint: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300",
      onClick: () => setView("trash"),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((c) => (
        <button
          key={c.key}
          onClick={c.onClick}
          className="group flex items-center gap-3 rounded-xl border bg-card p-3 text-left transition-all hover:shadow-sm sm:p-4"
        >
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              c.tint
            )}
          >
            <c.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground sm:text-xs">
              {c.label}
            </div>
            <div className="text-xl font-semibold tabular-nums sm:text-2xl">
              {isLoading ? "—" : c.value}
            </div>
          </div>
        </button>
      ))}

      {/* 状态分布条 */}
      <div className="col-span-2 sm:col-span-4">
        <div className="rounded-xl border bg-card p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              状态分布
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              共 {stats?.total ?? 0} 条
            </span>
          </div>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
            {isLoading ? (
              <div className="h-full w-full animate-pulse bg-muted" />
            ) : stats && stats.total > 0 ? (
              JOB_STATUS_LIST.map((s) => {
                const v = stats.byStatus[s];
                if (!v) return null;
                const pct = (v / stats.total) * 100;
                return (
                  <div
                    key={s}
                    className={cn(
                      "h-full transition-all",
                      JOB_STATUS_META[s].barClass
                    )}
                    style={{ width: `${pct}%` }}
                    title={`${JOB_STATUS_META[s].label}: ${v}`}
                  />
                );
              })
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                暂无数据
              </div>
            )}
          </div>
          {stats && stats.total > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
              {JOB_STATUS_LIST.filter((s) => stats.byStatus[s] > 0).map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
                >
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      JOB_STATUS_META[s].dotClass
                    )}
                  />
                  {JOB_STATUS_META[s].label}
                  <span className="tabular-nums text-foreground">
                    {stats.byStatus[s]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
