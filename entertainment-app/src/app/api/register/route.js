import bcrypt from "bcrypt";
import User from "@/models/User";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  const { email, password, username } = await request.json();

  try {
    if (!email || !password || !username) {
      return NextResponse.json({ message: "Please Provide Credentials!" });
    }

    // Basic email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        {
          message: "Invalid Email Format",
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists, please login" },
        { status: 400 }
      );
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashPassword, username });
    await newUser.save();
    return NextResponse.json({ message: "Profile Created" }, { status: 200 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
