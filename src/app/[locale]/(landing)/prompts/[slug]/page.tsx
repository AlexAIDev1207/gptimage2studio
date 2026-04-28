import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { Link } from '@/core/i18n/navigation';
import { promptCards } from '@/shared/blocks/gptimage2studio/content';
import { GptImageStudioSiteFooter } from '@/shared/blocks/gptimage2studio/site-footer';
import { GptImageStudioSiteHeader } from '@/shared/blocks/gptimage2studio/site-header';

type PromptPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

function getPrompt(slug: string) {
  return promptCards.find((card) => card.href === `/prompts/${slug}`);
}

export async function generateMetadata({
  params,
}: PromptPageProps): Promise<Metadata> {
  const { slug } = await params;
  const prompt = getPrompt(slug);

  if (!prompt) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${prompt.title} | GPT Image 2 Studio`,
    description: prompt.prompt,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function PromptDetailPage({ params }: PromptPageProps) {
  const { slug } = await params;
  const prompt = getPrompt(slug);

  if (!prompt) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#07080B] dark:text-white">
      <GptImageStudioSiteHeader />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] md:px-8 md:py-16">
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_24px_70px_-52px_rgba(15,23,42,0.24)] dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
          <Image
            src={prompt.image}
            alt={prompt.title}
            width={1400}
            height={1800}
            priority
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <Link
            href="/#prompts"
            className="mb-8 inline-flex w-fit items-center rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Back to prompts
          </Link>

          <p className="text-xs font-semibold tracking-[0.24em] text-cyan-700 uppercase dark:text-cyan-300">
            {prompt.category}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            {prompt.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-zinc-300">
            {prompt.prompt}
          </p>

          <div className="mt-8 rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_22px_60px_-44px_rgba(15,23,42,0.22)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-zinc-500">
              Prompt
            </p>
            <p className="mt-3 text-sm leading-7 whitespace-pre-wrap text-slate-700 dark:text-zinc-100">
              {prompt.fullPrompt}
            </p>
          </div>
        </div>
      </section>
      <GptImageStudioSiteFooter />
    </main>
  );
}
