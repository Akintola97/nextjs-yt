import User from "@/models/User";
import  dbConnect  from "@/utils/mongodb";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function getUserData(request) {
  const secret = new TextEncoder().encode(process.env.SECRET);
  const token = request.cookies.get("authToken")?.value || "";

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.userId;
  } catch (error) {
    console.error("Error getting user data:", error);
    return NextResponse.json({ message: "Error getting user data" });
  }
}

export async function GET(request){
    await dbConnect();
    const userId = await getUserData(request);

    try {
        const user = await User.findById(userId).select('username');
        return NextResponse.json(user, {message: "User Found"})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: "Error Fetching User"})
    }
}
