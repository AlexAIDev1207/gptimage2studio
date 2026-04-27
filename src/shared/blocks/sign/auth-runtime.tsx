'use client';

import { useEffect, useRef } from 'react';

import { authClient, useSession } from '@/core/auth/client';
import { useAppContext } from '@/shared/contexts/app';
import { User as UserType } from '@/shared/models/user';

import { SignModal } from './sign-modal';

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
    showOneTap,
  } = useAppContext();

  const { data: session, isPending } = useSession();
  const sessionUser = extractSessionUser(session);
  const didFallbackSyncRef = useRef(false);
  const oneTapInitializedRef = useRef(false);

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

  return <SignModal />;
}
