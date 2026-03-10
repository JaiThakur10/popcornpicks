"use client";

import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { RiMedalLine } from "react-icons/ri";
import { HiMiniTrophy } from "react-icons/hi2";
import { TbFlame } from "react-icons/tb";

interface Leader {
  name: string;
  likes: number;
}

const RANK_CONFIG = [
  {
    icon: <HiMiniTrophy />,
    color: "#f5a623",
    glow: "rgba(245,166,35,0.18)",
    bar: "rgba(245,166,35,0.55)",
    label: "rgba(245,166,35,0.9)",
  },
  {
    icon: <RiMedalLine />,
    color: "#b0bec5",
    glow: "rgba(176,190,197,0.1)",
    bar: "rgba(176,190,197,0.4)",
    label: "rgba(176,190,197,0.75)",
  },
  {
    icon: <TbFlame />,
    color: "#e8410a",
    glow: "rgba(232,65,10,0.12)",
    bar: "rgba(232,65,10,0.45)",
    label: "rgba(232,65,10,0.8)",
  },
];

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setLeaders(data);
      setTimeout(() => setLoaded(true), 80);
    }
    load();
  }, []);

  const maxLikes = leaders[0]?.likes || 1;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <HiMiniTrophy style={{ color: "#f5a623", fontSize: "16px" }} />
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#f0e6d3",
              letterSpacing: "-0.01em",
            }}
          >
            Top Recommenders
          </span>
        </div>
        {leaders.length > 0 && (
          <span
            style={{
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(245,166,35,0.45)",
            }}
          >
            {leaders.length} curators
          </span>
        )}
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2">
        {leaders.length === 0
          ? Array(3)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: "52px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    animation: "pulse 1.8s ease-in-out infinite",
                    animationDelay: `${i * 180}ms`,
                  }}
                />
              ))
          : leaders.map((leader, i) => {
              const cfg = RANK_CONFIG[i] ?? {
                icon: null,
                color: "rgba(240,230,211,0.3)",
                glow: "transparent",
                bar: "rgba(240,230,211,0.15)",
                label: "rgba(240,230,211,0.35)",
              };
              const pct = Math.round((leader.likes / maxLikes) * 100);
              const isTop3 = i < 3;

              return (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    borderRadius: "10px",
                    border: isTop3
                      ? `1px solid ${cfg.glow}`
                      : "1px solid rgba(255,255,255,0.05)",
                    background: isTop3
                      ? `linear-gradient(100deg, ${cfg.glow} 0%, rgba(255,255,255,0.02) 100%)`
                      : "rgba(255,255,255,0.02)",
                    overflow: "hidden",
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "none" : "translateX(-10px)",
                    transition: `opacity 0.5s ease ${i * 70}ms, transform 0.5s cubic-bezier(.22,1,.36,1) ${i * 70}ms`,
                  }}
                >
                  {/* Bar fill */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: `${pct}%`,
                      background: `linear-gradient(to right, ${cfg.bar.replace(")", ", 0.18)").replace("rgba", "rgba")}, transparent)`,
                      transition: "width 0.9s cubic-bezier(.22,1,.36,1)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Content */}
                  <div
                    className="relative flex items-center gap-3 px-4 py-3"
                    style={{ zIndex: 1 }}
                  >
                    {/* Rank number */}
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                        color: cfg.label,
                        minWidth: "16px",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {i + 1}
                    </span>

                    {/* Icon for top 3 */}
                    {isTop3 && (
                      <span
                        style={{
                          fontSize: "14px",
                          color: cfg.color,
                          filter: `drop-shadow(0 0 6px ${cfg.glow})`,
                          lineHeight: 1,
                        }}
                      >
                        {cfg.icon}
                      </span>
                    )}

                    {/* Name */}
                    <span
                      style={{
                        flex: 1,
                        fontSize: "13px",
                        fontWeight: isTop3 ? 500 : 400,
                        color: isTop3
                          ? "rgba(240,230,211,0.88)"
                          : "rgba(240,230,211,0.5)",
                        letterSpacing: "0.01em",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {leader.name}
                    </span>

                    {/* Likes */}
                    <div
                      className="flex items-center gap-1.5"
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: cfg.label,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      <AiFillHeart
                        style={{
                          fontSize: "11px",
                          opacity: isTop3 ? 0.9 : 0.4,
                        }}
                      />
                      {leader.likes}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
