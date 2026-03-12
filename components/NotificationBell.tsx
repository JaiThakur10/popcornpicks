"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { IoNotificationsOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  message: string;
  movieId?: string;
  read: boolean;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // open notification → go to movie
  function openNotification(n: Notification) {
    if (n.movieId) {
      setOpen(false);
      router.push(`/movie/${n.movieId}`);
    }
  }

  useEffect(() => {
    async function loadNotifications() {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data);
    }

    loadNotifications();

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("notifications");
    const audio = new Audio("/sounds/notification.mp3");

    channel.bind("new-notification", (data: Notification) => {
      setNotifications((prev) => {
        // prevent duplicate notifications
        if (prev.find((n) => n.id === data.id)) return prev;

        return [data, ...prev];
      });

      audio.play().catch(() => {});
    });

    return () => {
      pusher.disconnect();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function toggleBell() {
    setOpen(!open);

    if (!open && unreadCount > 0) {
      await fetch("/api/notifications/read", {
        method: "POST",
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Bell */}
      <button
        onClick={toggleBell}
        style={{
          position: "relative",
          background: "none",
          border: "none",
          color: "rgba(240,230,211,0.75)",
          cursor: "pointer",
          fontSize: "20px",
        }}
      >
        <IoNotificationsOutline />

        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-6px",
              background: "#e8410a",
              borderRadius: "50%",
              fontSize: "10px",
              padding: "2px 6px",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "34px",
            width: "280px",
            background: "rgba(15,15,25,0.96)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "8px 0",
            backdropFilter: "blur(14px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.55)",
          }}
        >
          {notifications.length === 0 && (
            <p
              style={{
                fontSize: "12px",
                color: "rgba(240,230,211,0.45)",
                padding: "10px 14px",
              }}
            >
              No notifications
            </p>
          )}

          {notifications.map((n, i) => (
            <div
              key={n.id}
              onClick={() => openNotification(n)}
              style={{
                padding: "10px 14px",
                fontSize: "13px",
                color: "rgba(240,230,211,0.9)",
                background: n.read ? "transparent" : "rgba(245,166,35,0.08)",
                borderBottom:
                  i !== notifications.length - 1
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "none",
                cursor: n.movieId ? "pointer" : "default",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = n.read
                  ? "transparent"
                  : "rgba(245,166,35,0.08)";
              }}
            >
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
