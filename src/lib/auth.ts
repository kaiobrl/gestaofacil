import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import type { SessionUser } from "./types";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { tenant: true },
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar,
            tenantId: user.tenantId,
            role: user.role,
            tenantSlug: user.tenant.slug,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = (user as SessionUser).tenantId;
        token.role = (user as SessionUser).role;
        token.tenantSlug = (user as SessionUser).tenantSlug;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as SessionUser).id = token.sub!;
        (session.user as SessionUser).tenantId = token.tenantId;
        (session.user as SessionUser).role = token.role;
        (session.user as SessionUser).tenantSlug = token.tenantSlug;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
