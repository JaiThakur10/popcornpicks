"use client";

import { useEffect, useState } from "react";

interface Leader {
  name: string;
  likes: number;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setLeaders(data);
    }

    load();
  }, []);

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">🏆 Top Recommenders</h2>

      <div className="space-y-2">
        {leaders.map((leader, index) => (
          <div key={index} className="flex justify-between border p-3 rounded">
            <span>
              {index + 1}. {leader.name}
            </span>

            <span>❤️ {leader.likes}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
