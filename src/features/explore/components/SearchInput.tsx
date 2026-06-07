import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className,
  autoFocus = false,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="glass-mac h-12 w-full rounded-full border-white/10 bg-white/3 pl-11 pr-10 text-sm text-zinc-200 placeholder:text-zinc-500 transition focus:border-electric-blue/50 focus:bg-white/5 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
