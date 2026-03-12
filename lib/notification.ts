import { messaging, getToken } from "@/lib/firebase";

export async function requestNotificationPermission(userId: string) {
  if (!messaging) return;

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.log("Notification permission denied");
    return;
  }

  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  });

  console.log("FCM Token:", token);

  await fetch("/api/save-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      userId,
    }),
  });
}
