import type { ChatRequest, ChatStreamEvent } from "../types/chat";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function* streamChat(
  request: ChatRequest,
  signal?: AbortSignal,
): AsyncGenerator<ChatStreamEvent> {
  const response = await fetch(`${API_URL}/api/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Chat API returned ${response.status}`);
  }

  if (!response.body) {
    throw new Error("The browser did not expose a response stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Starter protocol: one JSON event per line.
        // If FastAPI uses SSE, adapt this parser to "data: {...}".
        yield JSON.parse(trimmed) as ChatStreamEvent;
      }
    }

    if (buffer.trim()) {
      yield JSON.parse(buffer.trim()) as ChatStreamEvent;
    }
  } finally {
    reader.releaseLock();
  }
}