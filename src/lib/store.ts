"use client";

import { create } from "zustand";
import type { JobStatus } from "@/lib/constants";
import type { JobRecord } from "@/lib/constants";

export type View = "main" | "trash";

interface UIState {
  // 当前视图
  view: View;
  setView: (v: View) => void;

  // 筛选条件
  statusFilter: JobStatus | "ALL";
  keyword: string;
  location: string;
  setStatusFilter: (s: JobStatus | "ALL") => void;
  setKeyword: (k: string) => void;
  setLocation: (l: string) => void;
  resetFilters: () => void;

  // 创建/修改对话框
  editorOpen: boolean;
  editingRecord: JobRecord | null;
  openEditor: (record?: JobRecord | null) => void;
  closeEditor: () => void;

  // 详情对话框
  detailRecord: JobRecord | null;
  openDetail: (r: JobRecord) => void;
  closeDetail: () => void;

  // 移除对话框
  removeRecord: JobRecord | null;
  openRemove: (r: JobRecord) => void;
  closeRemove: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  view: "main",
  setView: (v) => set({ view: v }),

  statusFilter: "ALL",
  keyword: "",
  location: "",
  setStatusFilter: (s) => set({ statusFilter: s }),
  setKeyword: (k) => set({ keyword: k }),
  setLocation: (l) => set({ location: l }),
  resetFilters: () =>
    set({ statusFilter: "ALL", keyword: "", location: "" }),

  editorOpen: false,
  editingRecord: null,
  openEditor: (record = null) =>
    set({ editorOpen: true, editingRecord: record }),
  closeEditor: () => set({ editorOpen: false, editingRecord: null }),

  detailRecord: null,
  openDetail: (r) => set({ detailRecord: r }),
  closeDetail: () => set({ detailRecord: null }),

  removeRecord: null,
  openRemove: (r) => set({ removeRecord: r }),
  closeRemove: () => set({ removeRecord: null }),
}));
