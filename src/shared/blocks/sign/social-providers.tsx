'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { signIn } from '@/core/auth/client';
import { defaultLocale } from '@/config/locale';
import { Button } from '@/shared/components/ui/button';
import { useAppContext } from '@/shared/contexts/app';
import { cn } from '@/shared/lib/utils';
import { Button as ButtonType } from '@/shared/types/blocks/common';

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      viewBox="0 0 24 24"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.89-1.74 2.98-4.31 2.98-7.52z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.89 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.12H3.05v2.59A9.99 9.99 0 0 0 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.92a6 6 0 0 1 0-3.84V7.49H3.05a10.01 10.01 0 0 0 0 9.02l3.35-2.59z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.79.51 3.82 1.5l2.87-2.87C16.96 2.98 14.7 2 12 2a9.99 9.99 0 0 0-8.95 5.49l3.35 2.59C7.19 7.72 9.4 5.96 12 5.96z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      focusable="false"
    >
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.16c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.57-.29-5.27-1.29-5.27-5.73 0-1.27.45-2.3 1.2-3.11-.12-.29-.52-1.47.11-3.07 0 0 .98-.31 3.2 1.19a11.1 11.1 0 0 1 5.82 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.6.23 2.78.11 3.07.75.81 1.2 1.84 1.2 3.11 0 4.45-2.71 5.43-5.29 5.72.42.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}

export function SocialProviders({
  configs,
  callbackUrl,
  loading,
  setLoading,
}: {
  configs: Record<string, string>;
  callbackUrl: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  const t = useTranslations('common.sign');
  const locale = useLocale();

  const { setIsShowSignModal } = useAppContext();
  const popupRef = useRef<Window | null>(null);
  const popupTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  if (callbackUrl) {
    if (
      locale !== defaultLocale &&
      callbackUrl.startsWith('/') &&
      !callbackUrl.startsWith(`/${locale}`)
    ) {
      callbackUrl = `/${locale}${callbackUrl}`;
    }
  }

  const cleanupPopup = useCallback(() => {
    if (popupTimerRef.current) {
      clearInterval(popupTimerRef.current);
      popupTimerRef.current = null;
    }
    popupRef.current = null;
  }, []);

  const handleAuthCallback = useCallback(() => {
    cleanupPopup();
    setIsShowSignModal(false);
    // Hard reload the page so the browser picks up the new session cookie
    window.location.reload();
  }, [cleanupPopup, setIsShowSignModal]);

  // Listen for localStorage event from the popup callback page
  // (works even when COOP blocks window.opener / postMessage)
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'auth-callback-success') {
        handleAuthCallback();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [handleAuthCallback]);

  const handleSignIn = async ({ provider }: { provider: string }) => {
    setLoading(true);

    // Open popup to the intermediate page that triggers signIn.social()
    const popupPath =
      locale !== defaultLocale
        ? `/${locale}/auth-popup?provider=${provider}`
        : `/auth-popup?provider=${provider}`;
    const popupUrl = `${window.location.origin}${popupPath}`;

    // Open centered popup window
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      popupUrl,
      'oauth-popup',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
    );

    if (!popup) {
      // Popup blocked - fall back to redirect
      toast.error('Popup blocked. Trying redirect...');
      setLoading(false);
      await signIn.social(
        { provider, callbackURL: callbackUrl },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => setIsShowSignModal(false),
          onError: (e: any) => {
            toast.error(e?.error?.message || 'Sign in failed');
            setLoading(false);
          },
        }
      );
      return;
    }

    popupRef.current = popup;

    // Poll to detect if popup was closed manually (without completing auth)
    popupTimerRef.current = setInterval(() => {
      try {
        if (popup.closed) {
          cleanupPopup();
          setLoading(false);
        }
      } catch {
        // COOP may block access to popup.closed; ignore and keep polling
      }
    }, 500);
  };

  const providers: ButtonType[] = [];

  if (configs.google_auth_enabled === 'true' && configs.google_client_id) {
    providers.push({
      name: 'google',
      title: t('google_sign_in_title'),
      icon: <GoogleIcon />,
      onClick: () => handleSignIn({ provider: 'google' }),
    });
  }

  if (configs.github_auth_enabled === 'true') {
    providers.push({
      name: 'github',
      title: t('github_sign_in_title'),
      icon: <GithubIcon />,
      onClick: () => handleSignIn({ provider: 'github' }),
    });
  }

  return (
    <div
      className={cn(
        'flex w-full items-center gap-2',
        'flex-col justify-between'
      )}
    >
      {providers.map((provider) => (
        <Button
          key={provider.name}
          type="button"
          variant="outline"
          className={cn('w-full gap-2')}
          disabled={loading}
          onClick={provider.onClick}
        >
          {provider.icon}
          <h3>{provider.title}</h3>
        </Button>
      ))}
    </div>
  );
}
