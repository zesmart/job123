import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { JobStatus, JOB_STATUS_LIST, type JobStats } from "@/lib/constants";

// GET /api/stats - 获取统计数据
export async function GET() {
  try {
    const [active, favorite, trashed, byStatusRows] = await Promise.all([
      db.jobRecord.count({ where: { isTrashed: false } }),
      db.jobRecord.count({ where: { isTrashed: false, isFavorite: true } }),
      db.jobRecord.count({ where: { isTrashed: true } }),
      db.jobRecord.groupBy({
        by: ["status"],
        where: { isTrashed: false },
        _count: { _all: true },
      }),
    ]);

    const byStatus = {} as Record<JobStatus, number>;
    for (const s of JOB_STATUS_LIST) byStatus[s] = 0;
    for (const row of byStatusRows) {
      byStatus[row.status as JobStatus] = row._count._all;
    }

    const stats: JobStats = {
      total: active,
      favorite,
      byStatus,
      trashed,
    };

    return NextResponse.json({ data: stats });
  } catch (err) {
    console.error("[GET /api/stats] error:", err);
    return NextResponse.json({ error: "获取统计数据失败" }, { status: 500 });
  }
}
