import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const movie = await prisma.movie.create({
    data: {
      imdbId: body.imdbId,
      title: body.title,
      poster: body.poster,
      review: body.review,
      recommendedBy: body.userId,
      recommendedByName: body.userName,
      genres: [],
    },
  });

  return NextResponse.json(movie);
}
