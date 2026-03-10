import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();

  const comment = await prisma.comment.create({
    data: {
      text: body.text,
      movieId: body.movieId,
      userId: body.userId,
      userName: body.userName,
    },
  });

  return NextResponse.json(comment);
}
