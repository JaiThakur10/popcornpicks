"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import CommentSection from "@/components/CommentSection";

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

export default function MoviePage() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchMovie() {
      try {
        const res = await fetch(`/api/movie/${id}`);

        if (!res.ok) {
          console.error("Failed to fetch movie");
          return;
        }

        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error("Movie fetch error:", err);
      }
    }

    fetchMovie();
  }, [id]);

  if (!movie) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-10">
      <div className="grid md:grid-cols-2 gap-6">
        <Image
          src={movie.poster || "/no-poster.png"}
          alt={movie.title}
          width={400}
          height={600}
          className="rounded"
        />

        <div>
          <h1 className="text-3xl font-bold">{movie.title}</h1>

          <p className="text-gray-500 mt-1">
            Recommended by {movie.recommendedByName}
          </p>

          <p className="mt-4">{movie.review}</p>

          <div className="mt-4 flex gap-6 text-sm">
            <span>❤️ {movie.likes.length}</span>
            <span>💬 {movie.comments.length}</span>
          </div>
        </div>
      </div>

      <CommentSection movieId={movie.id} comments={movie.comments} />
    </div>
  );
}
