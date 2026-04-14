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
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          return await authService.login({
            email: String(credentials.email),
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
        token.role = user.role;
        token.token = user.token;
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.token = token.token;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
