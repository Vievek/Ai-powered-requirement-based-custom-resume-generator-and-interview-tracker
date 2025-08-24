import { NextResponse } from "next/server";
import { updateUserProfile } from "@/lib/actions/profile";

export async function POST(req: Request) {
  try {
    const { userId, data } = await req.json();
    const profile = await updateUserProfile(userId, data);
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    const errorMessage = typeof error === "object" && error !== null && "message" in error
      ? (error as { message: string }).message
      : String(error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
