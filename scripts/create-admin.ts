import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@gestaofacil.com";
  const password = "admin123";
  const companyName = "Administração";

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log("Usuário já existe:", email);
    return;
  }

  const slug = companyName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: { name: companyName, slug },
    });

    const user = await tx.user.create({
      data: {
        name: "Administrador",
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

  console.log("Admin criado com sucesso!");
  console.log("Email:", email);
  console.log("Senha:", password);
  console.log("Tenant:", result.tenant.name, "(" + result.tenant.id + ")");
}

main()
  .catch((e) => {
    console.error("Erro:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
