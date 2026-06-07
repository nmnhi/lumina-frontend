import { useState } from "react";
import HashtagMentionText from "./HashtagMentionText";

interface ReadMoreTextProps {
  text: string;
  /** Maximum characters before truncation (Twitter uses ~280) */
  maxChars?: number;
  /** Additional className for the wrapping span */
  className?: string;
}

/**
 * Truncates long text with a "Show more" / "Show less" toggle.
 * Parses #hashtag and @mention within the text.
 */
export default function ReadMoreText({
  text,
  maxChars = 280,
  className = "text-sm text-zinc-300 leading-relaxed whitespace-pre-line",
}: ReadMoreTextProps) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const shouldTruncate = text.length > maxChars;
  const displayText = !shouldTruncate || expanded ? text : text.slice(0, maxChars) + "…";

  return (
    <div>
      <HashtagMentionText text={displayText} className={className} />
      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs font-semibold text-electric-blue hover:underline transition-colors"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
