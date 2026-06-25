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

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  tenantId: string;
  role: string;
  tenantSlug: string;
}
