import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
// import Email from "next-auth/providers/email"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { verifyPassword } from "@/lib/auth-helpers"
import { isDevTierProfileEmail } from "@/lib/dev-profiles"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)

          const user = await prisma.users.findUnique({
            where: { email },
          })

          if (!user) {
            return null
          }

          // Dev-only: switch to tier profile users without a real password
          const devSecret = process.env.NEXT_PUBLIC_DEV_PROFILE_SECRET
          if (
            process.env.NODE_ENV === "development" &&
            devSecret &&
            password === devSecret &&
            isDevTierProfileEmail(user.email)
          ) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            }
          }

          // For OAuth users, password will be null
          if (!user.password) {
            return null
          }

          if (password.length < 8) {
            return null
          }

          // Verify password
          const isValid = await verifyPassword(password, user.password)
          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          return null
        }
      },
    }),
    // Email provider - requires SMTP configuration
    // Uncomment and configure when SMTP is set up
    // Email({
    //   server: {
    //     host: process.env.SMTP_HOST,
    //     port: Number(process.env.SMTP_PORT),
    //     auth: {
    //       user: process.env.SMTP_USER,
    //       pass: process.env.SMTP_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        const dbUser = await prisma.users.findUnique({
          where: { id: user.id },
          select: { plan: true },
        })
        token.plan = dbUser?.plan ?? "free"
        // Ensure user has at least one space (e.g. tier users from seed before space was added)
        const spaceCount = await prisma.spaces.count({
          where: { ownerId: user.id },
        })
        if (spaceCount === 0) {
          await prisma.spaces.create({
            data: {
              name: `${(user as { name?: string }).name || user.email || "User"}'s Workspace`,
              slug: `workspace-${user.id}`,
              ownerId: user.id,
            },
          })
        }
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.plan = (token.plan as string) ?? "free"
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      // Create a default space for new users
      if (user.email) {
        await prisma.spaces.create({
          data: {
            name: `${user.name || user.email}'s Workspace`,
            slug: `workspace-${user.id}`,
            ownerId: user.id,
          },
        })
      }
    },
  },
})

