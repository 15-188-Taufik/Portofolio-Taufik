import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

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
        console.log("[Auth-API] Memulai authorize callback untuk user:", credentials?.username);

        if (!credentials?.username || !credentials?.password) {
          console.warn("[Auth-API] Login dibatalkan: username atau password kosong.");
          return null;
        }

        try {
          console.log("[Auth-API] Mengambil data user dari database...");
          const user = await prisma.user.findUnique({
            where: { username: credentials.username }
          });

          if (!user) {
            console.warn("[Auth-API] Login gagal: User tidak ditemukan di database.");
            return null;
          }

          console.log("[Auth-API] User ditemukan, mencocokkan password...");
          
          // Menggunakan bcryptjs pure JS untuk verifikasi password aman di serverless
          const isPasswordValid = await compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            console.warn("[Auth-API] Login gagal: Password salah untuk user:", credentials.username);
            return null;
          }

          console.log("[Auth-API] Login berhasil untuk user:", user.username);
          return {
            id: user.id,
            name: user.username,
          };
        } catch (error) {
          console.error("[Auth-API] ERROR Kritis di authorize():", error);
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