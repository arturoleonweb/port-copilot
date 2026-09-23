import { MessageSquarePlus, Ship } from "lucide-react";

type Props = {
  onNewChat: () => void;
};

export function Sidebar({ onNewChat }: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Ship size={20} /></div>
        <div>
          <strong>PCO Copilot</strong>
          <span>Port Call Optimization</span>
        </div>
      </div>

      <button className="new-chat" onClick={onNewChat}>
        <MessageSquarePlus size={18} />
        Nueva conversación
      </button>

      <div className="sidebar-section">
        <span className="section-label">Conversaciones</span>
        <button className="conversation active">Demo · Port Call</button>
      </div>

      <div className="sidebar-footer">
        <span>Frontend</span>
        <small>React + TypeScript</small>
      </div>
    </aside>
  );
}