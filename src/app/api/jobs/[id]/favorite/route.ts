import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/jobs/[id]/favorite - 切换优选状态
// body: { favorite: boolean }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const favorite = Boolean(body?.favorite);

    const existing = await db.jobRecord.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "记录不存在" }, { status: 404 });
    }

    // 设为优选时，order 设为当前最大值+1（排到优选区末尾）；取消时重置为 0
    let favoriteOrder = 0;
    if (favorite) {
      const max = await db.jobRecord.aggregate({
        where: { isFavorite: true, isTrashed: false },
        _max: { favoriteOrder: true },
      });
      favoriteOrder = (max._max.favoriteOrder ?? -1) + 1;
    }

    const updated = await db.jobRecord.update({
      where: { id },
      data: { isFavorite: favorite, favoriteOrder },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("[PATCH /api/jobs/[id]/favorite] error:", err);
    return NextResponse.json({ error: "切换优选状态失败" }, { status: 500 });
  }
}
