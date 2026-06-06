import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface UnreadContextType {
  unreadTotal: number;
  setUnreadTotal: (count: number) => void;
  refetchKey: number;
  bumpRefetch: () => void;
}

const UnreadContext = createContext<UnreadContextType | undefined>(undefined);

export function UnreadProvider({ children }: { children: ReactNode }) {
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [refetchKey, setRefetchKey] = useState(0);
  const bumpRefetch = useCallback(() => setRefetchKey((k) => k + 1), []);

  return (
    <UnreadContext.Provider value={{ unreadTotal, setUnreadTotal, refetchKey, bumpRefetch }}>
      {children}
    </UnreadContext.Provider>
  );
}

export function useUnread() {
  const ctx = useContext(UnreadContext);
  if (!ctx) throw new Error("useUnread must be used within UnreadProvider");
  return ctx;
}
