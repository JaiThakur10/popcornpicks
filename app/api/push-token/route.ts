import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.token || !body.userId) {
      return NextResponse.json(
        { error: "Missing token or userId" },
        { status: 400 },
      );
    }

    const token = await prisma.pushToken.upsert({
      where: {
        token: body.token,
      },
      update: {
        userId: body.userId,
      },
      create: {
        token: body.token,
        userId: body.userId,
      },
    });

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("Push token error:", error);

    return NextResponse.json(
      { error: "Failed to save push token" },
      { status: 500 },
    );
  }
}
