import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Is matcher se static files aur images exclude ho jati hain
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};