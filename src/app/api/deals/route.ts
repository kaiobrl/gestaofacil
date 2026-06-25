import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = (session.user as any).tenantId;
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage");
  const status = searchParams.get("status") || "OPEN";

  const where: any = { tenantId, status };
  if (stage) where.stage = stage;

  const deals = await prisma.deal.findMany({
    where,
    include: {
      contact: { select: { id: true, firstName: true, lastName: true } },
      owner: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ deals });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = (session.user as any).tenantId;
  const userId = (session.user as any).id;
  const body = await req.json();

  const deal = await prisma.deal.create({
    data: {
      tenantId,
      title: body.title,
      value: body.value || 0,
      stage: body.stage || "lead",
      probability: body.probability || 0,
      expectedClose: body.expectedClose,
      contactId: body.contactId,
      companyId: body.companyId,
      ownerId: body.ownerId || userId,
      createdById: userId,
    },
    include: {
      contact: { select: { id: true, firstName: true, lastName: true } },
      owner: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(deal, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...data } = body;

  const deal = await prisma.deal.update({
    where: { id },
    data,
    include: {
      contact: { select: { id: true, firstName: true, lastName: true } },
      owner: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(deal);
}
