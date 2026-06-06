import { useSocket } from "@/hooks/useSocket";
import { timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/useAuth";
import {
  Search, Send, Phone, Video, MoreHorizontal,
  MessageSquare, Loader2, Check, CheckCheck, ChevronDown, ArrowLeft
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { getConversationsApi, sendMessageApi, getMessagesApi, markAsSeenApi } from "@/features/chat/api/chat";
import type { Conversation, Message } from "@/types";
import { useUnread } from "@/context/UnreadContext";
import { ConversationRowSkeleton, MessageBubbleSkeleton } from "@/components/shared/PostCardSkeleton";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80";

export default function Chat() {
  const { user: authUser } = useAuth();
  const { onlineUsers, socket } = useSocket();
  const location = useLocation();
  const initialConvId = (location.state as any)?.conversationId;
  const [activeChat, setActiveChat] = useState<string | null>(initialConvId || null);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showConvs, setShowConvs] = useState(!initialConvId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const currentUserId = authUser?.id;
  const { setUnreadTotal } = useUnread();
  const activeConversation = conversations.find((c) => c.id === activeChat);

  // ── Fetch conversations ──
  const fetchConversations = useCallback(async () => {
    try {
      const res = await getConversationsApi();
      setConversations(res.data);
      const total = res.data.reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0);
      setUnreadTotal(total);
    } catch {
      console.error("Failed to fetch conversations");
    } finally {
      setLoading(false);
    }
  }, [setUnreadTotal]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ── Fetch messages when active chat changes ──
  const fetchMessages = useCallback(async (convId: string) => {
    try {
      const res = await getMessagesApi(convId);
      setMessages(res.data.messages);
      await markAsSeenApi(convId);
      // Unread count changed — refresh conversations
      fetchConversations();
    } catch {
      setMessages([]);
    }
  }, [fetchConversations]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
      setAutoScroll(true);
    }
  }, [activeChat, fetchMessages]);

  // ── Auto-scroll to bottom ──
  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAutoScroll(atBottom);
  }, []);

  // ── Listen for realtime messages ──
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg: Message) => {
      if (msg.conversationId === activeChat) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchConversations();
    };
    socket.on("new_message", handleNewMessage);
    return () => { socket.off("new_message", handleNewMessage); };
  }, [socket, activeChat, fetchConversations]);

  // ── Listen for message seen events ──
  useEffect(() => {
    if (!socket) return;
    const handleSeen = (data: { conversationId: string }) => {
      if (data.conversationId === activeChat) {
        fetchMessages(activeChat);
      }
    };
    socket.on("message_seen", handleSeen);
    return () => { socket.off("message_seen", handleSeen); };
  }, [socket, activeChat, fetchMessages]);

  // ── Typing indicators ──
  useEffect(() => {
    if (!socket) return;
    const handleTyping = (data: { conversationId: string; senderId: string }) => {
      if (data.conversationId === activeChat) setTypingUserId(data.senderId);
    };
    const handleStopTyping = (data: { conversationId: string }) => {
      if (data.conversationId === activeChat) setTypingUserId(null);
    };
    socket.on("user_typing", handleTyping);
    socket.on("user_stop_typing", handleStopTyping);
    return () => {
      socket.off("user_typing", handleTyping);
      socket.off("user_stop_typing", handleStopTyping);
    };
  }, [socket, activeChat]);

  const emitTyping = useCallback(() => {
    if (!socket || !activeConversation) return;
    const partnerId = activeConversation.partner.id;
    socket.emit("typing", { conversationId: activeChat, receiverId: partnerId });
    if (typingTimeout) clearTimeout(typingTimeout);
    const t = setTimeout(() => {
      socket.emit("stop_typing", { conversationId: activeChat, receiverId: partnerId });
    }, 2000);
    setTypingTimeout(t);
  }, [socket, activeConversation, activeChat, typingTimeout]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    emitTyping();
  };

  const handleSend = async () => {
    if (!message.trim() || !activeChat || !currentUserId) return;
    const content = message.trim();
    try {
      setSending(true);
      // Optimistic update — append message ngay lập tức với status SENT
      const optimisticMsg: Message = {
        id: `optimistic-${Date.now()}`,
        content,
        senderId: currentUserId,
        conversationId: activeChat,
        status: "SENT",
        createdAt: new Date().toISOString(),
        sender: {
          id: currentUserId,
          username: authUser?.username || "",
          displayName: authUser?.displayName || "",
          avatarUrl: authUser?.avatarUrl || null
        }
      };
      setMessages((prev) => [...prev, optimisticMsg]);
      setMessage("");
      chatInputRef.current?.focus();

      const res = await sendMessageApi(activeChat, content);
      // Thay thế optimistic message bằng message thật từ server
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMsg.id ? res.data : m))
      );

      fetchConversations();
      if (socket && activeConversation) {
        socket.emit("stop_typing", {
          conversationId: activeChat,
          receiverId: activeConversation.partner.id
        });
      }
    } catch {
      // Remove optimistic message nếu gửi thất bại
      setMessages((prev) => prev.filter((m) => !m.id.startsWith("optimistic-")));
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectConversation = (convId: string) => {
    setActiveChat(convId);
    setShowConvs(false);
  };

  const handleBackToConvs = () => {
    setShowConvs(true);
  };

  const SeenIcon = ({ status }: { status?: string }) => {
    if (status === "SEEN") return <CheckCheck className="h-3.5 w-3.5 text-electric-blue" />;
    if (status === "DELIVERED") return <CheckCheck className="h-3.5 w-3.5 text-zinc-500" />;
    return <Check className="h-3.5 w-3.5 text-zinc-500" />;
  };

  const isPartnerOnline = activeConversation
    ? onlineUsers.includes(activeConversation.partner.id)
    : false;

  const isTyping = typingUserId && activeConversation && typingUserId !== currentUserId;

  /* ────────── Conversation list sidebar ────────── */
  const convListPanel = (
    <div className={`flex flex-col glass-mac rounded-2xl p-4 h-full ${
      showConvs ? "flex w-full lg:w-80 lg:shrink-0" : "hidden lg:flex lg:w-80 lg:shrink-0"
    }`}>
      <h3 className="text-sm font-bold text-zinc-200 mb-4">Messages</h3>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search conversations..."
          className="h-auto rounded-lg bg-zinc-900/50 py-2 pl-9 pr-3 text-xs border-white/5 text-zinc-200 placeholder-zinc-500 transition focus:border-zinc-700 dark:bg-zinc-900/50"
        />
      </div>

      <div className="space-y-1 flex-1 overflow-y-auto scrollbar-none">
        {loading ? (
          <ConversationRowSkeleton count={6} />
        ) : conversations.length === 0 ? (
          <div className="text-center py-10 text-zinc-600 text-xs">No conversations yet</div>
        ) : (
          conversations.map((conv) => {
            const isOnline = onlineUsers.includes(conv.partner.id);
            return (
              <Button
                key={conv.id}
                variant="ghost"
                onClick={() => handleSelectConversation(conv.id)}
                className={`w-full flex items-center gap-3 rounded-xl p-3 transition-all duration-200 h-auto ${
                  activeChat === conv.id
                    ? "bg-linear-to-r from-electric-blue/15 via-electric-blue/8 to-transparent shadow-[inset_0_0_20px_rgba(59,130,246,0.06)] hover:bg-none"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.partner.avatarUrl || FALLBACK_AVATAR}
                    alt={conv.partner.displayName}
                    className={`h-10 w-10 rounded-full object-cover transition-all duration-200 ${
                      activeChat === conv.id
                        ? "ring-2 ring-electric-blue/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                        : ""
                    }`}
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#09090b]" />
                  )}
                  {conv.unreadCount != null && conv.unreadCount > 0 && activeChat !== conv.id && (
                    <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-neon-pink shadow-[0_0_8px_rgba(255,0,127,0.6)] border-2 border-[#09090b]" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm truncate ${
                      activeChat === conv.id
                        ? "font-bold text-white"
                        : conv.unreadCount
                        ? "font-bold text-white"
                        : "font-bold text-zinc-200"
                    }`}>
                      {conv.partner.displayName}
                    </span>
                    {conv.lastMessage && (
                      <span className={`text-[10px] shrink-0 ml-2 ${
                        activeChat === conv.id
                          ? "text-electric-blue/70"
                          : "text-zinc-500"
                      }`}>
                        {timeAgo(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className={`text-xs truncate mt-0.5 ${
                      activeChat === conv.id
                        ? "text-zinc-300"
                        : conv.unreadCount
                        ? "text-zinc-200 font-medium"
                        : "text-zinc-500"
                    }`}>
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
              </Button>
            );
          })
        )}
      </div>
    </div>
  );

  /* ────────── Chat message panel ────────── */
  const chatPanel = activeConversation ? (
    <div className={`flex flex-col flex-1 glass-mac rounded-2xl ${
      !showConvs ? "flex w-full" : "hidden lg:flex"
    }`}>
      {/* ── CHAT HEADER ── */}
      <div className="flex items-center justify-between px-4 lg:px-5 py-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          {/* Back button — mobile only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToConvs}
            className="lg:hidden rounded-lg text-zinc-400 hover:text-zinc-300 shrink-0"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <img
            src={activeConversation.partner.avatarUrl || FALLBACK_AVATAR}
            alt={activeConversation.partner.displayName}
            className="h-8 w-8 lg:h-9 lg:w-9 rounded-full object-cover"
          />
          <div>
            <span className="text-sm font-bold text-zinc-200">
              {activeConversation.partner.displayName}
            </span>
            <span className={`text-xs ml-2 ${
              isPartnerOnline ? "text-green-500" : "text-zinc-500"
            }`}>
              {isPartnerOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 lg:gap-2">
          <Button variant="ghost" size="icon" className="rounded-lg text-zinc-500 hover:text-zinc-300">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-lg text-zinc-500 hover:text-zinc-300">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-lg text-zinc-500 hover:text-zinc-300">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── CHAT MESSAGES ── */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-none px-4 lg:px-5 py-4 space-y-3 relative"
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-zinc-600 h-full">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isMine = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
                >
                  {!isMine && (
                    <img
                      src={activeConversation.partner.avatarUrl || FALLBACK_AVATAR}
                      alt={activeConversation.partner.displayName}
                      className="h-6 w-6 lg:h-7 lg:w-7 rounded-full object-cover shrink-0 mb-0.5"
                    />
                  )}
                  <div className={`max-w-[80%] sm:max-w-[70%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                    <div
                      className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 text-sm leading-relaxed wrap-break-word ${
                        isMine
                          ? "bg-electric-blue text-white rounded-br-md"
                          : "bg-zinc-800/60 text-zinc-200 rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div className={`flex items-center gap-1 mt-0.5 ${isMine ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] text-zinc-600">
                        {timeAgo(msg.createdAt)}
                      </span>
                      {isMine && <SeenIcon status={msg.status} />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-2">
                <img
                  src={activeConversation.partner.avatarUrl || FALLBACK_AVATAR}
                  alt={activeConversation.partner.displayName}
                  className="h-6 w-6 lg:h-7 lg:w-7 rounded-full object-cover shrink-0 mb-0.5"
                />
                <div className="bg-zinc-800/60 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Scroll to bottom button */}
      {!autoScroll && messages.length > 0 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setAutoScroll(true);
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="h-8 w-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-400 border border-white/10"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* ── CHAT INPUT ── */}
      <div className="px-4 lg:px-5 py-4 border-t border-white/5 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <Input
            ref={chatInputRef}
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            disabled={sending}
            className="flex-1 h-auto rounded-xl bg-zinc-900/50 px-3 sm:px-4 py-2.5 sm:py-3 text-sm border-white/5 text-zinc-200 placeholder-zinc-500 transition focus:border-zinc-700 dark:bg-zinc-900/50"
          />
          <Button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="btn-lumina rounded-xl bg-linear-to-r from-electric-blue via-neon-pink to-cyber-purple text-white h-auto p-2.5 sm:p-3"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div className={`hidden lg:flex flex-1 items-center justify-center text-zinc-600 glass-mac rounded-2xl`}>
      <div className="text-center space-y-3">
        <MessageSquare className="h-12 w-12 mx-auto text-zinc-700" />
        <p className="text-sm font-medium">Select a conversation</p>
        <p className="text-xs">
          Choose a chat from the left panel to start messaging
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex h-full gap-4">
      {convListPanel}
      {chatPanel}
    </div>
  );
}
