"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

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

  async function addComment() {
    if (!user) {
      alert("Login to comment");
      return;
    }

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
  }

  return (
    <div className="mt-4">
      <div className="space-y-2">
        {commentList.map((c) => (
          <p key={c.id} className="text-sm">
            <b>{c.userName}:</b> {c.text}
          </p>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add comment..."
          className="border p-2 text-sm w-full rounded"
        />

        <button
          onClick={addComment}
          className="bg-black text-white px-3 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
}
