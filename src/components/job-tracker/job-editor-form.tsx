"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  COMPANY_TYPES,
  JOB_STATUS_LIST,
  JOB_STATUS_META,
  type JobRecord,
  type JobStatus,
} from "@/lib/constants";
import { toDateInputValue } from "@/lib/format";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface FormState {
  companyName: string;
  companyType: string;
  positionName: string;
  workLocation: string;
  applyUrl: string;
  applyDate: string;
  status: JobStatus;
  jobDescription: string;
  notes: string;
  isFavorite: boolean;
}

function buildInitialState(editing: JobRecord | null): FormState {
  if (editing) {
    return {
      companyName: editing.companyName,
      companyType: COMPANY_TYPES.includes(
        editing.companyType as (typeof COMPANY_TYPES)[number]
      )
        ? editing.companyType
        : "其他",
      positionName: editing.positionName,
      workLocation: editing.workLocation,
      applyUrl: editing.applyUrl ?? "",
      applyDate: toDateInputValue(editing.applyDate),
      status: editing.status,
      jobDescription: editing.jobDescription ?? "",
      notes: editing.notes ?? "",
      isFavorite: editing.isFavorite,
    };
  }
  return {
    companyName: "",
    companyType: "民企",
    positionName: "",
    workLocation: "",
    applyUrl: "",
    applyDate: toDateInputValue(new Date()),
    status: "APPLIED",
    jobDescription: "",
    notes: "",
    isFavorite: false,
  };
}

export function JobEditorForm({
  editing,
  onClose,
}: {
  editing: JobRecord | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  // 用 useState 初始值完成初始化（由父组件 key 控制重新挂载）
  const [form, setForm] = useState<FormState>(() =>
    buildInitialState(editing)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: (input: FormState) =>
      api.createJob({
        companyName: input.companyName,
        companyType: input.companyType,
        positionName: input.positionName,
        workLocation: input.workLocation,
        applyUrl: input.applyUrl || null,
        applyDate: new Date(input.applyDate).toISOString(),
        status: input.status,
        jobDescription: input.jobDescription || null,
        notes: input.notes || null,
        isFavorite: input.isFavorite,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("创建成功");
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: (input: FormState) =>
      api.updateJob(editing!.id, {
        companyName: input.companyName,
        companyType: input.companyType,
        positionName: input.positionName,
        workLocation: input.workLocation,
        applyUrl: input.applyUrl || null,
        applyDate: new Date(input.applyDate).toISOString(),
        status: input.status,
        jobDescription: input.jobDescription || null,
        notes: input.notes || null,
        isFavorite: input.isFavorite,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("修改成功");
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const submitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = () => {
    const next: Record<string, string> = {};
    if (!form.companyName.trim()) next.companyName = "请填写企业名称";
    if (!form.positionName.trim()) next.positionName = "请填写岗位名称";
    if (!form.workLocation.trim()) next.workLocation = "请填写工作地点";
    if (!form.applyDate) next.applyDate = "请选择投递时间";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    if (editing) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <>
      <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
        {/* 企业名称 */}
        <Field
          label="企业名称"
          required
          error={errors.companyName}
          className="sm:col-span-2"
        >
          <Input
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            placeholder="例如：字节跳动"
          />
        </Field>

        {/* 企业性质 */}
        <Field label="企业性质">
          <Select
            value={form.companyType}
            onValueChange={(v) => set("companyType", v)}
            id="editor-company-type"
          >
            <SelectTrigger>
              <SelectValue placeholder="选择企业性质" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* 求职状态 */}
        <Field label="求职状态">
          <Select
            value={form.status}
            onValueChange={(v) => set("status", v as JobStatus)}
            id="editor-status"
          >
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              {JOB_STATUS_LIST.map((s) => (
                <SelectItem key={s} value={s}>
                  {JOB_STATUS_META[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* 岗位名称 */}
        <Field label="岗位名称" required error={errors.positionName}>
          <Input
            value={form.positionName}
            onChange={(e) => set("positionName", e.target.value)}
            placeholder="例如：前端工程师"
          />
        </Field>

        {/* 工作地点 */}
        <Field label="工作地点" required error={errors.workLocation}>
          <Input
            value={form.workLocation}
            onChange={(e) => set("workLocation", e.target.value)}
            placeholder="例如：北京 / 上海 / 远程"
          />
        </Field>

        {/* 投递时间 */}
        <Field label="投递时间" required error={errors.applyDate}>
          <Input
            type="date"
            value={form.applyDate}
            onChange={(e) => set("applyDate", e.target.value)}
          />
        </Field>

        {/* 投递链接 */}
        <Field label="投递链接">
          <Input
            value={form.applyUrl}
            onChange={(e) => set("applyUrl", e.target.value)}
            placeholder="https://..."
          />
        </Field>

        {/* 岗位描述 */}
        <Field
          label="岗位描述 / JD"
          className="sm:col-span-2"
          hint="岗位详情、任职要求等，可在记录中点击查看"
        >
          <Textarea
            value={form.jobDescription}
            onChange={(e) => set("jobDescription", e.target.value)}
            placeholder="粘贴岗位描述、薪资范围、任职要求等..."
            rows={5}
            className="resize-y"
          />
        </Field>

        {/* 备注 */}
        <Field label="备注" className="sm:col-span-2">
          <Textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="其他需要记录的信息..."
            rows={2}
            className="resize-y"
          />
        </Field>

        {/* 优选 */}
        <div className="sm:col-span-2 flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
          <div>
            <div className="text-sm font-medium">加入优选区</div>
            <div className="text-xs text-muted-foreground">
              标记为最合适最匹配的记录，显示在主界面顶部
            </div>
          </div>
          <Switch
            checked={form.isFavorite}
            onCheckedChange={(v) => set("isFavorite", v)}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={submitting}>
          取消
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editing ? "保存修改" : "创建记录"}
        </Button>
      </DialogFooter>
    </>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 flex items-center gap-1 text-sm">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
      )}
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
