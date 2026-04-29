'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';

import { authClient, useSession } from '@/core/auth/client';
import { useAppContext } from '@/shared/contexts/app';
import { User as UserType } from '@/shared/models/user';

// SignModal chunk 仅在用户首次点登录按钮 (isShowSignModal=true) 时下载
type SignModalComponent = ComponentType<Record<string, never>>;

function extractSessionUser(data: any): UserType | null {
  const u = data?.user ?? data?.data?.user ?? null;
  return u && typeof u === 'object' ? (u as UserType) : null;
}

export function AuthRuntime() {
  const {
    configs,
    fetchConfigs,
    setIsCheckSign,
    user,
    setUser,
    fetchUserInfo,
    isShowSignModal,
    showOneTap,
  } = useAppContext();

  const { data: session, isPending } = useSession();
  const sessionUser = extractSessionUser(session);
  const didFallbackSyncRef = useRef(false);
  const oneTapInitializedRef = useRef(false);
  const [SignModal, setSignModal] = useState<SignModalComponent | null>(null);

  useEffect(() => {
    if (!isShowSignModal || SignModal) return;
    let cancelled = false;
    import('./sign-modal')
      .then((mod) => {
        if (!cancelled) {
          setSignModal(() => mod.SignModal as SignModalComponent);
        }
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[auth-runtime] SignModal import failed', err);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isShowSignModal, SignModal]);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  useEffect(() => {
    setIsCheckSign(isPending);
  }, [isPending, setIsCheckSign]);

  useEffect(() => {
    if (
      configs.google_auth_enabled === 'true' &&
      configs.google_client_id &&
      configs.google_one_tap_enabled === 'true' &&
      !session &&
      !isPending &&
      !oneTapInitializedRef.current
    ) {
      oneTapInitializedRef.current = true;
      showOneTap(configs);
    }
  }, [configs, isPending, session, showOneTap]);

  useEffect(() => {
    const currentUserId = user?.id;
    const sessionUserId = sessionUser?.id;

    if (sessionUser && sessionUserId !== currentUserId) {
      setUser(sessionUser);
      fetchUserInfo();
    } else if (!sessionUser && currentUserId && !isPending) {
      setUser(null);
    }
  }, [
    fetchUserInfo,
    isPending,
    sessionUser,
    sessionUser?.email,
    sessionUser?.id,
    setUser,
    user?.id,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (didFallbackSyncRef.current) return;
    if (isPending) return;
    if (sessionUser || user) return;

    didFallbackSyncRef.current = true;
    void (async () => {
      try {
        const res: any = await authClient.getSession();
        const fresh = extractSessionUser(res?.data ?? res);
        if (fresh?.id) {
          setUser(fresh);
          fetchUserInfo();
        }
      } catch {
        // Ignore fallback session sync failures.
      }
    })();
  }, [fetchUserInfo, isPending, sessionUser, setUser, user]);

  return isShowSignModal && SignModal ? <SignModal /> : null;
}
