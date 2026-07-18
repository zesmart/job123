"use client";

import { useUIStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JobEditorForm } from "./job-editor-form";

export function JobEditorDialog() {
  const open = useUIStore((s) => s.editorOpen);
  const editing = useUIStore((s) => s.editingRecord);
  const closeEditor = useUIStore((s) => s.closeEditor);

  // 用 key 强制每次打开/切换 record 时重新挂载内部表单组件，
  // 从而用 useState 初始值完成初始化，避免在 effect 中 setState
  const formKey = open
    ? editing
      ? `edit-${editing.id}`
      : "new"
    : "closed";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) closeEditor();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>
            {editing ? "修改求职记录" : "新建求职记录"}
          </DialogTitle>
          <DialogDescription>
            填写投递信息，标记状态以便后续跟踪。带{" "}
            <span className="text-destructive">*</span> 为必填。
          </DialogDescription>
        </DialogHeader>
        {open && (
          <JobEditorForm
            key={formKey}
            editing={editing}
            onClose={closeEditor}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
