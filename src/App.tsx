import { useMemo, useState } from "react";
import { Bot, Info, Menu, PanelLeftClose } from "lucide-react";
import { ChatInput } from "./components/ChatInput";
import { ChatMessage } from "./components/ChatMessage";
import { Sidebar } from "./components/Sidebar";
import { streamChat } from "./services/chatApi";
import type { ChatMessage as Message } from "./types/chat";

const welcome: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hola. Soy **PCO Copilot**. Puedo ayudarte a consultar escalas, eventos, recursos, AIS, meteorología y reglas operativas.",
  createdAt: new Date().toISOString(),
  status: "complete",
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [streaming, setStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversationId, setConversationId] = useState(() => crypto.randomUUID());
  const [controller, setController] = useState<AbortController | null>(null);

  const canChat = useMemo(() => !streaming, [streaming]);

  function newChat() {
    controller?.abort();
    setController(null);
    setStreaming(false);
    setConversationId(crypto.randomUUID());
    setMessages([welcome]);
  }

  async function sendMessage(text: string) {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
      status: "complete",
    };

    const assistantId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      status: "streaming",
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);

    const abortController = new AbortController();
    setController(abortController);
    setStreaming(true);

    try {
      for await (const event of streamChat(
        { conversationId, message: text },
        abortController.signal,
      )) {
        if (event.type === "token") {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? { ...message, content: message.content + event.content }
                : message,
            ),
          );
        }

        if (event.type === "done") {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? { ...message, status: "complete" }
                : message,
            ),
          );
        }

        if (event.type === "error") {
          throw new Error(event.message);
        }
      }
    } catch (error) {
      if ((error as DOMException)?.name !== "AbortError") {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  status: "error",
                  content: "No he podido completar la respuesta.",
                }
              : message,
          ),
        );
      }
    } finally {
      setStreaming(false);
      setController(null);
    }
  }

  return (
    <div className="app-shell">
      {sidebarOpen && <Sidebar onNewChat={newChat} />}

      <main className="chat-shell">
        <header className="topbar">
          <button
            className="icon-button ghost"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Mostrar u ocultar menú"
          >
            {sidebarOpen ? <PanelLeftClose size={20} /> : <Menu size={20} />}
          </button>

          <div className="topbar-title">
            <Bot size={20} />
            <div>
              <strong>PCO Copilot</strong>
              <span>Super-agente · LangGraph</span>
            </div>
          </div>

          <button className="icon-button ghost" aria-label="Información">
            <Info size={19} />
          </button>
        </header>

        <section className="chat-content">
          <div className="messages">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>

          <div className="composer-wrapper">
            <ChatInput
              disabled={!canChat}
              streaming={streaming}
              onStop={() => controller?.abort()}
              onSend={sendMessage}
            />
            <p className="disclaimer">
              PCO Copilot puede consultar información del read-model y fuentes en vivo.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}