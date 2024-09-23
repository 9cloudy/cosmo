import type { NextAuthOptions } from "next-auth";
import { } from "dotenv/config"
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import prisma from "@repo/db/prisma-client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials,req) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await prisma.users.findFirst({
          where: { email: credentials?.email },
          select: { name: true, email: true, password: true, id: true }
        })
        if (!user) {
          return null
        }
        const validPassword = await bcrypt.compare(credentials.password, user?.password)
        if (!validPassword) {
          return null
        }
        return {
          id: `${user.id}`,
          username: user.name,
          email: user.email
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    }),
  ],
  session: {
    strategy: "jwt"
  },

  secret: process.env.NEXTAUTH_SECRET
}
