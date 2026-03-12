import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const movies = await prisma.movie.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 24, // limit movies for faster load
    select: {
      id: true,
      title: true,
      poster: true,
      review: true,
      recommendedByName: true,

      likes: {
        select: {
          id: true,
          userId: true,
        },
      },

      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return NextResponse.json(movies);
}
