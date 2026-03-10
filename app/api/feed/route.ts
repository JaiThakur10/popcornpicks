import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const movies = await prisma.movie.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      likes: true,
      ratings: true,
    },
  });

  return NextResponse.json(movies);
}
