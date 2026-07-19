"use client";

import { Search, X, Filter } from "lucide-react";
import { useUIStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_STATUS_LIST, JOB_STATUS_META } from "@/lib/constants";

export function FilterBar() {
  const keyword = useUIStore((s) => s.keyword);
  const setKeyword = useUIStore((s) => s.setKeyword);
  const location = useUIStore((s) => s.location);
  const setLocation = useUIStore((s) => s.setLocation);
  const statusFilter = useUIStore((s) => s.statusFilter);
  const setStatusFilter = useUIStore((s) => s.setStatusFilter);
  const resetFilters = useUIStore((s) => s.resetFilters);

  const hasFilter =
    keyword.trim() !== "" ||
    location.trim() !== "" ||
    statusFilter !== "ALL";

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索企业名称 / 岗位名称"
          className="pl-9"
        />
        {keyword && (
          <button
            onClick={() => setKeyword("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-accent"
            aria-label="清除"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="工作地点"
          className="sm:w-36"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) =>
            setStatusFilter(v as typeof statusFilter)
          }
          id="filter-status"
        >
          <SelectTrigger className="w-[140px]">
            <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">全部状态</SelectItem>
            {JOB_STATUS_LIST.map((s) => (
              <SelectItem key={s} value={s}>
                {JOB_STATUS_META[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="shrink-0"
          >
            <X className="mr-1 h-3.5 w-3.5" />
            清除
          </Button>
        )}
      </div>
    </div>
  );
}
