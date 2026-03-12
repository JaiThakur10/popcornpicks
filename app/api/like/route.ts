import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import { sendPush } from "@/lib/sendPush";
import { NotificationType } from "@prisma/client";

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

  const notification = await prisma.notification.create({
    data: {
      type: NotificationType.LIKE,
      message: `${body.userName || "Someone"} liked "${body.movieTitle}"`,
      movieId: body.movieId,
      actorId: body.userId,
    },
  });

  await pusher.trigger("notifications", "new-notification", notification);

  /* 🔔 mobile push */
  if (body.movieOwnerId && body.movieOwnerId !== body.userId) {
    await sendPush(
      body.movieOwnerId,
      "PopcornPicks",
      `${body.userName} liked "${body.movieTitle}"`,
    );
  }

  return NextResponse.json({ liked: true });
}
