import { IconButton } from "@/components/ui/icon-button";
import { PlusIcon } from "@/components/ui/icons";

export function NewChatButton() {
  return (
    <IconButton label="New chat" className="border border-border bg-card">
      <PlusIcon className="h-4 w-4" />
    </IconButton>
  );
}
