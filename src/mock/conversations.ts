export const mockConversations = [
  {
    id: "conv-1",
    user1Id: "me",
    user2Id: "user-1",
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-06-04T10:00:00Z",
    partner: {
      id: "user-1",
      displayName: "Elena Vance",
      username: "elena",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    },
    lastMessage: { content: "The design looks amazing! Let's ship it 🚀", createdAt: "2026-06-04T09:58:00Z" }
  },
  {
    id: "conv-2",
    user1Id: "me",
    user2Id: "user-2",
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-06-04T07:00:00Z",
    partner: {
      id: "user-2",
      displayName: "Julian Noir",
      username: "julian",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    },
    lastMessage: { content: "Web3 integration is complete on staging", createdAt: "2026-06-04T06:00:00Z" }
  },
  {
    id: "conv-3",
    user1Id: "user-3",
    user2Id: "me",
    createdAt: "2026-06-02T00:00:00Z",
    updatedAt: "2026-06-04T03:00:00Z",
    partner: {
      id: "user-3",
      displayName: "Sasha Grey",
      username: "sasha",
      avatarUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
    },
    lastMessage: { content: "See you at the meetup tomorrow!", createdAt: "2026-06-04T02:30:00Z" }
  }
];