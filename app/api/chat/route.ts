import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

const GEMINI_MODEL = "gemini-2.5-flash";
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000; // 2 detik, akan naik eksponensial
const RETRYABLE_STATUSES = [429, 503]; // rate-limit & overload

async function callGeminiWithRetry(
  apiKey: string,
  body: object,
): Promise<{ data: Record<string, unknown>; status: number }> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    // Jika berhasil atau error bukan retryable, langsung return
    if (response.ok || !RETRYABLE_STATUSES.includes(response.status)) {
      return { data, status: response.status };
    }

    // 429/503 → tunggu lalu retry (exponential backoff)
    if (attempt < MAX_RETRIES - 1) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt); // 2s, 4s, 8s
      console.warn(
        `Gemini ${response.status} (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${delay}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    } else {
      // Semua retry gagal
      return { data, status: response.status };
    }
  }

  // Fallback (seharusnya tidak tercapai)
  return {
    data: { error: { message: "Max retries exceeded" } },
    status: 503,
  };
}

export async function POST(req: Request) {
  try {
    // Cek autentikasi — hanya user yang login yang bisa pakai chatbot
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu untuk menggunakan FitBot." },
        { status: 401 },
      );
    }

    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in environment variables" },
        { status: 500 },
      );
    }

    const formattedMessages = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }),
    );

    const requestBody = {
      contents: formattedMessages,
      systemInstruction: {
        role: "user",
        parts: [
          {
            text: "Kamu adalah FitBot, asisten kesehatan super cerdas. Kamu ahli nutrisi, diet, dan olahraga. Selalu gunakan sapaan ramah dan gunakan markdown untuk format jawaban. Gunakan bahasa Indonesia. Jangan terlalu kaku, gunakan bahasa yang asik namun informatif.",
          },
        ],
      },
    };

    const { data, status } = await callGeminiWithRetry(apiKey, requestBody);

    if (status !== 200) {
      const errorMsg =
        (data.error as { message?: string })?.message ||
        "Gagal mendapatkan respons dari Gemini";
      return NextResponse.json({ error: errorMsg }, { status });
    }

    const candidates = data.candidates as
      | { content?: { parts?: { text?: string }[] } }[]
      | undefined;
    const botResponse =
      candidates?.[0]?.content?.parts?.[0]?.text ||
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
