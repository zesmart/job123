import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { JobStatus, JOB_STATUS_LIST } from "@/lib/constants";

// GET /api/jobs - 获取主界面的所有活跃记录（非回收站）
// 查询参数：status, keyword, location
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as JobStatus | "ALL" | null;
    const keyword = searchParams.get("keyword")?.trim() || "";
    const location = searchParams.get("location")?.trim() || "";

    const where: Record<string, unknown> = { isTrashed: false };
    if (status && status !== "ALL" && JOB_STATUS_LIST.includes(status)) {
      where.status = status;
    }
    if (keyword) {
      where.OR = [
        { companyName: { contains: keyword } },
        { positionName: { contains: keyword } },
      ];
    }
    if (location) {
      where.workLocation = { contains: location };
    }

    const records = await db.jobRecord.findMany({
      where,
      orderBy: [
        { isFavorite: "desc" },
        { favoriteOrder: "asc" },
        { sortOrder: "asc" },
        { applyDate: "desc" },
      ],
    });

    return NextResponse.json({ data: records });
  } catch (err) {
    console.error("[GET /api/jobs] error:", err);
    return NextResponse.json(
      { error: "获取求职记录失败" },
      { status: 500 }
    );
  }
}

// POST /api/jobs - 创建新记录
export async function POST(req: NextRequest) {
  try {
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

    if (!companyName || !companyType || !positionName || !workLocation || !applyDate) {
      return NextResponse.json(
        { error: "缺少必填字段（企业名称/性质/岗位/地点/投递时间）" },
        { status: 400 }
      );
    }

    const record = await db.jobRecord.create({
      data: {
        companyName: String(companyName).trim(),
        companyType: String(companyType).trim(),
        positionName: String(positionName).trim(),
        workLocation: String(workLocation).trim(),
        applyUrl: applyUrl ? String(applyUrl).trim() : null,
        applyDate: new Date(applyDate),
        status: (status as JobStatus) || "APPLIED",
        jobDescription: jobDescription ? String(jobDescription) : null,
        notes: notes ? String(notes) : null,
        isFavorite: Boolean(isFavorite),
        favoriteOrder: 0,
      },
    });

    return NextResponse.json({ data: record });
  } catch (err) {
    console.error("[POST /api/jobs] error:", err);
    return NextResponse.json(
      { error: "创建求职记录失败" },
      { status: 500 }
    );
  }
}
