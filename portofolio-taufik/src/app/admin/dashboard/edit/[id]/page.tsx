import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditProjectClient from "./EditProjectClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return <EditProjectClient project={project} />;
}
