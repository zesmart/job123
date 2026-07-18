import { format, formatDistanceToNow, isValid } from "date-fns";
import { zhCN } from "date-fns/locale";

// 格式化为 YYYY-MM-DD
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "—";
  return format(d, "yyyy-MM-dd");
}

// 格式化为 YYYY-MM-DD HH:mm
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "—";
  return format(d, "yyyy-MM-dd HH:mm");
}

// 相对时间，例如 "3 小时前"
export function formatRelative(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "—";
  return formatDistanceToNow(d, { addSuffix: true, locale: zhCN });
}

// 转换为 <input type="date"> 需要的格式 YYYY-MM-DD
export function toDateInputValue(
  date: string | Date | null | undefined
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "";
  return format(d, "yyyy-MM-dd");
}
