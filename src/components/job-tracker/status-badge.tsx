"use client";

import { Badge } from "@/components/ui/badge";
import { JOB_STATUS_META, type JobStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
}: {
  status: JobStatus;
  className?: string;
}) {
  const meta = JOB_STATUS_META[status];
  if (!meta) return null;
  return (
    <Badge
      variant="outline"
      className={cn(
        "border font-medium whitespace-nowrap",
        meta.badgeClass,
        className
      )}
    >
      {meta.label}
    </Badge>
  );
}
