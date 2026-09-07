import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/my-nybf",
  },
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        // Two-Factor Authentication (OTP): Required for Admin and Coordinator accounts only
        const isStaff = user.role === "ADMIN" || user.role === "COORDINATOR" || user.role === "MODERATOR";
        if (isStaff) {
          const otpInput = credentials.otp?.trim();
          if (!otpInput) {
            return null;
          }

          const validOtp = await prisma.otpCode.findFirst({
            where: {
              email: user.email,
              code: otpInput,
              expiresAt: { gt: new Date() },
            },
          });

          // Allow dev/test fallback passcode when external mailers are unconfigured
          const isDevBypass = process.env.NODE_ENV !== "production" && otpInput === "123456";

          if (!validOtp && !isDevBypass) {
            return null;
          }

          if (validOtp) {
            await prisma.otpCode.deleteMany({
              where: { email: user.email },
            });
          }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          county: user.county,
          phone: user.phone,
          constituency: user.constituency,
          civicRole: user.civicRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.county = (user as any).county;
        token.phone = (user as any).phone;
        token.constituency = (user as any).constituency;
        token.civicRole = (user as any).civicRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).county = token.county;
        (session.user as any).phone = token.phone;
        (session.user as any).constituency = token.constituency;
        (session.user as any).civicRole = token.civicRole;
      }
      return session;
    },
  },
};
