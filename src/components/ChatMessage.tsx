import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage as Message } from "../types/chat";

type Props = {
  message: Message;
};

export function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`message-row ${isUser ? "message-row-user" : ""}`}>
      <div className={`avatar ${isUser ? "avatar-user" : "avatar-assistant"}`}>
        {isUser ? "Tú" : "AI"}
      </div>

      <div className={`message-bubble ${isUser ? "bubble-user" : "bubble-assistant"}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content || (message.status === "streaming" ? "▍" : "")}
        </ReactMarkdown>
        {message.status === "streaming" && <span className="cursor">▍</span>}
      </div>
    </div>
  );
}