import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { createContactSchema } from "@/lib/validations/contact";

export async function GET(req: Request) {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
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
  } catch (e) {
    console.error("GET /api/contacts error:", e);
    return NextResponse.json({ error: "Erro ao buscar contatos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
  } catch (e) {
    console.error("POST /api/contacts error:", e);
    return NextResponse.json({ error: "Erro ao criar contato" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const contact = await prisma.contact.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contato não encontrado" }, { status: 404 });
    }

    await prisma.contact.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/contacts error:", e);
    return NextResponse.json({ error: "Erro ao excluir contato" }, { status: 500 });
  }
}
