// ─── KHỚP 100% PRISMA SCHEMA ───

// 🧑 User model
export interface User {
  id: string;
  email: string;
  password?: string;          // only used in backend, omitted on client
  displayName: string;
  username: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  bio?: string | null;
  resetToken?: string | null;
  resetTokenExp?: string | null;
  createdAt: string;          // DateTime mapped to string in JSON
  updatedAt: string;

  // Relations (optional when fetching partial)
  posts?: Post[];
  stories?: Story[];
  comments?: Comment[];
  likes?: Like[];

  // Extra fields from API responses
  isFollowing?: boolean;
}

// 📄 Post model
export interface Post {
  id: string;
  bodyText?: string | null;   // @db.Text
  media?: any | null;         // Json — array of media objects or string URLs
  isSponsored: boolean;
  authorId: string;
  originalPostId?: string | null;
  createdAt: string;
  updatedAt: string;

  author: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  originalPost?: Post | null;
  _count?: {
    comments: number;
    likes: number;
    sharedPosts: number;
  };
  isLiked?: boolean;
  comments?: Comment[];
  likes?: Like[];
}

// 📖 Story model
export interface Story {
  id: string;
  mediaUrl: string;           // Story.mediaUrl
  authorId: string;
  createdAt: string;

  author: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
}

// ❤️ Like model
export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;

  user: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  post: Post;
}

// 💬 Comment model (self-relation)
export interface Comment {
  id: string;
  content: string;            // @db.Text
  userId: string;
  postId: string;
  parentId?: string | null;
  createdAt: string;

  user: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  parent?: Comment | null;
  replies?: Comment[];
}

// 👥 Follow model
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;

  follower: User;
  following: User;
}

// 💬 Conversation model
export interface Conversation {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: string;
  updatedAt: string;

  user1: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  user2: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  messages: Message[];

  // Helper: the other user (not the current one)
  partner?: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  lastMessage?: Pick<Message, "content" | "createdAt"> | null;
  unreadCount?: number;
}

// ✉️ Message model
export type MessageStatus = "SENT" | "DELIVERED" | "SEEN";

export interface Message {
  id: string;
  content: string;            // @db.Text
  senderId: string;
  conversationId: string;
  status: MessageStatus;      // SENT | DELIVERED | SEEN
  createdAt: string;
  seenAt?: string | null;

  sender: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  conversation?: Conversation;
}