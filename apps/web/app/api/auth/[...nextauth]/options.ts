import type { NextAuthOptions } from "next-auth";
import { } from "dotenv/config"
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import prisma, { Providers } from "@repo/db/prisma-client";
import * as z from "zod"
import { generateId } from "~/utils/generator";

const userSchema = z.object({
  email: z.string().min(1, "email required").email("enter a valid email"),
  password: z.string().min(1, "password required").max(10)
});

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "choose a username", type: "text" },
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) return null;
        const data = await userSchema.parseAsync(credentials);

        const user = await prisma.users.findFirst({
          where: { email: data?.email },
          select: { name: true, email: true, password: true, id: true, publicId: true, image: true }
        })
        if (!user) return null;

        const validPassword = await bcrypt.compare(credentials.password, user?.password!)
        if (!validPassword) return null;

        return {
          id: `${user.id}`,
          username: user.name,
          email: user.email,
          userId: user.publicId,
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;
      if (!user) return false;
      const User = await prisma.users.findFirst({
        where: {
          email: user.email!,
        }
      })
      if (User) return true;

      try {
        const provider = account?.provider.toUpperCase()! as Providers
        const publicID = generateId();
        await prisma.users.create({
          data: {
            email: user.email!,
            name: user.name!,
            provider: provider,
            publicId: publicID!,
            image: user.image!
          }
        })

      } catch (err) {
        return false;
      }
      return true;
    },
    async jwt({ token, user, account, profile }: any) {
      if (account && profile) {
        if (account.provider === "google" || "github") {
          const user = await prisma.users.findFirst({
            where: {
              email: profile.email
            }, select: {
              publicId: true,
              image: true
            }
          })
          token.username = profile.name
          token.email = profile.email
          token.userId = user?.publicId
          token.image = profile.image
        }
      }
      if (user && !profile) {
        token.sub = user.id;
        token.username = user.username;
        token.email = user.email;
        token.userId = user.userId;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.userId;
      session.user.name = token.username;
      session.user.email = token.email;
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/user/create",
    signOut: "/"
  },
  secret: process.env.NEXTAUTH_SECRET
}
