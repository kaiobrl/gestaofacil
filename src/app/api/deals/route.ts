import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { createDealSchema, updateDealSchema } from "@/lib/validations/deal";

export async function GET(req: Request) {
  const { user, error } = await requireSession();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage");
  const status = searchParams.get("status") || "OPEN";

  const where: Record<string, unknown> = { tenantId: user.tenantId, status };
  if (stage) where.stage = stage;

  const deals = await prisma.deal.findMany({
    where,
    include: {
      contact: { select: { id: true, firstName: true, lastName: true } },
      company: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ deals });
}

export async function POST(req: Request) {
  const { user, error } = await requireSession();
  if (error) return error;

  const body = await req.json();
  const result = createDealSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const deal = await prisma.deal.create({
    data: {
      tenantId: user.tenantId,
      createdById: user.id,
      ownerId: user.id,
      ...result.data,
    },
    include: {
      contact: { select: { id: true, firstName: true, lastName: true } },
      company: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(deal, { status: 201 });
}

export async function PATCH(req: Request) {
  const { user, error } = await requireSession();
  if (error) return error;

  const body = await req.json();
  const result = updateDealSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { id, ...data } = result.data;

  const deal = await prisma.deal.findFirst({
    where: { id, tenantId: user.tenantId },
  });

  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  const updated = await prisma.deal.update({
    where: { id },
    data,
    include: {
      contact: { select: { id: true, firstName: true, lastName: true } },
      company: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(updated);
}
