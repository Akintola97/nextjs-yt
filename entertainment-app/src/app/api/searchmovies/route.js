import axios from "axios";
import { NextResponse } from "next/server";
const key = process.env.API_KEY;

export async function POST(request) {
  try {
    const { movieSearch } = await request.json();
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${movieSearch}&include_adult=false`
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}