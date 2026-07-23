import { suggestions } from "@/data/suggestions";
import { BookOpenIcon, CodeIcon, CompassIcon, PencilSquareIcon } from "@/components/ui/icons";
import type { SVGProps } from "react";

const iconBySuggestionId: Record<string, (props: SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  write: PencilSquareIcon,
  learn: BookOpenIcon,
  code: CodeIcon,
  life: CompassIcon,
};

interface SuggestionChipsProps {
  onSelect: (prompt: string) => void;
}

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      {suggestions.map((suggestion) => {
        const Icon = iconBySuggestionId[suggestion.id] ?? CompassIcon;
        return (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion.prompt)}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-foreground/80 transition-colors hover:bg-card hover:shadow-elevation-1"
          >
            <Icon className="h-4 w-4 text-accent" />
            {suggestion.label}
          </button>
        );
      })}
    </div>
  );
}
