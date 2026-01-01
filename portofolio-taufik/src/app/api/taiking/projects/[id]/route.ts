import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// PUT: Update Data
export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = await props.params;

  try {
    const body = await req.json();
    
    const updated = await prisma.project.update({
      where: { id: params.id },
      data: { 
        title: body.title,
        description: body.description,
        techStack: body.techStack,
        liveDemoUrl: body.liveDemoUrl,
        images: body.images,
        // TAMBAHAN BARU
        githubUrl: body.githubUrl,
        features: body.features
      }
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Error updating" }, { status: 500 });
  }
}

// DELETE: Hapus Data
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = await props.params;

  try {
    await prisma.project.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Error deleting" }, { status: 500 });
  }
}