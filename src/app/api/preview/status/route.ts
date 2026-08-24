import { NextResponse } from "next/server";
import { isSiteLockEnabled } from "@/lib/site-lock";

export async function GET() {
  return NextResponse.json({
    locked: isSiteLockEnabled(),
  });
}
