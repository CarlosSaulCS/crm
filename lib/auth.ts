import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        // Try normal DB-backed auth first
        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user?.password) return null;
          const ok = await bcrypt.compare(password, user.password);
          if (!ok) return null;
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch {
          // Dev fallback when DB is not reachable so you can preview the app
          if (email === "admin@acme.com" && password === "admin123") {
            return { id: "dev-fallback-admin", email, name: "Admin (no DB)" };
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session.user && token.sub && session.user.email) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
