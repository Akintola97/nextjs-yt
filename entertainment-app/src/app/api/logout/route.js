import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logout Successful!" });

  response.cookies.delete("authToken", {
    path: "/",
    httpOnly: true,
    secure: false,
  });

  return response;
}
