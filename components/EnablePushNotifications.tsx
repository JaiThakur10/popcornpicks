"use client";

import { useEffect } from "react";
import { messaging, getToken } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";

export default function EnablePushNotifications() {
  const { user } = useUser();

  useEffect(() => {
    async function requestPermission() {
      const permission = await Notification.requestPermission();

      if (permission === "granted" && messaging && user) {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (!token) return;

        await fetch("/api/push-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            userId: user.id,
          }),
        });
      }
    }

    requestPermission();
  }, [user]);

  return null;
}
