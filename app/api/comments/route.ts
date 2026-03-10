import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
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
  } catch (error) {
    console.error("Comment API error:", error);

    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
