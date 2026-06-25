import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, companyName } = body;

    if (!name || !email || !password || !companyName) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

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

    const result = await prisma.$transaction(async (tx) => {
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
        user: { id: result.user.id, name: result.user.name, email: result.user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
