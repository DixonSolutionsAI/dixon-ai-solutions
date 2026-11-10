import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request) {
  try {
    const { message } = await request.json();
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "A customer message is required." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "OpenAI API key is not configured yet. Add OPENAI_API_KEY in Vercel environment variables to enable the draft generator.",
        },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You are an assistant for a customer support team. Draft a helpful, empathetic reply for the customer. Keep it brief, clear, and specific. If the information is missing, ask a clarifying question instead of guessing. Never claim you have completed a real action. The final answer should be a draft for a human agent to review before sending.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json({ error: "No draft was returned by the model." }, { status: 500 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("reply draft error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate a customer support draft.",
      },
      { status: 500 }
    );
  }
}
