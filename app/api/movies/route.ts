import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import { NotificationType } from "@prisma/client";

export const dynamic = "force-dynamic";

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

  // 🔔 create notification
  const notification = await prisma.notification.create({
    data: {
      type: NotificationType.MOVIE,
      message: `${body.userName} recommended "${body.title}"`,
      movieId: movie.id,
      actorId: body.userId,
    },
  });

  // ⚡ send real-time event
  await pusher.trigger("notifications", "new-notification", notification);

  return NextResponse.json(movie);
}
