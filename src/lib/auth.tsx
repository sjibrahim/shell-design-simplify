import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchMe, getStoredUser, getUserToken, logoutUser, type AppUser } from "./user-api";

interface AuthCtx {
  user: AppUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => void;
  setUser: (u: AppUser | null) => void;
}

const Ctx = createContext<AuthCtx>({
  user: null, loading: false, refresh: async () => {}, signOut: () => {}, setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!getUserToken()) { setUser(null); return; }
    setLoading(true);
    try { setUser(await fetchMe()); }
    catch { setUser(null); }
    finally { setLoading(false); }
  }, []);

  const signOut = useCallback(() => { logoutUser(); setUser(null); }, []);

  useEffect(() => {
    setUser(getStoredUser());
    refresh();
  }, [refresh]);

  return <Ctx.Provider value={{ user, loading, refresh, signOut, setUser }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
