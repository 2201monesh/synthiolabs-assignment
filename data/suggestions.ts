import type { Suggestion } from "@/lib/types";

export const suggestions: Suggestion[] = [
  { id: "write", label: "Write", prompt: "Help me write a short blog post about" },
  { id: "learn", label: "Learn", prompt: "Explain this concept to me simply:" },
  { id: "code", label: "Code", prompt: "Help me write code that" },
  { id: "life", label: "Life stuff", prompt: "Help me plan" },
];
