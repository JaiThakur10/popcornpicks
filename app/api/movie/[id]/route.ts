import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        likes: true,
        comments: true,
        ratings: true,
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch movie" },
      { status: 500 },
    );
  }
}
