// import User from "@/models/User";
// import  dbConnect  from "@/utils/mongodb";
// import { jwtVerify } from "jose";
// import { NextResponse } from "next/server";

// export async function getUserData(request) {
//   const secret = new TextEncoder().encode(process.env.SECRET);
//   const token = request.cookies.get("authToken")?.value || "";

//   try {
//     const { payload } = await jwtVerify(token, secret);
//     return payload.userId;
//   } catch (error) {
//     console.error("Error getting user data:", error);
//     return NextResponse.json({ message: "Error getting user data" });
//   }
// }

// export async function GET(request){
//     await dbConnect();
//     const userId = await getUserData(request);

//     try {
//         const user = await User.findById(userId).select('username');
//         return NextResponse.json(user, {message: "User Found"})
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({message: "Error Fetching User"})
//     }
// }




import User from "@/models/User";
import dbConnect from "@/utils/mongodb";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import mongoose from "mongoose"; // Ensure you import mongoose

export async function getUserData(request) {
  const secret = new TextEncoder().encode(process.env.SECRET);
  const token = request.cookies.get("authToken")?.value || "";

  if (!token) {
    return null; // No token found, user is not authenticated
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.userId;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null; // Invalid token, return null
  }
}

export async function GET(request) {
  await dbConnect();
  const userId = await getUserData(request);

  if (!userId) {
    return NextResponse.json({
      message: "User not authenticated",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({
      message: "Invalid user ID",
    });
  }

  try {
    const user = await User.findById(userId).select('username');
    if (!user) {
      return NextResponse.json({
        message: "User not found",
      });
    }

    return NextResponse.json({
      user,
      message: "User Found",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Error Fetching User",
    });
  }
}
