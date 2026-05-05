import { Sparkles } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

import { footer } from './content';

const footerLinkHrefs: Record<string, string> = {
  Generator: '/#workbench',
  Prompts: '/gpt-image-2-prompts',
  Blog: '/blog',
  Pricing: '/pricing',
  'Privacy Policy': '/privacy-policy',
  'Terms of Service': '/terms-of-service',
  'Refund Policy': '/refund-policy',
};

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item}>
            <Link
              href={footerLinkHrefs[item] ?? '/'}
              className="text-zinc-400 transition hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:outline-none"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GptImageStudioSiteFooter() {
  return (
    <footer className="bg-[#09090B]">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 text-zinc-950">
                <Sparkles className="size-4" />
              </span>
              <span className="text-base font-semibold text-white">
                {footer.brand}
              </span>
            </div>
            <p className="mt-4 text-sm text-zinc-400">{footer.description}</p>
            <p className="mt-4 text-sm text-zinc-400">
              Contact:{' '}
              <a
                href={`mailto:${footer.contact}`}
                className="text-zinc-300 transition hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:outline-none"
              >
                {footer.contact}
              </a>
            </p>
          </div>
          <FooterColumn title="Product" items={footer.product} />
          <FooterColumn title="Legal" items={footer.legal} />
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/5 pt-6 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <span>{footer.disclaimer}</span>
          <span>
            © {new Date().getFullYear()} {footer.brand}
          </span>
        </div>
      </div>
    </footer>
  );
}
