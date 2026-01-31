import NextAuth from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  ...authOptions,
});