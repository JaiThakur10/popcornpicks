"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import CommentSection from "@/components/CommentSection";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import { RiUserSmileLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";
import { PiFilmSlateDuotone } from "react-icons/pi";
import { useUser } from "@clerk/nextjs";
import { TbMessage2 } from "react-icons/tb";

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
  const { user } = useUser();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [likeAnim, setLikeAnim] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchMovie() {
      try {
        const res = await fetch(`/api/movie/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        setMovie(data);
        setLikes(data.likes.length);
        setTimeout(() => setLoaded(true), 80);
      } catch (err) {
        console.error("Movie fetch error:", err);
      }
    }
    fetchMovie();
  }, [id]);

  async function toggleLike() {
    if (!user) {
      alert("Login to like movies");
      return;
    }
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 350);
    const res = await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieId: movie!.id, userId: user.id }),
    });
    const data = await res.json();
    setLiked(data.liked);
    setLikes((p) => (data.liked ? p + 1 : p - 1));
  }

  /* ── Loading skeleton ── */
  if (!movie) {
    return (
      <main
        className="min-h-screen bg-[#07070e] text-white px-6 md:px-14 py-16"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-[340px_1fr] gap-10 animate-pulse">
          <div className="rounded-2xl bg-white/[0.05] h-[500px]" />
          <div className="flex flex-col gap-4 pt-4">
            <div className="h-3 w-24 rounded-full bg-white/[0.06]" />
            <div className="h-8 w-3/4 rounded-lg bg-white/[0.08]" />
            <div className="h-3 w-40 rounded-full bg-white/[0.05]" />
            <div className="mt-4 space-y-2">
              {[100, 90, 95, 70].map((w, i) => (
                <div
                  key={i}
                  className={`h-2.5 rounded-full bg-white/[0.05]`}
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main
        className="min-h-screen bg-[#07070e] text-white relative overflow-x-hidden"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Ambient glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute bottom-[-20%] left-[-8%] w-[80vw] h-[80vw] bg-[radial-gradient(ellipse_at_10%_90%,rgba(220,80,20,0.07)_0%,transparent_55%)]" />
          <div className="absolute top-[-15%] right-[-12%] w-[60vw] h-[60vw] bg-[radial-gradient(ellipse_at_85%_10%,rgba(80,100,180,0.05)_0%,transparent_60%)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-14 py-16">
          {/* Main grid */}
          <div
            className="grid md:grid-cols-[320px_1fr] gap-10 lg:gap-14"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "none" : "translateY(20px)",
              transition:
                "opacity 0.75s cubic-bezier(.22,1,.36,1), transform 0.75s cubic-bezier(.22,1,.36,1)",
            }}
          >
            {/* ── Poster ── */}
            <div className="relative flex-shrink-0">
              {/* Glow behind poster */}
              <div className="absolute -inset-3 rounded-3xl bg-amber-500/5 blur-2xl" />

              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
                <Image
                  src={movie.poster || "/no-poster.png"}
                  alt={movie.title}
                  width={400}
                  height={580}
                  className="w-full object-cover"
                  style={{ display: "block" }}
                />
                {/* Bottom scrim */}
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#07070e]/80 to-transparent" />
              </div>

              {/* Stats pills below poster */}
              <div className="flex items-center gap-3 mt-4 justify-center">
                <button
                  onClick={toggleLike}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200"
                  style={{
                    background: liked
                      ? "rgba(232,65,10,0.12)"
                      : "rgba(255,255,255,0.04)",
                    borderColor: liked
                      ? "rgba(232,65,10,0.35)"
                      : "rgba(255,255,255,0.08)",
                    color: liked
                      ? "rgba(232,65,10,0.9)"
                      : "rgba(240,230,211,0.4)",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      display: "inline-block",
                      transform: likeAnim ? "scale(1.5)" : "scale(1)",
                      transition: "transform 0.25s cubic-bezier(.22,1,.36,1)",
                    }}
                  >
                    {liked ? <AiFillHeart /> : <AiOutlineHeart />}
                  </span>
                  <span className="tabular-nums">{likes}</span>
                </button>

                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.04]"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "rgba(240,230,211,0.35)",
                  }}
                >
                  <TbMessage2 style={{ fontSize: "15px" }} />
                  <span className="tabular-nums">{movie.comments.length}</span>
                </div>
              </div>
            </div>

            {/* ── Info ── */}
            <div className="flex flex-col">
              {/* Eyebrow */}
              <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.24em] uppercase text-amber-400/60 bg-amber-400/8 border border-amber-400/15 px-3 py-1 rounded-sm self-start mb-4">
                <HiSparkles className="text-amber-400" />
                Community Pick
              </span>

              {/* Title */}
              <h1
                className="text-4xl md:text-5xl font-black leading-[1.0] tracking-tight text-[#f0e6d3] mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {movie.title}
              </h1>

              {/* Recommended by */}
              <div className="flex items-center gap-2 mb-6">
                <RiUserSmileLine className="text-amber-400/50 text-sm flex-shrink-0" />
                <p className="text-[12px] text-[rgba(240,230,211,0.38)]">
                  Picked by{" "}
                  <span className="text-amber-400/70 font-medium">
                    {movie.recommendedByName}
                  </span>
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-amber-400/15 via-white/[0.06] to-transparent mb-6" />

              {/* Review */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <PiFilmSlateDuotone className="text-amber-400/50 text-sm" />
                  <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-amber-400/45">
                    Review
                  </span>
                </div>

                <blockquote className="relative pl-4 text-[14px] leading-[1.85] font-light text-[rgba(240,230,211,0.58)]">
                  {/* Left quote bar */}
                  <div className="absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-amber-400/40 via-amber-400/20 to-transparent rounded-full" />
                  {movie.review}
                </blockquote>
              </div>
            </div>
          </div>

          {/* ── Comments ── */}
          <div
            className="mt-14"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "none" : "translateY(16px)",
              transition:
                "opacity 0.75s cubic-bezier(.22,1,.36,1) 0.2s, transform 0.75s cubic-bezier(.22,1,.36,1) 0.2s",
            }}
          >
            {/* Section label */}
            <div className="flex items-center gap-4 mb-5">
              <TbMessage2 className="text-amber-400/50 text-base" />
              <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-amber-400/50">
                Discussion
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-amber-400/15 to-transparent" />
            </div>

            {/* Comment card */}
            <div
              className="rounded-xl p-6 border border-white/[0.07]"
              style={{
                background:
                  "linear-gradient(140deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
                boxShadow:
                  "0 0 0 1px rgba(245,166,35,0.05) inset, 0 20px 48px rgba(0,0,0,0.4)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top sheen */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />
              <CommentSection movieId={movie.id} comments={movie.comments} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
