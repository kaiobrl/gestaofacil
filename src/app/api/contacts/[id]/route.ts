import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { updateContactSchema } from "@/lib/validations/contact";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const { id } = await params;

    const contact = await prisma.contact.findFirst({
      where: { id, tenantId: user.tenantId },
      include: {
        company: { select: { id: true, name: true } },
      },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contato não encontrado" }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (e) {
    console.error("GET /api/contacts/[id] error:", e);
    return NextResponse.json({ error: "Erro ao buscar contato" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const { id } = await params;
    const body = await req.json();
    const result = updateContactSchema.safeParse({ ...body, id });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.contact.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Contato não encontrado" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...data } = result.data;

    const contact = await prisma.contact.update({
      where: { id },
      data,
      include: {
        company: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(contact);
  } catch (e) {
    console.error("PATCH /api/contacts/[id] error:", e);
    return NextResponse.json({ error: "Erro ao atualizar contato" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const { id } = await params;

    const contact = await prisma.contact.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contato não encontrado" }, { status: 404 });
    }

    await prisma.contact.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/contacts/[id] error:", e);
    return NextResponse.json({ error: "Erro ao excluir contato" }, { status: 500 });
  }
}
