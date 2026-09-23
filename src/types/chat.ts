export type Role = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  status?: "streaming" | "complete" | "error";
};

export type ChatRequest = {
  conversationId: string;
  message: string;
};

export type ChatStreamEvent =
  | { type: "token"; content: string }
  | { type: "tool"; name: string; status: "started" | "completed" }
  | { type: "source"; title: string; url?: string }
  | { type: "done"; messageId: string }
  | { type: "error"; message: string };