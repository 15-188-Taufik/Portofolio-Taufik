import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Ambil semua data settings (Public)
export async function GET() {
  try {
    const settingsList = await prisma.setting.findMany();
    const settingsMap = settingsList.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("Fetch Settings Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data pengaturan" }, { status: 500 });
  }
}

// POST: Buat atau update setting (Admin Only)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: "Key wajib diisi" }, { status: 400 });
    }

    const updatedSetting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json(updatedSetting);
  } catch (error) {
    console.error("Update Setting Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui pengaturan" }, { status: 500 });
  }
}
