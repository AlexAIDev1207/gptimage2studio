import { ArrowRight, Sparkles } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

const navItems = [
  { label: 'Generator', href: '/#workbench' },
  { label: 'Prompts', href: '/prompts' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/#pricing' },
];

export function BlogShellHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#09090B]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 text-zinc-950 shadow-lg shadow-cyan-500/20">
            <Sparkles className="size-4" />
          </span>
          <span className="truncate text-sm font-semibold text-white sm:text-base">
            GPT Image 2 Studio
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-zinc-400 transition hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:outline-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#workbench"
          className="inline-flex h-9 items-center gap-2 rounded-md bg-white px-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:outline-none"
        >
          Start
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </header>
  );
}

export function BlogShellFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#09090B]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-semibold text-white">GPT Image 2 Studio</p>
          <p className="mt-2 max-w-xl">
            Prompt-first AI image workflows for product photos, posters, ads,
            infographics, UI mockups, and text-rich visuals.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:outline-none"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
