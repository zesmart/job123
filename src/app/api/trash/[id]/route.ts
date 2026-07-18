import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/trash/[id] - 获取回收站单条记录（可选）
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await db.jobRecord.findUnique({ where: { id } });
    if (!record || !record.isTrashed) {
      return NextResponse.json({ error: "回收站记录不存在" }, { status: 404 });
    }
    return NextResponse.json({ data: record });
  } catch (err) {
    console.error("[GET /api/trash/[id]] error:", err);
    return NextResponse.json({ error: "获取回收站记录失败" }, { status: 500 });
  }
}

// DELETE /api/trash/[id] - 永久删除（不可恢复）
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.jobRecord.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "记录不存在" }, { status: 404 });
    }
    await db.jobRecord.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/trash/[id]] error:", err);
    return NextResponse.json({ error: "永久删除失败" }, { status: 500 });
  }
}
