"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import CommentSection from "./CommentSection";
import Link from "next/link";

interface Comment {
  id: string;
  text: string;
  userName: string | null;
}

interface Movie {
  id: string;
  title: string;
  poster: string;
  review: string;
  recommendedByName: string;
  likes: { id: string }[];
  comments: Comment[];
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const { user } = useUser();
  const [likes, setLikes] = useState(movie.likes.length);

  async function toggleLike() {
    if (!user) {
      alert("Login to like movies");
      return;
    }

    const res = await fetch("/api/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieId: movie.id,
        userId: user.id,
      }),
    });

    const data = await res.json();

    setLikes((prev) => (data.liked ? prev + 1 : prev - 1));
  }

  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
        <Image
          src={movie.poster || "/no-poster.png"}
          alt={movie.title}
          width={300}
          height={400}
          className="w-full h-72 object-cover"
        />

        <div className="p-4">
          <h2 className="text-lg font-semibold">{movie.title}</h2>

          <p className="text-sm text-gray-500">
            Recommended by {movie.recommendedByName}
          </p>

          <p className="mt-2 text-sm">{movie.review}</p>

          <div className="flex gap-6 mt-3 text-sm items-center">
            <button onClick={toggleLike}>❤️ {likes}</button>

            <span>💬 {movie.comments.length}</span>
          </div>

          <CommentSection movieId={movie.id} comments={movie.comments} />
        </div>
      </div>
    </Link>
  );
}
