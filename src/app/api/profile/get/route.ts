import { NextResponse } from "next/server";
import { getUserProfile } from "@/lib/actions/profile";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Missing userId" },
      { status: 400 }
    );
  }
  try {
    const profile = await getUserProfile(userId);
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error) },
      { status: 500 }
    );
  }
}
