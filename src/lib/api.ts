import type {
  JobRecord,
  JobRecordInput,
  JobStats,
  JobStatus,
} from "@/lib/constants";

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error || "请求失败");
  }
  return (data as { data: T }).data;
}

export const api = {
  // 主界面
  listJobs: async (params?: {
    status?: JobStatus | "ALL";
    keyword?: string;
    location?: string;
  }): Promise<JobRecord[]> => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.keyword) qs.set("keyword", params.keyword);
    if (params?.location) qs.set("location", params.location);
    const url = `/api/jobs${qs.toString() ? `?${qs}` : ""}`;
    return handle<JobRecord[]>(await fetch(url, { cache: "no-store" }));
  },

  createJob: async (input: JobRecordInput): Promise<JobRecord> =>
    handle<JobRecord>(
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
    ),

  updateJob: async (
    id: string,
    input: Partial<JobRecordInput>
  ): Promise<JobRecord> =>
    handle<JobRecord>(
      await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
    ),

  removeJob: async (id: string, removeReason?: string): Promise<JobRecord> =>
    handle<JobRecord>(
      await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ removeReason }),
      })
    ),

  toggleFavorite: async (id: string, favorite: boolean): Promise<JobRecord> =>
    handle<JobRecord>(
      await fetch(`/api/jobs/${id}/favorite`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite }),
      })
    ),

  // 回收站
  listTrash: async (): Promise<JobRecord[]> =>
    handle<JobRecord[]>(await fetch("/api/trash", { cache: "no-store" })),

  restoreJob: async (id: string): Promise<JobRecord> =>
    handle<JobRecord>(
      await fetch(`/api/trash/${id}/restore`, { method: "POST" })
    ),

  purgeJob: async (id: string): Promise<void> => {
    const res = await fetch(`/api/trash/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error((data as { error?: string })?.error || "永久删除失败");
    }
  },

  // 统计
  getStats: async (): Promise<JobStats> =>
    handle<JobStats>(await fetch("/api/stats", { cache: "no-store" })),
};
