"use client";

import { useEffect } from "react";
import { messaging, getToken } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";

export default function EnablePushNotifications() {
  const { user } = useUser();

  useEffect(() => {
    async function requestPermission() {
      try {
        if (!user || !messaging) return;

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          console.log("Notification permission denied");
          return;
        }

        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (!token) {
          console.log("No FCM token generated");
          return;
        }

        console.log("FCM Token:", token);

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
      } catch (error) {
        console.error("Push notification error:", error);
      }
    }

    requestPermission();
  }, [user]);

  return null;
}
