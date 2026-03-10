import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const movies = await prisma.movie.findMany({
    include: {
      likes: true,
    },
  });

  const scores: Record<string, { name: string; likes: number }> = {};

  for (const movie of movies) {
    const userId = movie.recommendedBy;
    const userName = movie.recommendedByName;
    const likeCount = movie.likes.length;

    if (!scores[userId]) {
      scores[userId] = {
        name: userName,
        likes: 0,
      };
    }

    scores[userId].likes += likeCount;
  }

  const leaderboard = Object.values(scores)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 10);

  return NextResponse.json(leaderboard);
}
