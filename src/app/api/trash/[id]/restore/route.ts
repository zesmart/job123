import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/trash/[id]/restore - 从回收站恢复到主界面
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.jobRecord.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "记录不存在" }, { status: 404 });
    }
    if (!existing.isTrashed) {
      return NextResponse.json({ error: "该记录不在回收站" }, { status: 400 });
    }

    const updated = await db.jobRecord.update({
      where: { id },
      data: {
        isTrashed: false,
        removeReason: null,
        trashedAt: null,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("[POST /api/trash/[id]/restore] error:", err);
    return NextResponse.json({ error: "恢复记录失败" }, { status: 500 });
  }
}
