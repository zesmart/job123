"use client";

import {
  Briefcase,
  Trash2,
  Plus,
  LayoutList,
  Star,
  X,
} from "lucide-react";
import { useUIStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { JOB_STATUS_LIST, JOB_STATUS_META } from "@/lib/constants";

export function SidebarNav({ onClose }: { onClose?: () => void }) {
  const view = useUIStore((s) => s.view);
  const setView = useUIStore((s) => s.setView);
  const setStatusFilter = useUIStore((s) => s.setStatusFilter);
  const statusFilter = useUIStore((s) => s.statusFilter);
  const openEditor = useUIStore((s) => s.openEditor);

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: api.getStats,
  });

  const goMain = () => {
    setView("main");
    onClose?.();
  };
  const goTrash = () => {
    setView("trash");
    onClose?.();
  };

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      {/* 品牌 */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">求职记录</span>
            <span className="text-[11px] text-muted-foreground">
              Job Tracker
            </span>
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={onClose}
            aria-label="关闭侧边栏"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 新建按钮 */}
      <Button
        className="w-full justify-start gap-2 shadow-sm"
        onClick={() => {
          openEditor(null);
          onClose?.();
        }}
      >
        <Plus className="h-4 w-4" />
        新建求职记录
      </Button>

      {/* 主导航 */}
      <nav className="flex flex-col gap-1">
        <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          导航
        </p>
        <NavItem
          active={view === "main"}
          onClick={goMain}
          icon={<LayoutList className="h-4 w-4" />}
          label="主界面"
          count={stats?.total ?? 0}
        />
        <NavItem
          active={view === "trash"}
          onClick={goTrash}
          icon={<Trash2 className="h-4 w-4" />}
          label="回收站"
          count={stats?.trashed ?? 0}
          danger
        />
      </nav>

      {/* 优选 + 状态速览 */}
      <div className="flex flex-col gap-1">
        <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          速览
        </p>
        <div className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm">
          <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Star className="h-4 w-4 fill-current" />
            优选
          </span>
          <span className="text-muted-foreground">
            {stats?.favorite ?? 0}
          </span>
        </div>
        {view === "main" && (
          <div className="mt-2 flex flex-col gap-0.5">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent",
                statusFilter === "ALL"
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <span>全部状态</span>
              <span>{stats?.total ?? 0}</span>
            </button>
            {JOB_STATUS_LIST.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent",
                  statusFilter === s
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      JOB_STATUS_META[s].dotClass
                    )}
                  />
                  {JOB_STATUS_META[s].label}
                </span>
                <span>{stats?.byStatus[s] ?? 0}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto px-2 pb-2 text-[11px] leading-relaxed text-muted-foreground">
        <p>个人私有 · 数据本地存储</p>
        <p className="mt-0.5">多设备可同步访问</p>
      </div>
    </div>
  );
}

function NavItem({
  active,
  onClick,
  icon,
  label,
  count,
  danger,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? danger
            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
            : "bg-accent text-foreground font-medium"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <span className="flex items-center gap-2.5">
        {icon}
        {label}
      </span>
      {typeof count === "number" && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
            active
              ? "bg-background/70 text-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
