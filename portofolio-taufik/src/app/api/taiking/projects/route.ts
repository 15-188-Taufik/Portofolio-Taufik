import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

async function isAuthenticated() {
  const session = await getServerSession(authOptions);
  return !!session;
}

// GET: Ambil semua data (Public)
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

// POST: Tambah data (Admin Only)
export async function POST(req: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const newProject = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        images: body.images,
        liveDemoUrl: body.liveDemoUrl,
        techStack: body.techStack,
        // TAMBAHAN BARU
        githubUrl: body.githubUrl,
        features: body.features 
      }
    });
    return NextResponse.json(newProject);
  } catch (error) {
    console.error("Create Error:", error);
    return NextResponse.json({ error: "Error creating data" }, { status: 500 });
  }
}