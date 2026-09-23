import { FormEvent, useState } from "react";
import { Send, Square } from "lucide-react";

type Props = {
  disabled?: boolean;
  onSend: (value: string) => void;
  onStop?: () => void;
  streaming?: boolean;
};

export function ChatInput({ disabled, onSend, onStop, streaming }: Props) {
  const [value, setValue] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = value.trim();
    if (!text || disabled || streaming) return;
    onSend(text);
    setValue("");
  }

  return (
    <form className="composer" onSubmit={submit}>
      <textarea
        value={value}
        disabled={disabled}
        placeholder="Pregunta sobre escalas, recursos, AIS, meteorología..."
        rows={1}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit(event);
          }
        }}
      />
      {streaming ? (
        <button type="button" className="icon-button stop" onClick={onStop} aria-label="Detener">
          <Square size={17} />
        </button>
      ) : (
        <button type="submit" className="icon-button send" disabled={!value.trim()} aria-label="Enviar">
          <Send size={18} />
        </button>
      )}
    </form>
  );
}