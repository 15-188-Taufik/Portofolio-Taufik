import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // Pastikan secret dibaca
  pages: {
    signIn: "/portal-thn",
    error: '/portal-thn', // Jika error, kembalikan ke login saja jangan ke halaman error aneh
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Mencoba login dengan:", credentials?.username);

        if (!credentials?.username || !credentials?.password) {
          console.log("Username/Password kosong");
          return null;
        }

        // Cari user di database
        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username }
          });

          if (!user) {
            console.log("User tidak ditemukan di Database");
            return null;
          }

          console.log("User ditemukan:", user.username);

          // Cek password
          const isPasswordValid = await compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            console.log("Password Salah!");
            return null;
          }

          console.log("Login Berhasil!");
          return {
            id: user.id,
            name: user.username,
          };
        } catch (error) {
          console.error("Terjadi Error di Authorize:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    }
  }
};