import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { runSecurityScan, scanToMarkdown } from "@/lib/security/scan";

export async function GET(request: NextRequest) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;
  const scan = runSecurityScan();
  const body = scanToMarkdown(scan);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="moodilier-security-${scan.generatedAt.slice(0, 10)}.md"`,
    },
  });
}
