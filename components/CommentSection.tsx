"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { TbSend2 } from "react-icons/tb";
import { RiUserSmileLine } from "react-icons/ri";
import { HiOutlineChatBubbleLeftEllipsis } from "react-icons/hi2";

interface Comment {
  id: string;
  text: string;
  userName: string | null;
}

export default function CommentSection({
  movieId,
  comments,
}: {
  movieId: string;
  comments: Comment[];
}) {
  const { user } = useUser();
  const [text, setText] = useState("");
  const [commentList, setCommentList] = useState(comments);
  const [posting, setPosting] = useState(false);

  async function addComment() {
    if (!user) {
      alert("Login to comment");
      return;
    }
    if (!text.trim()) return;

    setPosting(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        movieId,
        userId: user.id,
        userName: user.fullName || user.firstName,
      }),
    });

    const newComment = await res.json();
    setCommentList((prev) => [...prev, newComment]);
    setText("");
    setPosting(false);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addComment();
    }
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Divider */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, rgba(255,255,255,0.07), transparent)",
          marginBottom: "12px",
        }}
      />

      {/* Comment list */}
      {commentList.length > 0 && (
        <div
          className="flex flex-col gap-2"
          style={{
            marginBottom: "12px",
            maxHeight: "140px",
            overflowY: "auto",
          }}
        >
          {commentList.map((c, i) => (
            <div
              key={c.id}
              className="flex gap-2 items-start"
              style={{
                animation: `fadeSlideIn 0.3s ease ${i === commentList.length - 1 ? "0ms" : "0ms"} both`,
              }}
            >
              {/* Avatar initial */}
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-full"
                style={{
                  width: "22px",
                  height: "22px",
                  background: "rgba(245,166,35,0.12)",
                  border: "1px solid rgba(245,166,35,0.2)",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "rgba(245,166,35,0.8)",
                  marginTop: "1px",
                }}
              >
                {c.userName?.[0]?.toUpperCase() ?? <RiUserSmileLine />}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "rgba(245,166,35,0.7)",
                    letterSpacing: "0.01em",
                    marginRight: "6px",
                  }}
                >
                  {c.userName ?? "Anonymous"}
                </span>
                <span
                  style={{
                    fontSize: "11.5px",
                    color: "rgba(240,230,211,0.5)",
                    lineHeight: 1.5,
                    fontWeight: 300,
                    wordBreak: "break-word",
                  }}
                >
                  {c.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {commentList.length === 0 && (
        <div
          className="flex items-center gap-2"
          style={{ marginBottom: "10px" }}
        >
          <HiOutlineChatBubbleLeftEllipsis
            style={{ color: "rgba(255,255,255,0.1)", fontSize: "13px" }}
          />
          <span
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.18)",
              letterSpacing: "0.06em",
              fontStyle: "italic",
            }}
          >
            No reviews yet. Be the first.
          </span>
        </div>
      )}

      {/* Input row */}
      <div
        className="flex items-center gap-2"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px",
          padding: "6px 8px",
          transition: "border-color 0.2s ease",
        }}
        onFocusCapture={(e) =>
          (e.currentTarget.style.borderColor = "rgba(245,166,35,0.3)")
        }
        onBlurCapture={(e) =>
          (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
        }
      >
        {/* User initial or icon */}
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full"
          style={{
            width: "22px",
            height: "22px",
            background: user
              ? "rgba(245,166,35,0.1)"
              : "rgba(255,255,255,0.04)",
            border: `1px solid ${user ? "rgba(245,166,35,0.2)" : "rgba(255,255,255,0.07)"}`,
            fontSize: "9px",
            fontWeight: 700,
            color: user ? "rgba(245,166,35,0.7)" : "rgba(255,255,255,0.2)",
          }}
        >
          {user ? (
            (user.fullName?.[0] ?? user.firstName?.[0] ?? "?").toUpperCase()
          ) : (
            <RiUserSmileLine style={{ fontSize: "11px" }} />
          )}
        </div>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder={user ? "Say something…" : "Sign in to comment"}
          disabled={!user}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "11.5px",
            color: "rgba(240,230,211,0.65)",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            letterSpacing: "0.01em",
            caretColor: "#f5a623",
          }}
        />

        <button
          onClick={addComment}
          disabled={!text.trim() || posting || !user}
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "26px",
            height: "26px",
            borderRadius: "6px",
            border: "none",
            background:
              text.trim() && !posting && user
                ? "rgba(245,166,35,0.18)"
                : "transparent",
            color:
              text.trim() && !posting && user
                ? "rgba(245,166,35,0.9)"
                : "rgba(255,255,255,0.15)",
            cursor: text.trim() && !posting && user ? "pointer" : "default",
            transition:
              "background 0.2s ease, color 0.2s ease, transform 0.15s ease",
            transform: posting ? "scale(0.88)" : "scale(1)",
            fontSize: "14px",
          }}
        >
          <TbSend2 />
        </button>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
