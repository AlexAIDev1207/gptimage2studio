'use client';

import { Moon, SunDim } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';

import { cn } from '@/shared/lib/utils';

type props = {
  className?: string;
};

export const AnimatedThemeToggler = ({ className }: props) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const isDarkMode = resolvedTheme === 'dark';

  const changeTheme = async () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    const documentWithTransition = document as Document & {
      startViewTransition?: (callback: () => void) => {
        ready: Promise<void>;
      };
    };

    if (
      !buttonRef.current ||
      typeof documentWithTransition.startViewTransition !== 'function'
    ) {
      setTheme(nextTheme);
      return;
    }

    const transition = documentWithTransition.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    await transition.ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };
  if (!mounted) {
    return null;
  }

  return (
    <button
      ref={buttonRef}
      onClick={changeTheme}
      className={cn(className)}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <SunDim /> : <Moon />}
    </button>
  );
};
