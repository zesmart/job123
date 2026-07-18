"use client";

import { useUIStore } from "@/lib/store";
import { StatusBadge } from "./status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  MapPin,
  Link2,
  Calendar,
  Pencil,
  ExternalLink,
  StickyNote,
  FileText,
  Clock,
} from "lucide-react";
import { formatDate, formatRelative } from "@/lib/format";

export function JobDetailDialog() {
  const record = useUIStore((s) => s.detailRecord);
  const closeDetail = useUIStore((s) => s.closeDetail);
  const openEditor = useUIStore((s) => s.openEditor);
  const openRemove = useUIStore((s) => s.openRemove);

  const open = !!record;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) closeDetail();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
        {record && (
          <>
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-center gap-2 pr-8">
                <span className="text-lg">{record.companyName}</span>
                <StatusBadge status={record.status} />
              </DialogTitle>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {record.positionName}
                </span>
                <Badge variant="secondary" className="bg-muted">
                  {record.companyType}
                </Badge>
                {record.isFavorite && (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900">
                    优选
                  </Badge>
                )}
              </div>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-1">
              {/* 元信息网格 */}
              <div className="grid grid-cols-2 gap-3">
                <InfoItem
                  icon={<MapPin className="h-4 w-4" />}
                  label="工作地点"
                  value={record.workLocation}
                />
                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="投递时间"
                  value={formatDate(record.applyDate)}
                />
                <InfoItem
                  icon={<Building2 className="h-4 w-4" />}
                  label="企业性质"
                  value={record.companyType}
                />
                <InfoItem
                  icon={<Clock className="h-4 w-4" />}
                  label="创建于"
                  value={formatRelative(record.createdAt)}
                />
              </div>

              {/* 投递链接 */}
              {record.applyUrl && (
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Link2 className="h-3.5 w-3.5" />
                    投递链接
                  </div>
                  <a
                    href={record.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-sky-600 hover:underline dark:text-sky-400 break-all"
                  >
                    <span className="truncate max-w-full">{record.applyUrl}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </div>
              )}

              {/* 岗位描述 */}
              {record.jobDescription ? (
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    岗位描述
                  </div>
                  <div className="whitespace-pre-wrap rounded-lg border bg-card p-3 text-sm leading-relaxed">
                    {record.jobDescription}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed bg-muted/20 p-3 text-center text-xs text-muted-foreground">
                  暂未填写岗位描述
                </div>
              )}

              {/* 备注 */}
              {record.notes && (
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <StickyNote className="h-3.5 w-3.5" />
                    备注
                  </div>
                  <div className="whitespace-pre-wrap rounded-lg border bg-amber-50/50 p-3 text-sm leading-relaxed dark:bg-amber-950/10">
                    {record.notes}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                onClick={() => {
                  closeDetail();
                  openRemove(record);
                }}
              >
                移除
              </Button>
              <Button
                onClick={() => {
                  closeDetail();
                  openEditor(record);
                }}
              >
                <Pencil className="mr-1.5 h-4 w-4" />
                修改
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
