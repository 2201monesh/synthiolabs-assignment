import type { ChatRole } from "@/lib/types";

interface ChatRequestMessage {
  role: ChatRole;
  content: string;
}

const SYSTEM_PROMPT =
  "You are a helpful, friendly AI assistant embedded in a chat app. Format responses with markdown when it improves clarity (lists, code blocks, bold).";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response("Server is missing OPENAI_API_KEY.", { status: 500 });
  }

  const { messages } = (await request.json()) as { messages: ChatRequestMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Request must include a non-empty messages array.", { status: 400 });
  }

  const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map(({ role, content }) => ({ role, content })),
      ],
    }),
  });

  if (!openaiResponse.ok || !openaiResponse.body) {
    const errorText = await openaiResponse.text();
    return new Response(errorText || "OpenAI request failed.", {
      status: openaiResponse.status || 500,
    });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = openaiResponse.body!.getReader();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content;
            if (token) controller.enqueue(encoder.encode(token));
          } catch {
            // Ignore malformed SSE lines (e.g. keep-alive comments).
          }
        }
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
