# AI Assistant

A responsive, ChatGPT/Claude-style AI chat web app built with Next.js. Users can talk to an AI assistant over **text or voice**, with real streaming responses, a collapsible chat history sidebar, and chats that persist across page reloads.

## Features

- **Text chat** — streamed, token-by-token AI responses (OpenAI), with markdown rendering (code blocks, lists, bold, links), message copy, and inline message editing (editing a message regenerates the conversation from that point, like ChatGPT/Claude).
- **Voice chat** — a dedicated voice mode with a live "liquid orb" visual, automatic speech detection (Web Speech API), spoken replies, live transcript, mute, and end-session controls.
- **Persistent chat history** — chats and messages are saved to Supabase and reloaded on refresh, scoped anonymously per browser (no login required).
- **Collapsible sidebar** — recent chats, new chat, and a text/voice mode toggle; collapses to an icon rail on desktop and becomes an off-canvas drawer on mobile.
- **Fully responsive** — a ChatGPT-style mobile layout (bottom composer bar, off-canvas sidebar) below the `md` breakpoint, and a centered, max-width desktop layout so the app doesn't stretch edge-to-edge on very large monitors.
- **Light/dark theme** — follows the OS/browser color scheme automatically.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com) |
| Tooltips | [Radix UI](https://www.radix-ui.com/) (`@radix-ui/react-tooltip`) |
| Markdown rendering | [react-markdown](https://github.com/remarkjs/react-markdown) |
| AI responses | [OpenAI API](https://platform.openai.com/) (`gpt-4o-mini`, streamed via a Next.js Route Handler) |
| Voice | Browser-native **Web Speech API** (`SpeechRecognition` for speech-to-text, `speechSynthesis` for text-to-speech) — no external voice API |
| Database / persistence | [Supabase](https://supabase.com) (Postgres + Row Level Security + Anonymous Auth) |
| Language | TypeScript |

## Project structure

```
app/
  api/chat/          # Route Handler that streams OpenAI responses to the client
  home/               # The single-page app route
  layout.tsx, page.tsx
components/
  ui/                 # Generic, reusable UI primitives (button, icon-button, tooltip, logo, icons)
  layout/             # App shell (sidebar + main content composition)
modules/
  chat/               # Chat feature: components, session state (context), Supabase persistence
  sidebar/             # Sidebar feature: components, mobile drawer state (context)
lib/
  types.ts            # Shared domain types (ChatMessage, ChatSession)
  utils.ts             # Small helpers (e.g. `cn` for classnames)
  supabase-client.ts   # Supabase browser client
types/
  speech-recognition.d.ts  # Ambient types for the Web Speech API
```

## Getting started

### Prerequisites

- Node.js 20.9+ 
- An [OpenAI API key](https://platform.openai.com/api-keys)
- A [Supabase](https://supabase.com) project (free tier is fine)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```bash
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

- `OPENAI_API_KEY` — from the OpenAI dashboard. Used only server-side (in the `/api/chat` Route Handler), never exposed to the browser.
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from your Supabase project's **Project Settings → API**. These are safe to expose client-side; Row Level Security is what actually protects the data, not secrecy of the key.

### 3. Set up the Supabase database

In your Supabase project's **SQL Editor**, run:

```sql
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null default '',
  created_at timestamptz not null default now()
);

alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;

create policy "Users manage their own sessions"
  on chat_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage messages in their own sessions"
  on chat_messages for all
  using (
    exists (
      select 1 from chat_sessions
      where chat_sessions.id = chat_messages.session_id
      and chat_sessions.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from chat_sessions
      where chat_sessions.id = chat_messages.session_id
      and chat_sessions.user_id = auth.uid()
    )
  );
```

Then enable **Anonymous Sign-ins**: **Authentication → Providers** (or **Sign In / Providers**) → toggle **Anonymous** on. This lets the app identify each browser as a private, login-free user so chats persist without requiring an account.

> If Supabase isn't configured (or anonymous sign-in is off), the app still works fully — it just falls back to in-memory chat state that resets on refresh, instead of erroring out.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/home`.

### Other scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint     # lint the project
```

## Notes

- Voice input/output relies on the browser's built-in Web Speech API, which has the best support in Chrome/Edge; other browsers may have limited or no support, in which case voice mode shows a clear "not supported" state instead of failing silently.
- The "connected apps" icons (Slack, Notion, Perplexity, Greptile) shown near the message input are decorative UI only — they're not live integrations.
