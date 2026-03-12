"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { TbSend2 } from "react-icons/tb";
import { RiUserSmileLine } from "react-icons/ri";
import { HiOutlineChatBubbleLeftEllipsis } from "react-icons/hi2";

interface Comment {
  id: string;
  text: string;
  userName: string | null;
}

export default function CommentSection({ movieId }: { movieId: string }) {
  const { user } = useUser();

  const [text, setText] = useState("");
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);

  /* Fetch comments */
  useEffect(() => {
    async function fetchComments() {
      const res = await fetch(`/api/comments?movieId=${movieId}`);
      const data = await res.json();
      setCommentList(data);
      setLoading(false);
    }

    fetchComments();
  }, [movieId]);

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
    <div onClick={(e) => e.stopPropagation()}>
      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-white/10 to-transparent mb-3" />

      {/* Loading */}
      {loading && (
        <div className="text-[10px] text-white/20 italic mb-2">
          Loading reviews...
        </div>
      )}

      {/* Comment list */}
      {!loading && commentList.length > 0 && (
        <div className="flex flex-col gap-2 mb-3 max-h-[140px] overflow-y-auto">
          {commentList.map((c) => (
            <div key={c.id} className="flex gap-2 items-start">
              <div className="flex items-center justify-center w-[22px] h-[22px] rounded-full bg-amber-400/10 border border-amber-400/20 text-[9px] font-bold text-amber-300">
                {c.userName?.[0]?.toUpperCase() ?? <RiUserSmileLine />}
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-amber-300/70 mr-1">
                  {c.userName ?? "Anonymous"}
                </span>

                <span className="text-[11px] text-white/60 break-words">
                  {c.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && commentList.length === 0 && (
        <div className="flex items-center gap-2 mb-3">
          <HiOutlineChatBubbleLeftEllipsis className="text-white/10 text-sm" />
          <span className="text-[10px] text-white/20 italic">
            No reviews yet. Be the first.
          </span>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-2 py-1">
        <div className="flex items-center justify-center w-[22px] h-[22px] rounded-full text-[9px] font-bold border border-amber-400/20 bg-amber-400/10 text-amber-300">
          {user ? (
            (user.fullName?.[0] ?? user.firstName?.[0] ?? "?").toUpperCase()
          ) : (
            <RiUserSmileLine />
          )}
        </div>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder={user ? "Say something…" : "Sign in to comment"}
          disabled={!user}
          className="flex-1 bg-transparent outline-none text-[11px] text-white/70 placeholder:text-white/20"
        />

        <button
          onClick={addComment}
          disabled={!text.trim() || posting || !user}
          className={`flex items-center justify-center w-6 h-6 rounded transition
          ${
            text.trim() && user
              ? "bg-amber-400/20 text-amber-300"
              : "text-white/20"
          }`}
        >
          <TbSend2 />
        </button>
      </div>
    </div>
  );
}
