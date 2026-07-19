"use client";

import { useState } from "react";
import { useUIStore } from "@/lib/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { PRESET_REMOVE_REASONS } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Loader2 } from "lucide-react";

export function RemoveDialog() {
  const record = useUIStore((s) => s.removeRecord);
  const closeRemove = useUIStore((s) => s.closeRemove);

  const open = !!record;
  // 用 key 在 record 变化时重新挂载内部表单，避免 effect setState
  const formKey = record ? `remove-${record.id}` : "closed";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) closeRemove();
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        {record && (
          <RemoveForm
            key={formKey}
            companyName={record.companyName}
            positionName={record.positionName}
            recordId={record.id}
            onClose={closeRemove}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function RemoveForm({
  companyName,
  positionName,
  recordId,
  onClose,
}: {
  companyName: string;
  positionName: string;
  recordId: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [preset, setPreset] = useState<string>("__none__");
  const [custom, setCustom] = useState("");

  const removeMutation = useMutation({
    mutationFn: (reason: string | undefined) =>
      api.removeJob(recordId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("已移至回收站");
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const finalReason = (() => {
    const c = custom.trim();
    const p = preset !== "__none__" ? preset : "";
    if (c && p) return `${p}｜${c}`;
    if (c) return c;
    if (p) return p;
    return undefined;
  })();

  const handleSubmit = () => {
    removeMutation.mutate(finalReason);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
            <Trash2 className="h-4 w-4" />
          </span>
          移除求职记录
        </DialogTitle>
        <DialogDescription>
          将移除
          <span className="mx-1 font-medium text-foreground">
            {companyName} · {positionName}
          </span>
          ，记录会进入回收站，可随时恢复。
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4 py-2">
        {/* 预设理由 */}
        <div>
          <Label className="mb-1.5 block text-sm">移除理由（可选）</Label>
          <Select value={preset} onValueChange={setPreset} id="remove-reason">
            <SelectTrigger>
              <SelectValue placeholder="选择一个预设理由..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">不选择预设</SelectItem>
              {PRESET_REMOVE_REASONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 自定义理由 */}
        <div>
          <Label className="mb-1.5 block text-sm">补充说明（可选）</Label>
          <Textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="填写自定义的移除理由..."
            rows={3}
            className="resize-y"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            {finalReason
              ? `最终理由：${finalReason}`
              : "未填写理由也可移除"}
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={removeMutation.isPending}>
          取消
        </Button>
        <Button
          variant="destructive"
          onClick={handleSubmit}
          disabled={removeMutation.isPending}
        >
          {removeMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          确认移除
        </Button>
      </DialogFooter>
    </>
  );
}
