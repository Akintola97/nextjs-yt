import bcrypt from "bcrypt";
import User from "@/models/User";
import dbConnect from "@/utils/mongodb";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

const secret = process.env.SECRET;

export async function POST(request) {
  await dbConnect();
  const { email, password } = await request.json();

  try {
    if (!email || !password) {
      return NextResponse.json({ message: "Please Provide Credentials!" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid Credentials!" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return NextResponse.json({message: "Invalid Credentials"})
    }
    const jwtSecret = new TextEncoder().encode(secret);
    const token = await new SignJWT({userId: user._id}).setProtectedHeader({alg:"HS256"}).setExpirationTime('1h').sign(jwtSecret);

    const response = NextResponse.json({message: "Login Successful!"})

    response.cookies.set({
        name: "authToken",
        value: token,
        path: '/',
        httpOnly: true,
        maxAge: 3600,
        secure: false
    });
    return response
  } catch (error) {
    console.log(error);
    return NextResponse.json({message: "Server Error"}, {status: 500})
  }
}
