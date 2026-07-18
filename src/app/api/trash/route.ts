import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/trash - 获取回收站记录
export async function GET() {
  try {
    const records = await db.jobRecord.findMany({
      where: { isTrashed: true },
      orderBy: { trashedAt: "desc" },
    });
    return NextResponse.json({ data: records });
  } catch (err) {
    console.error("[GET /api/trash] error:", err);
    return NextResponse.json({ error: "获取回收站记录失败" }, { status: 500 });
  }
}
