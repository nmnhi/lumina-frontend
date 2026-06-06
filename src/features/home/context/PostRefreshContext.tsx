import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

interface PostRefreshContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const PostRefreshContext = createContext<PostRefreshContextType>({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export function PostRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = useCallback(
    () => setRefreshKey((k) => k + 1),
    []
  );

  return (
    <PostRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </PostRefreshContext.Provider>
  );
}

export function usePostRefresh() {
  return useContext(PostRefreshContext);
}
