import { useSocket } from "@/hooks/useSocket";
import { timeAgo } from "@/lib/utils";
import { Search, Send, Phone, Video, MoreHorizontal, MessageSquare } from "lucide-react";
import { useState } from "react";
import { mockConversations } from "@/features/chat/mock/conversations";

export default function Chat() {
  const { onlineUsers } = useSocket();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const activeConversation = mockConversations.find((c) => c.id === activeChat);

  return (
    <div className="flex h-full gap-4">
      {/* LEFT: CONVERSATION LIST */}
      <div className="w-80 shrink-0 glass-mac rounded-2xl p-4 flex flex-col">
        <h3 className="text-sm font-bold text-zinc-200 mb-4">Messages</h3>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full rounded-lg bg-zinc-900/50 py-2 pl-9 pr-3 text-xs border border-white/5 text-zinc-200 outline-none transition focus:border-zinc-700"
          />
        </div>

        <div className="space-y-1 flex-1 overflow-y-auto scrollbar-none">
          {mockConversations.map((conversation) => {
            const isOnline = onlineUsers.includes(conversation.partner.id) || true;
            return (
              <button
                key={conversation.id}
                onClick={() => setActiveChat(conversation.id)}
                className={`w-full flex items-center gap-3 rounded-xl p-3 transition-all duration-200 ${
                  activeChat === conversation.id
                    ? "bg-linear-to-r from-electric-blue/15 via-electric-blue/8 to-transparent shadow-[inset_0_0_20px_rgba(59,130,246,0.06)]"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conversation.partner.avatarUrl}
                    alt={conversation.partner.displayName}
                    className={`h-10 w-10 rounded-full object-cover transition-all duration-200 ${
                      activeChat === conversation.id
                        ? "ring-2 ring-electric-blue/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                        : ""
                    }`}
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#09090b]"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm truncate ${
                      activeChat === conversation.id
                        ? "font-bold text-white"
                        : "font-bold text-zinc-200"
                    }`}>
                      {conversation.partner.displayName}
                    </span>
                    {conversation.lastMessage && (
                      <span className={`text-[10px] shrink-0 ml-2 ${
                        activeChat === conversation.id
                          ? "text-electric-blue/70"
                          : "text-zinc-500"
                      }`}>
                        {timeAgo(conversation.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <p className={`text-xs truncate mt-0.5 ${
                      activeChat === conversation.id
                        ? "text-zinc-300"
                        : "text-zinc-500"
                    }`}>
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: CHAT WINDOW */}
      <div className="flex-1 glass-mac rounded-2xl flex flex-col">
        {activeConversation ? (
          <>
            {/* CHAT HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <img
                  src={activeConversation.partner.avatarUrl}
                  alt={activeConversation.partner.displayName}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div>
                  <span className="text-sm font-bold text-zinc-200">
                    {activeConversation.partner.displayName}
                  </span>
                  <span className="text-xs text-green-500 ml-2">Online</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-lg text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition">
                  <Video className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-lg text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CHAT MESSAGES (EMPTY STATE) */}
            <div className="flex-1 flex items-center justify-center text-zinc-600">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">No messages yet</p>
                <p className="text-xs">
                  Send a message to start the conversation
                </p>
              </div>
            </div>

            {/* CHAT INPUT */}
            <div className="px-5 py-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 rounded-xl bg-zinc-900/50 px-4 py-3 text-sm border border-white/5 text-zinc-200 outline-none transition focus:border-zinc-700"
                />
                <button className="p-3 rounded-xl bg-linear-to-r from-electric-blue to-neon-pink text-white hover:brightness-110 transition">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-600">
            <div className="text-center space-y-3">
              <MessageSquare className="h-12 w-12 mx-auto text-zinc-700" />
              <p className="text-sm font-medium">Select a conversation</p>
              <p className="text-xs">
                Choose a chat from the left panel to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
