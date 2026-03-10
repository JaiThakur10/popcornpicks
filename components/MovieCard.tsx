"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import CommentSection from "./CommentSection";
import Link from "next/link";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import { RiUserSmileLine } from "react-icons/ri";
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

export default function MovieCard({ movie }: { movie: Movie }) {
  const { user } = useUser();
  const [likes, setLikes] = useState(movie.likes.length);
  const [liked, setLiked] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);

  async function toggleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Login to like movies");
      return;
    }

    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 350);

    const res = await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieId: movie.id, userId: user.id }),
    });

    const data = await res.json();
    setLiked(data.liked);
    setLikes((prev) => (data.liked ? prev + 1 : prev - 1));
  }

  return (
    <div
      className="group relative flex flex-col overflow-hidden"
      style={{
        borderRadius: "14px",
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(245,166,35,0.04) inset",
        fontFamily: "'DM Sans', sans-serif",
        transition:
          "transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 20px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,166,35,0.1) inset";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(245,166,35,0.04) inset";
      }}
    >
      {/* ── TOP ZONE: clickable → movie page ── */}
      <Link href={`/movie/${movie.id}`} className="block">
        {/* Poster */}
        <div className="relative overflow-hidden" style={{ height: "280px" }}>
          <Image
            src={movie.poster || "/no-poster.png"}
            alt={movie.title}
            fill
            className="object-cover"
            style={{
              transition: "transform 0.5s cubic-bezier(.22,1,.36,1)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
            }
          />

          {/* Gradient scrim over poster bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(7,7,14,0.92) 0%, rgba(7,7,14,0.3) 50%, transparent 100%)",
            }}
          />

          {/* Title overlaid on poster */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: "1.15rem",
                lineHeight: 1.2,
                color: "#f0e6d3",
                letterSpacing: "-0.01em",
              }}
            >
              {movie.title}
            </h2>
          </div>

          {/* Top-right hover pill: "View details" */}
          <div
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100"
            style={{
              transition: "opacity 0.2s ease",
              background: "rgba(7,7,14,0.75)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(245,166,35,0.25)",
              borderRadius: "999px",
              padding: "3px 10px",
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(245,166,35,0.85)",
            }}
          >
            View
          </div>
        </div>

        {/* Recommended by — still inside the link */}
        <div
          className="flex items-center gap-2 px-4 pt-3 pb-2"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <RiUserSmileLine
            style={{
              color: "rgba(245,166,35,0.6)",
              fontSize: "13px",
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontSize: "11px",
              color: "rgba(240,230,211,0.38)",
              letterSpacing: "0.01em",
              fontWeight: 400,
            }}
          >
            Picked by{" "}
            <span style={{ color: "rgba(245,166,35,0.75)", fontWeight: 500 }}>
              {movie.recommendedByName}
            </span>
          </p>
        </div>
      </Link>

      {/* ── BOTTOM ZONE: NOT navigating — review, likes, comments ── */}
      <div
        className="flex flex-col gap-3 p-4"
        onClick={(e) => e.stopPropagation()}
        style={{ flex: 1 }}
      >
        {/* Review snippet */}
        <p
          style={{
            fontSize: "12.5px",
            lineHeight: 1.65,
            color: "rgba(240,230,211,0.5)",
            fontWeight: 300,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {movie.review}
        </p>

        {/* Like + comment row */}
        <div className="flex items-center gap-4 mt-1">
          {/* Like button */}
          <button
            onClick={toggleLike}
            className="flex items-center gap-1.5"
            style={{
              fontSize: "12px",
              color: liked ? "#e8410a" : "rgba(240,230,211,0.4)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "color 0.2s ease",
            }}
          >
            <span
              style={{
                fontSize: "15px",
                display: "inline-block",
                transform: likeAnim ? "scale(1.45)" : "scale(1)",
                transition: "transform 0.25s cubic-bezier(.22,1,.36,1)",
                color: liked ? "#e8410a" : "rgba(240,230,211,0.35)",
              }}
            >
              {liked ? <AiFillHeart /> : <AiOutlineHeart />}
            </span>
            <span
              style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500 }}
            >
              {likes}
            </span>
          </button>

          {/* Comment count */}
          <div
            className="flex items-center gap-1.5"
            style={{ fontSize: "12px", color: "rgba(240,230,211,0.35)" }}
          >
            <TbMessage2 style={{ fontSize: "15px" }} />
            <span
              style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500 }}
            >
              {movie.comments.length}
            </span>
          </div>

          {/* Thin amber accent line — right side */}
          <div
            className="ml-auto h-px"
            style={{
              width: "32px",
              background:
                "linear-gradient(to right, rgba(245,166,35,0.3), transparent)",
            }}
          />
        </div>

        {/* Comment section */}
        <div onClick={(e) => e.stopPropagation()} style={{ marginTop: "2px" }}>
          <CommentSection movieId={movie.id} comments={movie.comments} />
        </div>
      </div>
    </div>
  );
}
