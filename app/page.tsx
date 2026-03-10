"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import Leaderboard from "@/components/Leaderboard";

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

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function fetchMovies() {
      const res = await fetch("/api/feed");
      const data = await res.json();
      setMovies(data);
    }

    fetchMovies();
  }, []);

  return (
    <main className="p-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">🍿 PopcornPicks</h1>
      <Leaderboard />
      <div className="grid md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
