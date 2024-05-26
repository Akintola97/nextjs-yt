import axios from "axios";
import { NextResponse } from "next/server";
const key = process.env.API_KEY;

export async function POST(request) {
  try {
    const { tvSearch } = await request.json();
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/tv?api_key=${key}&language=en-US&query=${tvSearch}&include_adult=false`
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}