// Local development only: clears the age pass and under-18 block so the age gate shows again.
import { NextResponse, type NextRequest } from "next/server";
import { AGE_COOKIE, BLOCK_COOKIE } from "@/lib/ageCookie";

export function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return new NextResponse("Not found", { status: 404 });
  const res = NextResponse.redirect(new URL("/bench", req.url));
  res.cookies.delete(AGE_COOKIE);
  res.cookies.delete(BLOCK_COOKIE);
  return res;
}
