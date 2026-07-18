// 求职记录相关的类型与常量定义

// 求职状态枚举
export type JobStatus =
  | "PENDING" // 待投递
  | "APPLIED" // 已投递
  | "WRITTEN_TEST" // 笔试中
  | "INTERVIEW" // 面试中
  | "OC" // 已OC（Offer Call）
  | "OFFER" // 已Offer
  | "REJECTED"; // 已拒绝

export const JOB_STATUS_META: Record<
  JobStatus,
  {
    label: string;
    color: string;
    badgeClass: string;
    dotClass: string;
    barClass: string;
  }
> = {
  PENDING: {
    label: "待投递",
    color: "slate",
    badgeClass:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
    dotClass: "bg-slate-400",
    barClass: "bg-slate-400",
  },
  APPLIED: {
    label: "已投递",
    color: "sky",
    badgeClass:
      "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-900",
    dotClass: "bg-sky-500",
    barClass: "bg-sky-500",
  },
  WRITTEN_TEST: {
    label: "笔试中",
    color: "violet",
    badgeClass:
      "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-900",
    dotClass: "bg-violet-500",
    barClass: "bg-violet-500",
  },
  INTERVIEW: {
    label: "面试中",
    color: "amber",
    badgeClass:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900",
    dotClass: "bg-amber-500",
    barClass: "bg-amber-500",
  },
  OC: {
    label: "已OC",
    color: "teal",
    badgeClass:
      "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-900",
    dotClass: "bg-teal-500",
    barClass: "bg-teal-500",
  },
  OFFER: {
    label: "已Offer",
    color: "emerald",
    badgeClass:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900",
    dotClass: "bg-emerald-500",
    barClass: "bg-emerald-500",
  },
  REJECTED: {
    label: "已拒绝",
    color: "rose",
    badgeClass:
      "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900",
    dotClass: "bg-rose-500",
    barClass: "bg-rose-500",
  },
};

export const JOB_STATUS_LIST = Object.keys(JOB_STATUS_META) as JobStatus[];

// 企业性质枚举
export const COMPANY_TYPES = [
  "国企",
  "央企",
  "事业单位",
  "民企",
  "外企",
  "合资",
  "创业公司",
  "上市公司",
  "高校/科研",
  "其他",
] as const;

// 移除预设理由
export const PRESET_REMOVE_REASONS = [
  "岗位不匹配",
  "薪资不符合预期",
  "工作地点不合适",
  "已有更合适的选择",
  "公司风评较差",
  "投递后无回应",
  "面试未通过",
  "个人时间冲突",
  "主动放弃",
  "重复投递",
] as const;

// 前端展示用的 JobRecord 类型（与 API 返回结构对齐）
export interface JobRecord {
  id: string;
  companyName: string;
  companyType: string;
  positionName: string;
  workLocation: string;
  applyUrl: string | null;
  applyDate: string; // ISO 字符串
  status: JobStatus;
  jobDescription: string | null;
  notes: string | null;
  isFavorite: boolean;
  favoriteOrder: number;
  isTrashed: boolean;
  removeReason: string | null;
  trashedAt: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// 创建/修改时的 payload
export interface JobRecordInput {
  companyName: string;
  companyType: string;
  positionName: string;
  workLocation: string;
  applyUrl?: string | null;
  applyDate: string; // ISO 字符串
  status: JobStatus;
  jobDescription?: string | null;
  notes?: string | null;
  isFavorite?: boolean;
}

// 统计数据
export interface JobStats {
  total: number;
  favorite: number;
  byStatus: Record<JobStatus, number>;
  trashed: number;
}
