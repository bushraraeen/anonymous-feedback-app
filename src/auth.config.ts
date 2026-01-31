import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], 
  // YE LINE ADD KAREIN
  secret: process.env.NEXTAUTH_SECRET, 
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isDashboard) {
        if (isLoggedIn) return true;
        return false; 
      }
      return true;
    },
  },
} satisfies NextAuthConfig;