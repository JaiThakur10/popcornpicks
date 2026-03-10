"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface Movie {
  imdbID: string;
  Poster: string;
  Title: string;
  Year: string;
}

export default function AddMoviePage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const { user } = useUser();

  async function searchMovies(value: string) {
    setQuery(value);

    if (value.length < 3) {
      setMovies([]);
      return;
    }

    const res = await fetch(`/api/search?query=${value}`);
    const data = await res.json();

    setMovies(data || []);
  }

  async function saveMovie(movie: Movie) {
    if (!user) {
      alert("Please sign in first");
      return;
    }

    const review = prompt("Write a short review");
    if (!review) return;

    const userName =
      user.fullName ||
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
      "Anonymous";

    await fetch("/api/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imdbId: movie.imdbID,
        title: movie.Title,
        poster: movie.Poster === "N/A" ? null : movie.Poster,
        review,
        userId: user.id,
        userName: userName,
      }),
    });

    alert("Movie added!");

    setQuery("");
    setMovies([]);
  }

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🍿 Add Movie</h1>

      <input
        className="w-full border p-3 rounded"
        placeholder="Search movie..."
        value={query}
        onChange={(e) => searchMovies(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4 mt-6">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            onClick={() => saveMovie(movie)}
            className="border rounded p-3 cursor-pointer hover:shadow transition"
          >
            <Image
              src={movie.Poster !== "N/A" ? movie.Poster : "/no-poster.png"}
              alt={movie.Title}
              width={300}
              height={400}
              className="w-full h-60 object-cover rounded"
            />

            <h2 className="font-semibold mt-2">{movie.Title}</h2>
            <p className="text-sm text-gray-500">{movie.Year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
