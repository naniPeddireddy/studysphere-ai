
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const conversationId =
      typeof body.conversationId === "string" &&
      body.conversationId.trim()
        ? body.conversationId.trim()
        : crypto.randomUUID();

    if (
      !Array.isArray(body.messages) ||
      body.messages.length === 0 ||
      body.messages.length > 100
    ) {
      return NextResponse.json(
        { error: "Please provide between 1 and 100 messages." },
        { status: 400 }
      );
    }

    const messages = [];

    for (const message of body.messages) {
      const role = message?.role;
      const text = message?.text ?? message?.content;

      if (
        (role !== "user" && role !== "assistant") ||
        typeof text !== "string" ||
        !text.trim()
      ) {
        return NextResponse.json(
          { error: "Invalid conversation message." },
          { status: 400 }
        );
      }

      messages.push({
        role,
        text: text.trim(),
      });
    }

    const client = await clientPromise;
    const database = client.db("studysphere");
    const conversations = database.collection("conversations");

    await conversations.updateOne(
      { conversationId },
      {
        $set: {
          messages,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      conversationId,
      message: "Conversation saved successfully.",
    });
  } catch (error) {
    console.error("Save conversation error:", error);

    return NextResponse.json(
      { error: "Unable to save conversation." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("id");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const database = client.db("studysphere");

    const conversation = await database
      .collection("conversations")
      .findOne({ conversationId });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Load conversation error:", error);

    return NextResponse.json(
      { error: "Unable to load conversation." },
      { status: 500 }
    );
  }
}
