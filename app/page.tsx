"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import Leaderboard from "@/components/Leaderboard";
import { PiPopcornFill, PiFilmSlateDuotone } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { TbDropletMinus, TbMovie } from "react-icons/tb";

interface Movie {
  id: string;
  title: string;
  poster: string;
  review: string;
  recommendedByName: string;
  recommendedById: string; // 👈 ADD THIS
  likes: { id: string; userId: string }[];
  _count: {
    comments: number;
  };
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchMovies() {
      const res = await fetch("/api/feed");
      const data = await res.json();
      setMovies(data);
      setTimeout(() => setLoaded(true), 100);
    }
    fetchMovies();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track { animation: ticker 32s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }

        @keyframes sweep {
          0%,100% { opacity: 0.03; transform: rotate(-10deg) translateX(-80px); }
          50%      { opacity: 0.07; transform: rotate(-10deg) translateX(80px); }
        }
        .spotlight-sweep { animation: sweep 11s ease-in-out infinite; }

        @keyframes flicker {
          0%,100% { opacity: 1; }
          92%      { opacity: 1; }
          93%      { opacity: 0.82; }
          95%      { opacity: 1; }
          97%      { opacity: 0.88; }
        }
        .flicker { animation: flicker 6s ease-in-out infinite; }
      `}</style>

      <main
        className="min-h-screen text-white relative overflow-x-hidden"
        style={{ background: "#07070e", fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── Atmosphere ── */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Projector cone — bottom-left */}
          <div
            className="absolute"
            style={{
              bottom: "-20%",
              left: "-8%",
              width: "110vw",
              height: "110vw",
              background:
                "radial-gradient(ellipse at 10% 90%, rgba(220,80,20,0.09) 0%, transparent 55%)",
            }}
          />
          {/* Cold screen glow — top right */}
          <div
            className="absolute"
            style={{
              top: "-15%",
              right: "-12%",
              width: "80vw",
              height: "80vw",
              background:
                "radial-gradient(ellipse at 85% 10%, rgba(80,100,180,0.06) 0%, transparent 60%)",
            }}
          />
          {/* Spotlight sweep */}
          <div
            className="spotlight-sweep absolute inset-0"
            style={{
              background:
                "linear-gradient(108deg, transparent 38%, rgba(245,166,35,0.11) 50%, transparent 62%)",
            }}
          />
          {/* Grain */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              opacity: 0.028,
            }}
          />
        </div>

        {/* ── Film-strip ticker ── */}
        <div
          className="relative z-10 overflow-hidden"
          style={{
            borderBottom: "1px solid rgba(245,166,35,0.1)",
            background: "rgba(245,166,35,0.025)",
          }}
        >
          <div className="ticker-track flex items-center gap-12 py-2 w-max select-none">
            {Array(16)
              .fill(null)
              .map((_, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2 whitespace-nowrap"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "rgba(245,166,35,0.38)",
                  }}
                >
                  <TbDropletMinus style={{ fontSize: "10px" }} />
                  {
                    [
                      "Community Picks",
                      "No Algorithms",
                      "Real Reviews",
                      "Curated Cinema",
                      "Human Taste",
                      "Watch Together",
                    ][i % 6]
                  }
                </span>
              ))}
          </div>
        </div>

        <div
          className="relative z-10 px-6 md:px-14 lg:px-24 pt-16 pb-24"
          style={{ maxWidth: "1400px", margin: "0 auto" }}
        >
          {/* ── HEADER ── */}
          <header
            style={{
              marginBottom: "5.5rem",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "none" : "translateY(22px)",
              transition:
                "opacity 0.85s cubic-bezier(.22,1,.36,1), transform 0.85s cubic-bezier(.22,1,.36,1)",
            }}
          >
            {/* Eyebrow badge */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm"
                style={{
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: "rgba(245,166,35,0.8)",
                  background: "rgba(245,166,35,0.07)",
                  border: "1px solid rgba(245,166,35,0.16)",
                }}
              >
                <HiSparkles style={{ color: "#f5a623" }} />
                Community Picks
              </span>
              <div
                className="h-px"
                style={{
                  width: "100px",
                  background:
                    "linear-gradient(to right, rgba(245,166,35,0.25), transparent)",
                }}
              />
            </div>

            {/* Ghost word behind headline */}
            <div className="relative">
              <span
                className="absolute select-none pointer-events-none leading-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 900,
                  fontSize: "clamp(5rem, 14vw, 13rem)",
                  top: "-0.1em",
                  left: "-0.02em",
                  color: "rgba(245,166,35,0.035)",
                  letterSpacing: "-0.02em",
                  zIndex: 0,
                }}
              >
                Cinema
              </span>

              <h1
                className="relative flicker"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(3rem, 8vw, 7rem)",
                  lineHeight: 0.92,
                  letterSpacing: "-0.025em",
                  zIndex: 1,
                }}
              >
                <span
                  className="block"
                  style={{ fontWeight: 900, color: "#f0e6d3" }}
                >
                  Popcorn
                </span>
                <span
                  className="block"
                  style={{
                    fontStyle: "italic",
                    fontWeight: 700,
                    background:
                      "linear-gradient(100deg, #f5a623 0%, #e8410a 75%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Picks.
                </span>
              </h1>
            </div>

            {/* Sub-row: description + live stats */}
            <div
              className="mt-7 flex items-end justify-between gap-6 flex-wrap"
              style={{ maxWidth: "860px" }}
            >
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "rgba(240,230,211,0.42)",
                  maxWidth: "360px",
                }}
              >
                Films chosen by people, not feeds.
                <br />
                Every pick has a real opinion attached.
              </p>

              {movies.length > 0 && (
                <div className="flex items-center gap-3">
                  {[
                    {
                      icon: <PiFilmSlateDuotone />,
                      value: movies.length,
                      label: "films",
                    },
                    {
                      icon: <HiSparkles />,
                      value: movies.reduce((s, m) => s + m.likes.length, 0),
                      label: "likes",
                    },
                    {
                      icon: <TbMovie />,
                      value: movies.reduce((s, m) => s + m._count.comments, 0),
                      label: "reviews",
                    },
                  ].map(({ icon, value, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{
                        fontSize: "11px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        color: "rgba(240,230,211,0.45)",
                      }}
                    >
                      <span style={{ color: "#f5a623", fontSize: "13px" }}>
                        {icon}
                      </span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#f0e6d3",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {value}
                      </span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* ── LEADERBOARD ── */}
          <section
            style={{
              marginBottom: "4.5rem",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "none" : "translateY(16px)",
              transition:
                "opacity 0.8s cubic-bezier(.22,1,.36,1) 0.18s, transform 0.8s cubic-bezier(.22,1,.36,1) 0.18s",
            }}
          >
            <SectionLabel icon={<HiSparkles />} text="Top Curators" />

            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(140deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow:
                  "0 0 0 1px rgba(245,166,35,0.06) inset, 0 32px 64px rgba(0,0,0,0.55)",
              }}
            >
              {/* top sheen */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent 5%, rgba(245,166,35,0.3) 40%, rgba(245,166,35,0.15) 60%, transparent 95%)",
                }}
              />
              <div className="p-6">
                <Leaderboard />
              </div>
            </div>
          </section>

          {/* ── MOVIES GRID ── */}
          <section
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "none" : "translateY(16px)",
              transition:
                "opacity 0.8s cubic-bezier(.22,1,.36,1) 0.32s, transform 0.8s cubic-bezier(.22,1,.36,1) 0.32s",
            }}
          >
            <SectionLabel icon={<TbMovie />} text="Latest Picks" />

            {movies.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-40 gap-4"
                style={{ color: "rgba(255,255,255,0.1)" }}
              >
                <PiPopcornFill
                  className="animate-pulse"
                  style={{ fontSize: "52px" }}
                />
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                  }}
                >
                  Loading the reel…
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                style={{
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
                }}
              >
                {movies.map((movie, i) => (
                  <div
                    key={movie.id}
                    style={{
                      opacity: loaded ? 1 : 0,
                      transform: loaded ? "none" : "translateY(18px)",
                      transition: `opacity 0.55s ease ${80 + i * 65}ms, transform 0.55s ease ${80 + i * 65}ms`,
                    }}
                  >
                    <MovieCard
                      movie={{
                        ...movie,
                        recommendedById: movie.recommendedById,
                        commentCount: movie._count.comments,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── FOOTER ── */}
          <footer
            className="mt-32 flex items-center justify-between"
            style={{
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.12)",
            }}
          >
            <span>PopcornPicks · community driven</span>
            <PiPopcornFill style={{ fontSize: "14px", opacity: 0.3 }} />
          </footer>
        </div>
      </main>
    </>
  );
}

/* ── Shared section label ── */
function SectionLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span style={{ color: "rgba(245,166,35,0.5)", fontSize: "14px" }}>
        {icon}
      </span>
      <span
        style={{
          fontSize: "9px",
          fontWeight: 600,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "rgba(245,166,35,0.5)",
        }}
      >
        {text}
      </span>
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to right, rgba(245,166,35,0.18), transparent)",
        }}
      />
    </div>
  );
}
