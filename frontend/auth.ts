import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authService } from "@/lib/services/authService";

/**
 * NextAuth configuration integrates credentials flow with Laravel API.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        nik: { label: "NIK", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Partial<Record<"nik" | "password", unknown>> | undefined) {
        if (!credentials?.nik || !credentials?.password) {
          return null;
        }

        try {
          return await authService.login({
            nik: String(credentials.nik),
            password: String(credentials.password),
          });
        } catch (error) {
          console.error("[NextAuth authorize] authService.login failed", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.nik = user.nik;
        token.role = user.role;
        token.roleSlug = user.roleSlug;
        token.rolePerangkatDaerahId = user.rolePerangkatDaerahId;
        token.rolePerangkatDaerahName = user.rolePerangkatDaerahName;
        token.token = user.token;
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.nik = token.nik;
      session.user.role = token.role;
      session.user.roleSlug = token.roleSlug;
      session.user.rolePerangkatDaerahId = token.rolePerangkatDaerahId;
      session.user.rolePerangkatDaerahName = token.rolePerangkatDaerahName;
      session.token = token.token;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
