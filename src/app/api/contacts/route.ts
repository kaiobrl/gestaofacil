import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { createContactSchema } from "@/lib/validations/contact";

export async function GET(req: Request) {
  const { user, error } = await requireSession();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where = {
    tenantId: user.tenantId,
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        company: { select: { id: true, name: true } },
      },
    }),
    prisma.contact.count({ where }),
  ]);

  return NextResponse.json({
    contacts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: Request) {
  const { user, error } = await requireSession();
  if (error) return error;

  const body = await req.json();
  const result = createContactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const contact = await prisma.contact.create({
    data: {
      tenantId: user.tenantId,
      ...result.data,
    },
    include: {
      company: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(contact, { status: 201 });
}
