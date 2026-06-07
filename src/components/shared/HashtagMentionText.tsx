import { Link } from "react-router-dom";

interface HashtagMentionTextProps {
  text: string;
  className?: string;
}

/**
 * Parses #hashtag and @mention patterns in text and renders them as
 * clickable Links. Supports Unicode (Tiếng Việt has letters with diacritics).
 */
export default function HashtagMentionText({
  text,
  className,
}: HashtagMentionTextProps) {
  if (!text) return null;

  // Pattern: capture hashtags and mentions
  // Hashtag: # followed by unicode letters, numbers, underscore
  // Mention: @ followed by unicode letters, numbers, underscore, dot, hyphen
  const pattern = /(#|@)([\p{L}\p{N}_.-]+)/gu;

  const parts: Array<
    | { type: "text"; value: string }
    | { type: "hashtag"; value: string }
    | { type: "mention"; value: string }
  > = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    const prefix = match[1];
    const tag = match[2];
    if (prefix === "#") {
      parts.push({ type: "hashtag", value: tag });
    } else {
      parts.push({ type: "mention", value: tag });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.type === "text") {
          return <span key={i}>{part.value}</span>;
        }
        if (part.type === "hashtag") {
          return (
            <Link
              key={i}
              to={`/hashtag/${encodeURIComponent(part.value)}`}
              className="text-electric-blue hover:underline transition-colors"
            >
              #{part.value}
            </Link>
          );
        }
        return (
          <Link
            key={i}
            to={`/profile/${encodeURIComponent(part.value)}`}
            className="text-electric-blue hover:underline transition-colors"
          >
            @{part.value}
          </Link>
        );
      })}
    </span>
  );
}
