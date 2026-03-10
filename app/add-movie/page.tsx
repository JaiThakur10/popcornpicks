"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { PiPopcornFill, PiFilmSlateDuotone } from "react-icons/pi";
import { TbSearch, TbCheck } from "react-icons/tb";
import { HiSparkles } from "react-icons/hi2";
import { RiQuillPenLine } from "react-icons/ri";

interface Movie {
  imdbID: string;
  Poster: string;
  Title: string;
  Year: string;
}

export default function AddMoviePage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [added, setAdded] = useState<string | null>(null);

  // Review modal state
  const [pendingMovie, setPendingMovie] = useState<Movie | null>(null);
  const [review, setReview] = useState("");

  const { user } = useUser();

  async function searchMovies(value: string) {
    setQuery(value);
    if (value.length < 3) {
      setMovies([]);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/search?query=${value}`);
    const data = await res.json();
    setMovies(data || []);
    setLoading(false);
  }

  function openReviewModal(movie: Movie) {
    if (!user) {
      alert("Please sign in first");
      return;
    }
    setPendingMovie(movie);
    setReview("");
  }

  async function confirmAdd() {
    if (!pendingMovie || !review.trim()) return;

    const userName =
      user!.fullName ||
      `${user!.firstName ?? ""} ${user!.lastName ?? ""}`.trim() ||
      "Anonymous";

    setAdding(pendingMovie.imdbID);
    setPendingMovie(null);

    await fetch("/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imdbId: pendingMovie.imdbID,
        title: pendingMovie.Title,
        poster: pendingMovie.Poster === "N/A" ? null : pendingMovie.Poster,
        review,
        userId: user!.id,
        userName,
      }),
    });

    setAdded(pendingMovie.imdbID);
    setAdding(null);
    setReview("");
    setTimeout(() => {
      setAdded(null);
      setQuery("");
      setMovies([]);
    }, 1800);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
      `}</style>

      {/* Page */}
      <main
        className="min-h-screen bg-[#07070e] text-white px-6 md:px-14 py-16"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Ambient glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute bottom-[-20%] left-[-8%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(ellipse_at_10%_90%,rgba(220,80,20,0.07)_0%,transparent_55%)]" />
          <div className="absolute top-[-15%] right-[-12%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(ellipse_at_85%_10%,rgba(80,100,180,0.05)_0%,transparent_60%)]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.24em] uppercase text-amber-400/70 bg-amber-400/8 border border-amber-400/15 px-3 py-1 rounded-sm mb-4">
              <HiSparkles className="text-amber-400" />
              Curator Mode
            </span>
            <h1
              className="text-5xl md:text-6xl leading-[0.95] tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="block font-black text-[#f0e6d3]">Add a</span>
              <span
                className="block font-bold italic"
                style={{
                  background: "linear-gradient(100deg,#f5a623 0%,#e8410a 80%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Pick.
              </span>
            </h1>
            <p className="mt-3 text-sm text-[rgba(240,230,211,0.38)] font-light max-w-xs leading-relaxed">
              Search any film, write your honest take, and add it to the feed.
            </p>
          </div>

          {/* Search input */}
          <div className="relative mb-8 group">
            <TbSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/40 text-base pointer-events-none transition-colors group-focus-within:text-amber-400/70" />
            <input
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-[13px] text-[rgba(240,230,211,0.75)] placeholder:text-white/20 outline-none transition-all duration-200 focus:border-amber-400/30 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(245,166,35,0.06)]"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                caretColor: "#f5a623",
              }}
              placeholder="Search a movie title…"
              value={query}
              onChange={(e) => searchMovies(e.target.value)}
            />
            {/* Loading shimmer */}
            {loading && (
              <div className="absolute bottom-0 left-4 right-4 h-px overflow-hidden rounded-full">
                <div className="h-full w-1/3 bg-amber-400/50 animate-[shimmer_1s_ease-in-out_infinite]" />
              </div>
            )}
          </div>

          {/* Results grid */}
          {movies.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {movies.map((movie, i) => {
                const isAdding = adding === movie.imdbID;
                const isDone = added === movie.imdbID;

                return (
                  <div
                    key={movie.imdbID}
                    onClick={() =>
                      !isAdding && !isDone && openReviewModal(movie)
                    }
                    className="group/card relative flex flex-col rounded-xl overflow-hidden cursor-pointer border border-white/[0.07] bg-white/[0.03] hover:border-amber-400/20 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
                    style={{
                      transition:
                        "transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s ease, border-color 0.2s ease",
                      opacity: 0,
                      animation: `fadeUp 0.45s cubic-bezier(.22,1,.36,1) ${i * 55}ms forwards`,
                    }}
                  >
                    {/* Poster */}
                    <div className="relative h-52 overflow-hidden bg-white/[0.04]">
                      <Image
                        src={
                          movie.Poster !== "N/A"
                            ? movie.Poster
                            : "/no-poster.png"
                        }
                        alt={movie.Title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      />
                      {/* Scrim */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07070e]/90 via-[#07070e]/20 to-transparent" />

                      {/* Add overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                        {isDone ? (
                          <div className="flex flex-col items-center gap-1.5">
                            <TbCheck className="text-3xl text-amber-400" />
                            <span className="text-[10px] tracking-widest uppercase text-amber-400/80">
                              Added!
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1.5">
                            <PiFilmSlateDuotone className="text-3xl text-amber-400" />
                            <span className="text-[10px] tracking-widest uppercase text-amber-400/80">
                              {isAdding ? "Saving…" : "Pick this"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h2
                        className="text-[13px] font-semibold text-[rgba(240,230,211,0.88)] leading-snug line-clamp-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {movie.Title}
                      </h2>
                      <p className="text-[10px] text-amber-400/50 mt-1 font-medium tracking-wide">
                        {movie.Year}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty search hint */}
          {query.length > 0 && query.length < 3 && (
            <p className="text-center text-[11px] text-white/20 tracking-wide mt-8">
              Keep typing to search…
            </p>
          )}

          {/* No results */}
          {!loading && query.length >= 3 && movies.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-24 text-white/15">
              <PiPopcornFill className="text-5xl" />
              <p className="text-xs tracking-[0.2em] uppercase">
                No results found
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ── Review Modal ── */}
      {pendingMovie && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(7,7,14,0.88)",
            backdropFilter: "blur(12px)",
          }}
          onClick={(e) => e.target === e.currentTarget && setPendingMovie(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl overflow-hidden border border-white/[0.08]"
            style={{
              background:
                "linear-gradient(150deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,166,35,0.08) inset",
            }}
          >
            {/* Top sheen */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

            <div className="p-6">
              {/* Movie row */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-white/10">
                  <Image
                    src={
                      pendingMovie.Poster !== "N/A"
                        ? pendingMovie.Poster
                        : "/no-poster.png"
                    }
                    alt={pendingMovie.Title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3
                    className="text-base font-bold text-[#f0e6d3] leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {pendingMovie.Title}
                  </h3>
                  <p className="text-[11px] text-amber-400/50 mt-0.5">
                    {pendingMovie.Year}
                  </p>
                </div>
              </div>

              {/* Review label */}
              <div className="flex items-center gap-2 mb-2">
                <RiQuillPenLine className="text-amber-400/60 text-sm" />
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-400/55">
                  Your take
                </span>
              </div>

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="What made this film worth watching?"
                rows={4}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[12.5px] text-[rgba(240,230,211,0.7)] placeholder:text-white/20 outline-none resize-none focus:border-amber-400/25 focus:shadow-[0_0_0_3px_rgba(245,166,35,0.05)] transition-all"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  caretColor: "#f5a623",
                }}
                autoFocus
              />

              <p className="text-right text-[10px] text-white/20 mt-1 tabular-nums">
                {review.length} chars
              </p>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setPendingMovie(null)}
                  className="flex-1 py-2.5 rounded-xl text-[12px] font-medium text-white/35 bg-white/[0.04] border border-white/[0.07] hover:text-white/55 hover:bg-white/[0.07] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAdd}
                  disabled={!review.trim()}
                  className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-white border-none transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: review.trim()
                      ? "linear-gradient(110deg,#f5a623 0%,#e8410a 100%)"
                      : "rgba(255,255,255,0.08)",
                    boxShadow: review.trim()
                      ? "0 0 20px rgba(245,166,35,0.25)"
                      : "none",
                  }}
                >
                  Add to Picks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </>
  );
}
