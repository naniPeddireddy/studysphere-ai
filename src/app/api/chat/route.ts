
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const message = body.message;
    const history = body.history ?? [];

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 4000
    ) {
      return NextResponse.json(
        { error: "Please enter a valid question." },
        { status: 400 }
      );
    }

    if (!Array.isArray(history) || history.length > 20) {
      return NextResponse.json(
        { error: "Invalid conversation history." },
        { status: 400 }
      );
    }

    const validHistory = history.every(
      (item) =>
        item &&
        ["user", "assistant"].includes(item.role) &&
        typeof item.text === "string" &&
        item.text.trim().length > 0 &&
        item.text.length <= 4000
    );

    if (!validHistory) {
      return NextResponse.json(
        { error: "Conversation history contains invalid messages." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = [
      ...history.map((item: { role: string; text: string }) => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.text }],
      })),
      {
        role: "user",
        parts: [{ text: message.trim() }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents,
      config: {
        systemInstruction:
          "You are StudySphere AI, a friendly study tutor. Explain topics in simple English, step by step. Remember previous messages and understand follow-up questions using conversation history. Give practical examples, especially for programming, mathematics and artificial intelligence.",
      },
    });

    const reply = response.text;

    if (!reply) {
      throw new Error("Gemini returned an empty response.");
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      { error: "Unable to generate an answer. Please try again." },
      { status: 500 }
    );
  }
}
