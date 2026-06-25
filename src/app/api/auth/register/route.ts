import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

    const { name, email, password, companyName } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    const tenantSlug = slugify(companyName);
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: "Já existe uma empresa com esse nome" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const transaction = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: companyName,
          slug: tenantSlug,
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "ADMIN",
          tenantId: tenant.id,
        },
      });

      await tx.pipeline.create({
        data: {
          tenantId: tenant.id,
          name: "Pipeline Padrão",
          isDefault: true,
          stages: {
            create: [
              { tenantId: tenant.id, name: "Lead", order: 0, color: "#3B82F6" },
              { tenantId: tenant.id, name: "Contato", order: 1, color: "#8B5CF6" },
              { tenantId: tenant.id, name: "Proposta", order: 2, color: "#F59E0B" },
              { tenantId: tenant.id, name: "Negociação", order: 3, color: "#F97316" },
              { tenantId: tenant.id, name: "Fechado", order: 4, color: "#10B981" },
              { tenantId: tenant.id, name: "Perdido", order: 5, color: "#EF4444" },
            ],
          },
        },
      });

      return { user, tenant };
    });

    return NextResponse.json(
      {
        message: "Conta criada com sucesso",
        user: { id: transaction.user.id, name: transaction.user.name, email: transaction.user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("DATABASE_URL")) {
      return NextResponse.json(
        { error: "DATABASE_URL não configurada" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
