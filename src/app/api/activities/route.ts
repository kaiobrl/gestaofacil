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
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const where: any = { tenantId };
  if (type) where.type = type;
  if (status === "pending") where.completed = false;
  if (status === "completed") where.completed = true;

  const activities = await prisma.activity.findMany({
    where,
    include: {
      contact: { select: { id: true, firstName: true, lastName: true } },
      deal: { select: { id: true, title: true } },
      user: { select: { id: true, name: true } },
    },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json({ activities });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = (session.user as any).tenantId;
  const userId = (session.user as any).id;
  const body = await req.json();

  const activity = await prisma.activity.create({
    data: {
      tenantId,
      type: body.type,
      title: body.title,
      description: body.description,
      dueDate: body.dueDate,
      contactId: body.contactId,
      dealId: body.dealId,
      userId,
    },
    include: {
      contact: { select: { id: true, firstName: true, lastName: true } },
      deal: { select: { id: true, title: true } },
    },
  });

  return NextResponse.json(activity, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...data } = body;

  if (data.completed) {
    data.completedAt = new Date();
  }

  const activity = await prisma.activity.update({
    where: { id },
    data,
  });

  return NextResponse.json(activity);
}
