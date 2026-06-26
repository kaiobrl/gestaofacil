import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { createCompanySchema } from "@/lib/validations/company";

export async function GET(req: Request) {
  try {
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
              { name: { contains: search, mode: "insensitive" as const } },
              { industry: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          _count: { select: { deals: true, contacts: true } },
        },
      }),
      prisma.company.count({ where }),
    ]);

    return NextResponse.json({
      companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    console.error("GET /api/companies error:", e);
    return NextResponse.json({ error: "Erro ao buscar empresas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user, error } = await requireSession();
    if (error) return error;

    const body = await req.json();
    const result = createCompanySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        tenantId: user.tenantId,
        ...result.data,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (e) {
    console.error("POST /api/companies error:", e);
    return NextResponse.json({ error: "Erro ao criar empresa" }, { status: 500 });
  }
}
