'use client';

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from 'react';
import { Sparkles, Wand2 } from 'lucide-react';

import { workbench } from './content';
import type { HomePalette, Variant } from './home-theme';

type WorkbenchProps = { variant: 'studio' | 'banana' };
type WorkbenchComponent = ComponentType<WorkbenchProps>;

// 不在 module 顶层调用，函数声明保证 chunk 不进首屏 prefetch 列表。
async function loadWorkbench(): Promise<WorkbenchComponent> {
  const mod = await import('./workbench');
  return mod.default as WorkbenchComponent;
}

function WorkbenchSkeleton() {
  return (
    <div className="mx-auto mt-7 grid max-w-[1280px] overflow-hidden rounded-[22px] border border-emerald-100 bg-white shadow-2xl backdrop-blur dark:border-white/10 dark:bg-[#17181D] lg:grid-cols-[minmax(440px,0.38fr)_minmax(0,0.62fr)]">
      <div className="border-b border-emerald-100/80 p-5 dark:border-white/10 lg:border-r lg:border-b-0 lg:p-6">
        <div className="h-10 w-48 animate-pulse rounded-full bg-emerald-100 dark:bg-white/10" />
        <div className="mt-5 h-[72px] animate-pulse rounded-2xl bg-slate-100 dark:bg-white/8" />
        <div className="mt-5 h-[154px] animate-pulse rounded-2xl bg-slate-100 dark:bg-white/8" />
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-white/8" />
          <div className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-white/8" />
          <div className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-white/8" />
        </div>
        <div className="mt-5 h-14 animate-pulse rounded-xl bg-emerald-100 dark:bg-emerald-500/20" />
      </div>
      <div className="p-4 lg:p-6">
        <div className="aspect-[16/10] animate-pulse rounded-[18px] bg-slate-100 dark:bg-white/8" />
      </div>
    </div>
  );
}

export function LazyWorkbench({
  palette,
  variant,
}: {
  palette: HomePalette;
  variant: Variant;
}) {
  const [Workbench, setWorkbench] = useState<WorkbenchComponent | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadedRef = useRef(false);

  // hash + IntersectionObserver + Load Generator 按钮三种触发只 set boolean
  useEffect(() => {
    const triggerLoad = () => setShouldLoad(true);

    const loadFromHash = () => {
      if (window.location.hash === '#workbench') triggerLoad();
    };

    loadFromHash();
    window.addEventListener('hashchange', loadFromHash);

    const element = sentinelRef.current;
    if (!element) {
      return () => window.removeEventListener('hashchange', loadFromHash);
    }

    if (!('IntersectionObserver' in window)) {
      triggerLoad();
      return () => window.removeEventListener('hashchange', loadFromHash);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        triggerLoad();
        observer.disconnect();
      },
      { rootMargin: '120px 0px' }
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', loadFromHash);
    };
  }, []);

  // shouldLoad 翻为 true 后才真正 import chunk
  useEffect(() => {
    if (!shouldLoad || loadedRef.current) return;
    loadedRef.current = true;
    let cancelled = false;
    loadWorkbench()
      .then((Comp) => {
        if (!cancelled) setWorkbench(() => Comp);
      })
      .catch((err) => {
        loadedRef.current = false;
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[LazyWorkbench] import failed', err);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [shouldLoad]);

  if (Workbench) {
    return <Workbench variant={variant === 'B' ? 'studio' : 'banana'} />;
  }

  return (
    <div>
      <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-white via-emerald-50/70 to-cyan-50/70 p-6 text-left shadow-[0_32px_80px_-56px_rgba(16,185,129,0.35)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(10,12,16,0.96)_0%,rgba(11,21,18,0.98)_100%)] dark:shadow-none md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-xs font-bold tracking-[0.18em] text-emerald-700 uppercase dark:border-emerald-400/20 dark:bg-white/5 dark:text-emerald-200">
              <Sparkles className="size-3.5" />
              Generator Loads On Demand
            </div>
            <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-white md:text-3xl">
              {workbench.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-zinc-300 md:text-base">
              The generator mounts only when you scroll near it, so the hero
              and content render immediately. Your prompt workflow still
              starts here with the same `#workbench` anchor.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShouldLoad(true)}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${palette.accentBg}`}
          >
            <Wand2 className="size-4" />
            Load Generator
          </button>
        </div>
      </div>
      <WorkbenchSkeleton />
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
    </div>
  );
}
