import { Loader2, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/useAuth";
import { createCommentApi } from "@/features/interactions/api/interactions";

/* ─── Props ─── */

interface ReplyTo {
  id: string;
  username: string;
  displayName: string;
}

interface CommentInputProps {
  postId: string;
  replyTo: ReplyTo | null;
  onCancelReply: () => void;
  onCommentCreated: () => void;
}

/* ─── Helpers ─── */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ─── Component ─── */

export default function CommentInput({
  postId,
  replyTo,
  onCancelReply,
  onCommentCreated,
}: CommentInputProps) {
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const initials = getInitials(user?.displayName ?? "U");
  const isEmpty = content.trim().length === 0;

  /* Auto-grow textarea */
  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleSubmit = async () => {
    if (isEmpty || submitting) return;

    try {
      setSubmitting(true);
      await createCommentApi(postId, content.trim(), replyTo?.id ?? undefined);
      setContent("");
      onCancelReply();
      onCommentCreated();

      /* Reset textarea height */
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch {
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    /* Cmd+Enter / Ctrl+Enter to submit */
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-2">
      {/* Reply context chip */}
      {replyTo && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-electric-blue font-medium">
            Replying to {replyTo.displayName}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onCancelReply}
            disabled={submitting}
            className="h-5 w-5 text-zinc-500 hover:text-zinc-300 hover:bg-transparent"
            aria-label="Cancel reply"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        <Avatar size="sm" className="shrink-0 mb-0.5">
          <AvatarImage
            src={user?.avatarUrl || undefined}
            alt={user?.displayName ?? "You"}
          />
          <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white text-[9px] font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 flex items-end gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 focus-within:border-electric-blue/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            disabled={submitting}
            placeholder={replyTo ? "Write a reply…" : "Write a comment…"}
            rows={1}
            className="flex-1 bg-transparent border-0 resize-none text-sm text-zinc-100 placeholder-zinc-600 outline-none scrollbar-none leading-relaxed"
          />

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleSubmit}
            disabled={isEmpty || submitting}
            className={cn(
              "h-7 w-7 shrink-0 rounded-full transition-colors",
              isEmpty
                ? "text-zinc-700"
                : "text-electric-blue hover:bg-electric-blue/10 hover:text-electric-blue"
            )}
            aria-label="Send comment"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
