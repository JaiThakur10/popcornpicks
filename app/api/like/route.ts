import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();

  const existing = await prisma.like.findUnique({
    where: {
      movieId_userId: {
        movieId: body.movieId,
        userId: body.userId,
      },
    },
  });

  if (existing) {
    await prisma.like.delete({
      where: {
        id: existing.id,
      },
    });

    return NextResponse.json({ liked: false });
  }

  await prisma.like.create({
    data: {
      movieId: body.movieId,
      userId: body.userId,
    },
  });

  return NextResponse.json({ liked: true });
}
