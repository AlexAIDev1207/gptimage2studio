'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'gptimage2studio:cookie-consent';

/**
 * 简化版 cookie consent strip（页底固定栏）。
 *
 * 用户首次访问展示，点击 [Got it] 后写入 localStorage，下次进站不再展示。
 * 仅做告知用途——GA4 已在 Consent Mode v2 下不挂任何 marketing/ad cookie，
 * 仅 analytics 用途，符合大多数地区合规。
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const accepted = window.localStorage.getItem(STORAGE_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // localStorage 不可用时静默失败（无痕模式等）
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,640px)] -translate-x-1/2 rounded-xl border border-white/10 bg-zinc-900/95 px-4 py-3 text-sm text-zinc-200 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-3">
        <p className="flex-1 leading-relaxed">
          We use analytics cookies to understand how you use GPT Image 2 Studio
          and improve the experience. No ads, no tracking across sites.
        </p>
        <button
          onClick={accept}
          className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/20"
        >
          Got it
        </button>
        <button
          aria-label="Dismiss cookie notice"
          onClick={accept}
          className="rounded-md p-1 text-zinc-400 transition hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
