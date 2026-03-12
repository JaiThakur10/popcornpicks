import { prisma } from "@/lib/prisma";
import { firebaseAdmin } from "@/lib/firebase-admin";

export async function sendPush(userId: string, title: string, body: string) {
  const tokens = await prisma.pushToken.findMany({
    where: { userId },
  });

  for (const t of tokens) {
    await firebaseAdmin.messaging().send({
      token: t.token,
      notification: { title, body },
    });
  }
}
