# PCO Copilot Web

React + TypeScript + Vite frontend for the Port Call Optimization Copilot.

## Stack

- React + TypeScript
- Vite
- TanStack Query (ready for server state)
- lucide-react
- react-markdown + remark-gfm
- Native streaming via `fetch()` + `ReadableStream`

## Run

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set the FastAPI URL:

```env
VITE_API_URL=http://localhost:8000
```

## Expected backend endpoint

The starter calls:

```http
POST /api/chat/stream
Content-Type: application/json

{
  "conversationId": "...",
  "message": "¿Qué escalas tienen riesgo?"
}
```

The response is a newline-delimited JSON stream (NDJSON), e.g.:

```text
{"type":"token","content":"He "}
{"type":"token","content":"consultado "}
{"type":"tool","name":"read_model","status":"started"}
{"type":"tool","name":"read_model","status":"completed"}
{"type":"done","messageId":"..."}
```

For Server-Sent Events, change the parser in `src/services/chatApi.ts`.

## Suggested next steps

1. Replace the demo conversation with conversations from FastAPI/PostgreSQL.
2. Add tool/sub-agent trace UI.
3. Add source/citation cards.
4. Add markdown tables and charts.
5. Add authentication.
6. Add responsive/mobile navigation.
