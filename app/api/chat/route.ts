import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in environment variables" },
        { status: 500 },
      );
    }

    const formattedMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: formattedMessages,
          systemInstruction: {
            role: "user",
            parts: [
              {
                text: "Kamu adalah FitBot, asisten kesehatan super cerdas. Kamu ahli nutrisi, diet, dan olahraga. Selalu gunakan sapaan ramah dan gunakan markdown untuk format jawaban. Gunakan bahasa Indonesia. Jangan terlalu kaku, gunakan bahasa yang asik namun informatif.",
              },
            ],
          },
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Failed to fetch from Gemini" },
        { status: response.status },
      );
    }

    const botResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, saya tidak dapat menjawab saat ini.";

    return NextResponse.json({ response: botResponse });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
