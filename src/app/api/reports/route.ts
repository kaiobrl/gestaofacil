import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export async function GET() {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const tenantId = user.tenantId;

    const [dealsByStage, dealsByStatus, totalDeals, totalValue, activitiesByType] = await Promise.all([
      prisma.deal.groupBy({
        by: ["stage"],
        where: { tenantId },
        _count: true,
        _sum: { value: true },
      }),
      prisma.deal.groupBy({
        by: ["status"],
        where: { tenantId },
        _count: true,
      }),
      prisma.deal.count({ where: { tenantId } }),
      prisma.deal.aggregate({ where: { tenantId }, _sum: { value: true } }),
      prisma.activity.groupBy({
        by: ["type"],
        where: { tenantId },
        _count: true,
      }),
    ]);

    const wonDeals = dealsByStatus.find((d) => d.status === "WON")?._count || 0;
    const conversionRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;

    const stageData = dealsByStage.map((s) => ({
      stage: s.stage,
      count: s._count,
      value: s._sum.value || 0,
    }));

    const activityData = activitiesByType.map((a) => ({
      type: a.type,
      count: a._count,
    }));

    return NextResponse.json({
      summary: {
        totalDeals,
        totalValue: totalValue._sum.value || 0,
        conversionRate,
        totalContacts: await prisma.contact.count({ where: { tenantId } }),
        totalCompanies: await prisma.company.count({ where: { tenantId } }),
        totalActivities: await prisma.activity.count({ where: { tenantId } }),
      },
      dealsByStage: stageData,
      activitiesByType: activityData,
    });
  } catch (e) {
    console.error("GET /api/reports error:", e);
    return NextResponse.json({ error: "Erro ao buscar relatórios" }, { status: 500 });
  }
}
