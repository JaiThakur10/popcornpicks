"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { PiPopcornFill } from "react-icons/pi";
import { HiPlus } from "react-icons/hi2";
import { RiLoginCircleLine } from "react-icons/ri";
import NotificationBell from "@/components/NotificationBell";
import EnablePushNotifications from "@/components/EnablePushNotifications";

export default function Navbar() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,500&display=swap');

        .nav-add-btn:hover {
          background: rgba(245,166,35,0.15) !important;
          border-color: rgba(245,166,35,0.4) !important;
          color: rgba(245,166,35,0.95) !important;
        }
        .nav-signin-btn:hover {
          color: rgba(240,230,211,0.75) !important;
        }
        .nav-signup-btn:hover {
          background: rgba(232,65,10,0.85) !important;
          box-shadow: 0 0 18px rgba(232,65,10,0.3) !important;
        }
      `}</style>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          fontFamily: "'DM Sans', sans-serif",
          borderBottom: "1px solid rgba(245,166,35,0.1)",
          background: "rgba(7,7,14,0.82)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Thin amber top line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(to right, transparent 5%, rgba(245,166,35,0.35) 35%, rgba(245,166,35,0.2) 65%, transparent 95%)",
          }}
        />

        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 24px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* ── Logo ── */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <PiPopcornFill
              style={{
                fontSize: "20px",
                color: "#f5a623",
                filter: "drop-shadow(0 0 8px rgba(245,166,35,0.5))",
              }}
            />
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: "1.15rem",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              <span style={{ color: "#f0e6d3" }}>Popcorn</span>
              <span
                style={{
                  background:
                    "linear-gradient(100deg, #f5a623 0%, #e8410a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontStyle: "italic",
                }}
              >
                Picks
              </span>
            </span>
          </Link>

          {/* ── Right side ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Add Movie */}
            <Link href="/add-movie" style={{ textDecoration: "none" }}>
              <button
                className="nav-add-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(240,230,211,0.65)",
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition:
                    "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                }}
              >
                <HiPlus style={{ fontSize: "13px" }} />
                Add Movie
              </button>
            </Link>

            {/* Auth — signed out */}
            <Show when="signed-out">
              <SignInButton>
                <button
                  className="nav-signin-btn"
                  style={{
                    padding: "7px 12px",
                    border: "none",
                    background: "none",
                    color: "rgba(240,230,211,0.4)",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "0.02em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    transition: "color 0.2s ease",
                  }}
                >
                  <RiLoginCircleLine style={{ fontSize: "14px" }} />
                  Sign In
                </button>
              </SignInButton>

              {/* Divider dot */}
              <span
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  flexShrink: 0,
                }}
              />

              <SignUpButton>
                <button
                  className="nav-signup-btn"
                  style={{
                    padding: "7px 16px",
                    borderRadius: "8px",
                    border: "none",
                    background:
                      "linear-gradient(110deg, #f5a623 0%, #e8410a 100%)",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "0.03em",
                    boxShadow: "0 0 12px rgba(245,166,35,0.2)",
                    transition: "background 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  Join Free
                </button>
              </SignUpButton>
            </Show>

            {/* Auth — signed in */}
            <Show when="signed-in">
              <NotificationBell />
              <EnablePushNotifications />
              <div
                style={{
                  padding: "2px",
                  borderRadius: "50%",
                  border: "1px solid rgba(245,166,35,0.25)",
                  boxShadow: "0 0 10px rgba(245,166,35,0.1)",
                }}
              >
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: { width: "30px", height: "30px" },
                    },
                  }}
                />
              </div>
            </Show>
          </div>
        </div>
      </header>
    </>
  );
}
