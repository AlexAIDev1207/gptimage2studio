'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { ArrowRight, Menu, Sparkles, X } from 'lucide-react';

import { Link, usePathname } from '@/core/i18n/navigation';
import { AnimatedThemeToggler } from '@/shared/components/magicui/animated-theme-toggler';
import { useAppContext } from '@/shared/contexts/app';
import { cn } from '@/shared/lib/utils';

// SignUser 仅在已登录用户客户端首次挂载后下载，未登录用户永不付这部分 chunk
type SignUserNav = {
  show_name?: boolean;
  show_credits?: boolean;
  show_sign_out?: boolean;
  items?: unknown[];
};
type SignUserComponent = ComponentType<{ userNav: SignUserNav }>;

const navItems = [
  { label: 'Generator', href: '/#workbench', match: (pathname: string) => pathname === '/' },
  {
    label: 'Prompts',
    href: '/gpt-image-2-prompts',
    match: (pathname: string) =>
      pathname.startsWith('/gpt-image-2-prompts') ||
      pathname.startsWith('/prompts'),
  },
  {
    label: 'Blog',
    href: '/blog',
    match: (pathname: string) => pathname.startsWith('/blog'),
  },
  {
    label: 'Pricing',
    href: '/pricing',
    match: (pathname: string) => pathname.startsWith('/pricing'),
  },
];

function HeaderAction({
  isChecking,
  userLoggedIn,
  onGuestClick,
  onNavigate,
  mobile = false,
}: {
  isChecking: boolean;
  userLoggedIn: boolean;
  onGuestClick: () => void;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  if (isChecking) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          'rounded-full bg-slate-200/70 animate-pulse dark:bg-white/10',
          mobile ? 'h-11 w-full' : 'hidden h-11 w-[168px] sm:block'
        )}
      />
    );
  }

  if (userLoggedIn) {
    return (
      <Link
        href="/pricing#plans"
        onClick={onNavigate}
        className={cn(
          'inline-flex items-center justify-center rounded-full text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:outline-none',
          mobile
            ? 'min-h-11 w-full border border-emerald-300/50 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-4 py-2 text-slate-950 shadow-[0_18px_40px_-26px_rgba(16,185,129,0.45)] hover:brightness-105 dark:border-emerald-400/30 dark:text-slate-950 dark:shadow-[0_18px_40px_-26px_rgba(34,211,238,0.30)]'
            : 'hidden min-h-11 border border-emerald-200/80 bg-emerald-50/90 px-4 py-2 text-emerald-800 shadow-sm hover:border-emerald-300 hover:bg-emerald-100 sm:inline-flex dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/15'
        )}
      >
        Top Up Credits
      </Link>
    );
  }

  const guestClassName = cn(
    'inline-flex items-center justify-center rounded-full text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:outline-none',
    mobile
      ? 'min-h-11 w-full border border-emerald-300/50 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-4 py-2 text-slate-950 shadow-[0_18px_40px_-26px_rgba(16,185,129,0.45)] hover:brightness-105 dark:border-emerald-400/30 dark:text-slate-950 dark:shadow-[0_18px_40px_-26px_rgba(34,211,238,0.30)]'
      : 'hidden min-h-11 border border-emerald-300/60 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-4 py-2 text-slate-950 shadow-[0_18px_40px_-26px_rgba(16,185,129,0.42)] hover:brightness-105 sm:inline-flex dark:border-emerald-400/30 dark:text-slate-950 dark:shadow-[0_18px_40px_-26px_rgba(34,211,238,0.30)]'
  );

  return (
    <button
      type="button"
      onClick={() => {
        onNavigate?.();
        onGuestClick();
      }}
      className={guestClassName}
    >
      Sign in
    </button>
  );
}

export function GptImageStudioSiteHeader() {
  const pathname = usePathname();
  const { user, isCheckSign, setIsShowSignModal } = useAppContext();
  const [navOpen, setNavOpen] = useState(false);
  const [SignUser, setSignUser] = useState<SignUserComponent | null>(null);
  const handleGuestClick = () => setIsShowSignModal(true);

  useEffect(() => {
    if (!user || SignUser) return;
    let cancelled = false;
    import('@/shared/blocks/sign/sign-user')
      .then((mod) => {
        if (!cancelled) {
          setSignUser(() => mod.SignUser as SignUserComponent);
        }
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[site-header] SignUser import failed', err);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user, SignUser]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/88 shadow-[0_18px_48px_-32px_rgba(15,23,42,0.32)] backdrop-blur-xl dark:border-white/5 dark:bg-[#09090B]/80 dark:shadow-none">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 text-zinc-950 shadow-lg shadow-cyan-500/20">
              <Sparkles className="size-4" />
            </span>
            <span className="truncate text-sm font-semibold text-slate-950 sm:text-base dark:text-white">
              GPT Image 2 Studio
            </span>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => {
              const active = item.match(pathname);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-3 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:outline-none',
                    active
                      ? 'bg-slate-200/80 text-slate-950 shadow-sm dark:bg-white/10 dark:text-white dark:shadow-none'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <AnimatedThemeToggler className="inline-flex size-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 shadow-sm transition hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:outline-none [&_svg]:size-4 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:shadow-none dark:hover:bg-white/10 dark:hover:text-white" />
          <HeaderAction
            isChecking={isCheckSign}
            userLoggedIn={Boolean(user)}
            onGuestClick={handleGuestClick}
          />
          {user && SignUser ? (
            <SignUser
              userNav={{
                show_name: true,
                show_credits: true,
                show_sign_out: true,
                items: [],
              }}
            />
          ) : null}
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setNavOpen((value) => !value)}
            className="inline-flex size-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:outline-none lg:hidden dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:shadow-none dark:hover:bg-white/10 dark:hover:text-white"
          >
            {navOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {navOpen && (
        <div className="border-t border-slate-200/80 bg-white/95 lg:hidden dark:border-white/5 dark:bg-[#0B0D12]/95">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 md:px-8">
            {navItems.map((item) => {
              const active = item.match(pathname);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setNavOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-xl px-3 py-3 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:outline-none',
                    active
                      ? 'bg-slate-200/80 text-slate-950 dark:bg-white/10 dark:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-2">
              <HeaderAction
                isChecking={isCheckSign}
                userLoggedIn={Boolean(user)}
                onGuestClick={handleGuestClick}
                onNavigate={() => setNavOpen(false)}
                mobile
              />
            </div>

            <Link
              href="/#workbench"
              onClick={() => setNavOpen(false)}
              className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:outline-none dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:shadow-none dark:hover:bg-white/10"
            >
              Jump to Generator
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
