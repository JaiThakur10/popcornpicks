import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  await prisma.notification.updateMany({
    where: {
      read: false,
    },
    data: {
      read: true,
    },
  });

  return NextResponse.json({ success: true });
}
