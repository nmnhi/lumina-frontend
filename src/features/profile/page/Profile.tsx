import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, Calendar, Loader2, ArrowLeft, UserX, UserPlus, UserCheck, MessageSquare } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { getMeApi, getUserByUsernameApi, toggleFollowApi } from "@/features/profile/api/user";
import { getMyPostsApi, getUserPostsApi } from "@/features/home/api/post";
import { getOrCreateConversationApi } from "@/features/chat/api/chat";
import type { Post, User } from "@/types";
import PostCard from "@/features/home/components/PostCard";
import ProfileAvatarWithStory from "@/features/profile/components/ProfileAvatarWithStory";
import { ProfileSkeleton } from "@/components/shared/PostCardSkeleton";
import { toast } from "sonner";

const mockTabs = ["Posts", "Likes", "Media"] as const;

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Posts");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const isOwnProfile = !username || username === authUser?.username;
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);

  const handleMessage = useCallback(async () => {
    if (!profile?.id) return;
    try {
      setMsgLoading(true);
      const res = await getOrCreateConversationApi(profile.id);
      navigate("/chat", { state: { conversationId: res.data.id } });
    } catch {
      toast.error("Cannot start conversation with this user.");
    } finally {
      setMsgLoading(false);
    }
  }, [profile?.id, navigate]);

  const handleToggleFollow = useCallback(async () => {
    if (!profile?.id) return;
    try {
      setFollowLoading(true);
      const res = await toggleFollowApi(profile.id);
      setIsFollowing(res.data.isFollowing);
    } catch {
      console.error("Failed to toggle follow");
    } finally {
      setFollowLoading(false);
    }
  }, [profile?.id]);

  // Move the sliding indicator to the active tab
  useLayoutEffect(() => {
    let raf2 = 0;
    const measure = () => {
      const container = tabsContainerRef.current;
      const btn = tabsRef.current?.get(activeTab);
      if (!container || !btn) return;
      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    };
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(measure);
    });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("resize", measure);
    };
  }, [activeTab, posts.length]);

  // Fetch data based on whether we're viewing own profile or someone else's
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (isOwnProfile) {
        const profileRes = await getMeApi();
        setProfile(profileRes.data);
      } else {
        const profileRes = await getUserByUsernameApi(username!);
        setProfile(profileRes.data);
        setIsFollowing(profileRes.data.isFollowing ?? false);
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setError("User not found");
      } else {
        setError("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  }, [isOwnProfile, username]);

  const fetchPosts = useCallback(async () => {
    try {
      if (isOwnProfile) {
        const postsRes = await getMyPostsApi();
        setPosts(postsRes.data.posts);
      } else if (profile?.id) {
        const postsRes = await getUserPostsApi(profile.id);
        setPosts(postsRes.data.posts);
      }
    } catch {
      console.error("Failed to load posts");
    }
  }, [isOwnProfile, profile?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!loading && profile) {
      fetchPosts();
    }
  }, [loading, profile, fetchPosts]);

  const currentUser = profile || authUser;

  // Error state — user not found
  if (error && !loading) {
    return (
      <div className="glass-mac rounded-2xl p-10 text-center space-y-4">
        <UserX className="h-12 w-12 text-zinc-600 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-zinc-300">User not found</h3>
          <p className="text-sm text-zinc-500">
            No profile exists for "{username}". The link may be broken.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-electric-blue hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    );
  }

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* COVER & AVATAR */}
      <div className="glass-mac rounded-2xl overflow-hidden">
        {/* COVER */}
        <div className="h-40 bg-linear-to-r from-electric-blue/20 via-neon-pink/20 to-cyber-purple/20 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        </div>

        {/* PROFILE INFO */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-5">
          <div className="flex flex-wrap items-end justify-between -mt-12 mb-4 gap-2">
            <div className="relative shrink-0">
              <ProfileAvatarWithStory
                userId={currentUser?.id || ""}
                avatarUrl={currentUser?.avatarUrl}
                displayName={currentUser?.displayName || "User"}
              />
            </div>
            {isOwnProfile ? (
              <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-xl border-white/10 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/5 h-auto">
                <Settings className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  onClick={handleToggleFollow}
                  disabled={followLoading}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium h-auto ${
                    isFollowing
                      ? "border-white/10 text-zinc-300 hover:bg-white/5 hover:border-red-400 hover:text-red-400"
                      : "bg-electric-blue text-white hover:bg-electric-blue/90"
                  }`}
                >
                  {followLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : isFollowing ? (
                    <UserCheck className="h-3.5 w-3.5" />
                  ) : (
                    <UserPlus className="h-3.5 w-3.5" />
                  )}
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMessage}
                  disabled={msgLoading}
                  className="flex items-center gap-2 rounded-xl border-white/10 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/5 h-auto"
                >
                  {msgLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <MessageSquare className="h-3.5 w-3.5" />
                  )}
                  Message
                </Button>
              </>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <h1 className="text-xl font-bold text-white">
                {currentUser?.displayName || "Alex Rivers"}
              </h1>
              <span className="text-sm text-zinc-500">
                @{currentUser?.username || "arivers"}
              </span>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
              {currentUser?.bio || "No bio yet."}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
              {currentUser?.createdAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Joined {new Date(currentUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm flex-wrap">
              <span className="text-zinc-200 font-bold">1,247</span>
              <span className="text-zinc-500 text-xs">Following</span>
              <span className="text-zinc-200 font-bold">8,432</span>
              <span className="text-zinc-500 text-xs">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS with sliding indicator */}
      <div className="glass-mac rounded-2xl p-1 relative">
        <div
          className="absolute top-1 bottom-1 rounded-xl bg-linear-to-r from-electric-blue/20 via-electric-blue/10 to-transparent transition-all duration-300 ease-in-out"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />

        <div className="relative flex gap-1" ref={tabsContainerRef}>
          {mockTabs.map((tab, idx) => {
            const isActive = activeTab === tab;
            return (
              <Button
                key={tab}
                ref={(el) => {
                  if (!tabsRef.current) tabsRef.current = new Map();
                  if (el) tabsRef.current.set(tab, el);
                }}
                variant="ghost"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold relative z-10 transition-colors duration-300 h-auto border-0 shadow-none ring-0 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  isActive
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                style={{ boxShadow: "none" }}
                tabIndex={0}
                data-tab-index={idx}
              >
                {tab}
              </Button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div
        key={activeTab}
        className="animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        {activeTab === "Posts" && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="glass-mac rounded-2xl p-10 text-center">
                <div className="max-w-xs mx-auto space-y-3">
                  <h3 className="text-sm font-bold text-zinc-400">No posts yet</h3>
                  <p className="text-xs text-zinc-600">
                    {isOwnProfile
                      ? "When you create posts, they'll show up here."
                      : "This user hasn't posted anything yet."}
                  </p>
                </div>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onMediaClick={() => {}}
                />
              ))
            )}
          </div>
        )}
        {activeTab === "Likes" && (
          <div className="glass-mac rounded-2xl p-10 text-center">
            <div className="max-w-xs mx-auto space-y-3">
              <h3 className="text-sm font-bold text-zinc-400">No likes yet</h3>
              <p className="text-xs text-zinc-600">Posts you like will appear here.</p>
            </div>
          </div>
        )}
        {activeTab === "Media" && (
          <div className="glass-mac rounded-2xl p-10 text-center">
            <div className="max-w-xs mx-auto space-y-3">
              <h3 className="text-sm font-bold text-zinc-400">No media yet</h3>
              <p className="text-xs text-zinc-600">Photos and videos you share will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
