import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { messages } = await request.json();
  const API_KEY = process.env.OPENAI_KEY;

  if (!API_KEY) {
    console.error("API key is not set in environment variables");
    return NextResponse.json(
      { message: "API key is not configured" },
      { status: 500 }
    );
  }
  try {
    const response = await axios.post(
      `https://api.openai.com/v1/chat/completions`,
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "This assistant is specialized in discussing movies, tv-shows and entertainment-related topics",
          },
          ...messages.map((msg) => ({
            role: msg.from === "user" ? "user" : "assistant",
            content: msg.message,
          })),
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const aiResponse = response.data.choices[0].message.content.trim();
    return NextResponse.json({ response: aiResponse }, { status: 200 });
  } catch (error) {
    console.error(
      "Error occurred:",
      error.response ? error.response.data : error.message
    );
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
