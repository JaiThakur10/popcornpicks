import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import { sendPush } from "@/lib/sendPush";
import { NotificationType } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* GET comments */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");

  if (!movieId) {
    return NextResponse.json([]);
  }

  const comments = await prisma.comment.findMany({
    where: {
      movieId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      text: true,
      userName: true,
    },
  });

  return NextResponse.json(comments);
}

/* POST comment */
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

    const notification = await prisma.notification.create({
      data: {
        type: NotificationType.COMMENT,
        message: `${body.userName} commented on "${body.movieTitle}"`,
        movieId: body.movieId,
        actorId: body.userId,
      },
    });

    /* Realtime notification */
    await pusher.trigger("notifications", "new-notification", notification);

    /* 🔔 Mobile push notification */
    if (body.movieOwnerId) {
      await sendPush(
        body.movieOwnerId,
        "PopcornPicks",
        `${body.userName} commented on "${body.movieTitle}"`,
      );
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Comment API error:", error);

    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
