import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Configure NextAuth options
export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  // Add additional NextAuth configuration here if needed
};

// Create a NextAuth handler
const handler = NextAuth(authOptions);

// Export GET and POST handlers required by Next.js App Router
export { handler as GET, handler as POST };
