import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { updateCompanySchema } from "@/lib/validations/company";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const { id } = await params;

    const company = await prisma.company.findFirst({
      where: { id, tenantId: user.tenantId },
      include: {
        _count: { select: { deals: true, contacts: true } },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (e) {
    console.error("GET /api/companies/[id] error:", e);
    return NextResponse.json({ error: "Erro ao buscar empresa" }, { status: 500 });
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
    const result = updateCompanySchema.safeParse({ ...body, id });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.company.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...data } = result.data;

    const company = await prisma.company.update({
      where: { id },
      data,
      include: {
        _count: { select: { deals: true, contacts: true } },
      },
    });

    return NextResponse.json(company);
  } catch (e) {
    console.error("PATCH /api/companies/[id] error:", e);
    return NextResponse.json({ error: "Erro ao atualizar empresa" }, { status: 500 });
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

    const company = await prisma.company.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!company) {
      return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
    }

    await prisma.company.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/companies/[id] error:", e);
    return NextResponse.json({ error: "Erro ao excluir empresa" }, { status: 500 });
  }
}
