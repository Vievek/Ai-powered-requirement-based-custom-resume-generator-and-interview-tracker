import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // LinkedIn provider will be added later when credentials are available
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
        // Add profile completion status
        const userProfile = await prisma.user.findUnique({
          where: { id: user.id },
          select: { profileCompleted: true, careerGoal: true },
        });
        session.user.profileCompleted = userProfile?.profileCompleted ?? false;
        session.user.careerGoal = userProfile?.careerGoal;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Check if user has completed profile
      if (url === baseUrl) {
        return `${baseUrl}/dashboard`;
      }
      // Allow redirects to same origin
      if (url.startsWith(baseUrl)) return url;
      // Allow relative redirects
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
  },
  debug: process.env.NODE_ENV === "development",
};
