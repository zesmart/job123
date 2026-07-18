import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { JobStatus } from "@/lib/constants";

// GET /api/jobs/[id] - 获取单条记录详情
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await db.jobRecord.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ error: "记录不存在" }, { status: 404 });
    }
    return NextResponse.json({ data: record });
  } catch (err) {
    console.error("[GET /api/jobs/[id]] error:", err);
    return NextResponse.json({ error: "获取记录详情失败" }, { status: 500 });
  }
}

// PUT /api/jobs/[id] - 修改记录
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      companyName,
      companyType,
      positionName,
      workLocation,
      applyUrl,
      applyDate,
      status,
      jobDescription,
      notes,
      isFavorite,
    } = body || {};

    const existing = await db.jobRecord.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "记录不存在" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (companyName !== undefined) data.companyName = String(companyName).trim();
    if (companyType !== undefined) data.companyType = String(companyType).trim();
    if (positionName !== undefined) data.positionName = String(positionName).trim();
    if (workLocation !== undefined) data.workLocation = String(workLocation).trim();
    if (applyUrl !== undefined)
      data.applyUrl = applyUrl ? String(applyUrl).trim() : null;
    if (applyDate !== undefined) data.applyDate = new Date(applyDate);
    if (status !== undefined) data.status = status as JobStatus;
    if (jobDescription !== undefined)
      data.jobDescription = jobDescription ? String(jobDescription) : null;
    if (notes !== undefined) data.notes = notes ? String(notes) : null;
    if (isFavorite !== undefined) data.isFavorite = Boolean(isFavorite);

    const updated = await db.jobRecord.update({ where: { id }, data });
    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("[PUT /api/jobs/[id]] error:", err);
    return NextResponse.json({ error: "修改记录失败" }, { status: 500 });
  }
}

// DELETE /api/jobs/[id] - 移除记录到回收站（软删除）
// body: { removeReason?: string }
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let body: { removeReason?: string } = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const existing = await db.jobRecord.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "记录不存在" }, { status: 404 });
    }

    const updated = await db.jobRecord.update({
      where: { id },
      data: {
        isTrashed: true,
        removeReason: body.removeReason ? String(body.removeReason).trim() : null,
        trashedAt: new Date(),
        isFavorite: false, // 移除时取消优选
      },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("[DELETE /api/jobs/[id]] error:", err);
    return NextResponse.json({ error: "移除记录失败" }, { status: 500 });
  }
}
