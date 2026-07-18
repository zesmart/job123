"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useUIStore } from "@/lib/store";
import { JobRow } from "./job-row";
import { FilterBar } from "./filter-bar";
import { StatsOverview } from "./stats-overview";
import { EmptyState } from "./empty-state";
import { Star, Inbox, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

export function MainView() {
  const keyword = useUIStore((s) => s.keyword);
  const location = useUIStore((s) => s.location);
  const statusFilter = useUIStore((s) => s.statusFilter);
  const openEditor = useUIStore((s) => s.openEditor);

  const { data: records, isLoading } = useQuery({
    queryKey: ["jobs", { statusFilter, keyword, location }],
    queryFn: () =>
      api.listJobs({
        status: statusFilter,
        keyword,
        location,
      }),
  });

  const { favorite, normal } = useMemo(() => {
    const fav = (records ?? []).filter((r) => r.isFavorite);
    const nor = (records ?? []).filter((r) => !r.isFavorite);
    return { favorite: fav, normal: nor };
  }, [records]);

  const isEmpty = !isLoading && (records?.length ?? 0) === 0;
  const hasFilters =
    keyword.trim() !== "" ||
    location.trim() !== "" ||
    statusFilter !== "ALL";

  return (
    <div className="flex flex-col gap-5">
      <StatsOverview />

      <FilterBar />

      {/* 加载骨架 */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border bg-muted/40"
            />
          ))}
        </div>
      )}

      {/* 空状态 */}
      {isEmpty && !hasFilters && (
        <EmptyState
          icon={<Inbox className="h-10 w-10" />}
          title="还没有任何求职记录"
          description="点击下方按钮，创建你的第一条投递记录吧。"
          action={
            <Button onClick={() => openEditor(null)} className="gap-2">
              <Plus className="h-4 w-4" />
              新建求职记录
            </Button>
          }
        />
      )}

      {isEmpty && hasFilters && (
        <EmptyState
          icon={<Inbox className="h-10 w-10" />}
          title="没有匹配的记录"
          description="试试调整筛选条件或清除筛选。"
        />
      )}

      {/* 优选区 */}
      {!isLoading && favorite.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <h2 className="text-sm font-semibold">优选区</h2>
            <span className="text-xs text-muted-foreground">
              最合适最匹配的 {favorite.length} 条
            </span>
            <div className="ml-2 h-px flex-1 bg-gradient-to-r from-amber-300/40 to-transparent" />
          </div>
          <div className="grid grid-cols-1 gap-3">
            {favorite.map((r) => (
              <JobRow key={r.id} record={r} />
            ))}
          </div>
        </section>
      )}

      {/* 普通列表 */}
      {!isLoading && normal.length > 0 && (
        <section className="flex flex-col gap-3">
          {favorite.length > 0 && (
            <div className="flex items-center gap-2 px-1">
              <h2 className="text-sm font-semibold">全部记录</h2>
              <span className="text-xs text-muted-foreground">
                共 {normal.length} 条
              </span>
              <div className="ml-2 h-px flex-1 bg-border" />
            </div>
          )}
          <div className="grid grid-cols-1 gap-3">
            {normal.map((r) => (
              <JobRow key={r.id} record={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
