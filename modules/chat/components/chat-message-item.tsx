"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon, PencilSquareIcon } from "@/components/ui/icons";
import { MarkdownContent } from "@/modules/chat/components/markdown-content";
import type { ChatMessage } from "@/lib/types";

interface ChatMessageItemProps {
  message: ChatMessage;
  onEdit: (messageId: string, newContent: string) => void;
  disabled?: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1.5">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
    </div>
  );
}

export function ChatMessageItem({ message, onEdit, disabled }: ChatMessageItemProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const isUser = message.role === "user";

  useEffect(() => {
    const textarea = editTextareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [draft, isEditing]);

  async function handleCopy() {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleStartEdit() {
    setDraft(message.content);
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setDraft(message.content);
    setIsEditing(false);
  }

  function handleSaveEdit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setIsEditing(false);
    onEdit(message.id, trimmed);
  }

  if (isUser) {
    if (isEditing) {
      return (
        <div className="flex justify-end">
          <div className="w-full max-w-[80%]">
            <textarea
              ref={editTextareaRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              autoFocus
              rows={2}
              className="max-h-52 w-full resize-none overflow-y-auto rounded-xl border border-border bg-card px-4 py-2.5 text-sm leading-relaxed text-foreground focus:border-foreground/30 focus:outline-none"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={handleCancelEdit}
                className="rounded-xl px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!draft.trim()}
                className="rounded-xl bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Save &amp; submit
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="group flex flex-col items-end gap-1">
        <div className="max-w-[80%] rounded-xl border border-border bg-sidebar px-4 py-2.5 text-sm leading-relaxed text-foreground">
          {message.content}
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            onClick={handleCopy}
            className="flex h-7 w-7 items-center justify-center rounded-xl text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
            aria-label="Copy message"
            title="Copy message"
          >
            {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={handleStartEdit}
            disabled={disabled}
            className="flex h-7 w-7 items-center justify-center rounded-xl text-muted transition-colors hover:bg-black/5 hover:text-foreground disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-white/5"
            aria-label="Edit message"
            title="Edit message"
          >
            <PencilSquareIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (message.content === "") {
    return <TypingIndicator />;
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="max-w-[85%]">
        <MarkdownContent content={message.content} />
      </div>
      <button
        onClick={handleCopy}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-xl text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
        )}
        aria-label="Copy response"
        title="Copy response"
      >
        {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
