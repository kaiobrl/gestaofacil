import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tenantId: string;
      role: string;
      tenantSlug: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantId: string;
    role: string;
    tenantSlug: string;
  }
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  tenantId: string;
  role: string;
  tenantSlug: string;
}
