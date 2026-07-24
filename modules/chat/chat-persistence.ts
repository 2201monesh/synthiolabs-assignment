import { supabase } from "@/lib/supabase-client";
import type { ChatMessage, ChatSession } from "@/lib/types";

interface ChatMessageRow {
  id: string;
  role: ChatMessage["role"];
  content: string;
  created_at: string;
}

interface ChatSessionRow {
  id: string;
  title: string;
  updated_at: string;
  chat_messages: ChatMessageRow[];
}

export async function ensureAnonymousSession(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) return data.session.user.id;

  const { data: signInData, error } = await supabase.auth.signInAnonymously();
  if (error || !signInData.user) return null;
  return signInData.user.id;
}

export async function loadSessions(): Promise<ChatSession[]> {
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("id, title, updated_at, chat_messages(id, role, content, created_at)")
    .order("updated_at", { ascending: false })
    .order("created_at", { foreignTable: "chat_messages", ascending: true });

  if (error || !data) return [];

  return (data as ChatSessionRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    updatedAt: row.updated_at,
    messages: row.chat_messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: message.created_at,
    })),
  }));
}

export async function persistNewSession(session: ChatSession) {
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) return;

  await supabase.from("chat_sessions").insert({
    id: session.id,
    user_id: userId,
    title: session.title,
  });

  await supabase.from("chat_messages").insert(
    session.messages.map((message) => ({
      id: message.id,
      session_id: session.id,
      role: message.role,
      content: message.content,
    }))
  );
}

export async function persistTurn(
  sessionId: string,
  userMessage: ChatMessage,
  assistantMessage: ChatMessage
) {
  await supabase.from("chat_messages").insert([
    {
      id: userMessage.id,
      session_id: sessionId,
      role: userMessage.role,
      content: userMessage.content,
    },
    {
      id: assistantMessage.id,
      session_id: sessionId,
      role: assistantMessage.role,
      content: assistantMessage.content,
    },
  ]);
}

export async function persistAssistantContent(messageId: string, content: string) {
  await supabase.from("chat_messages").update({ content }).eq("id", messageId);
}

export async function touchSession(sessionId: string) {
  await supabase
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);
}

export async function persistEditTruncation(
  sessionId: string,
  keepMessageIds: string[],
  userMessage: ChatMessage,
  assistantMessage: ChatMessage
) {
  const deleteQuery = supabase.from("chat_messages").delete().eq("session_id", sessionId);

  if (keepMessageIds.length > 0) {
    await deleteQuery.not("id", "in", `(${keepMessageIds.join(",")})`);
  } else {
    await deleteQuery;
  }

  await persistTurn(sessionId, userMessage, assistantMessage);
}
