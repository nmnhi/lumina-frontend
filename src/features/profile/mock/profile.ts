export const mockTabs = ["Posts", "Likes", "Media"] as const;

export const tabContents: Record<string, { title: string; desc: string }> = {
  Posts: {
    title: "No posts yet",
    desc: "When you create posts, they'll show up here for others to see.",
  },
  Likes: {
    title: "No likes yet",
    desc: "Posts you like will appear here.",
  },
  Media: {
    title: "No media yet",
    desc: "Photos and videos you share will appear here.",
  },
};
