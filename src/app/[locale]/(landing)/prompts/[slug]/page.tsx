import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { promptCards } from '@/shared/blocks/gptimage2studio/content';

type PromptPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

function getPrompt(slug: string) {
  return promptCards.find((card) => card.href === `/prompts/${slug}`);
}

export async function generateMetadata({ params }: PromptPageProps) {
  const { slug } = await params;
  const prompt = getPrompt(slug);

  if (!prompt) {
    return {};
  }

  return {
    title: `${prompt.title} | GPT Image 2 Studio`,
    description: prompt.prompt,
  };
}

export default async function PromptDetailPage({ params }: PromptPageProps) {
  const { slug } = await params;
  const prompt = getPrompt(slug);

  if (!prompt) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#07080B] text-white">
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] md:px-8 md:py-16">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
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
            className="mb-8 inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            Back to prompts
          </Link>

          <p className="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
            {prompt.category}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            {prompt.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            {prompt.prompt}
          </p>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">
              Prompt
            </p>
            <p className="mt-3 text-sm leading-7 whitespace-pre-wrap text-zinc-100">
              {prompt.fullPrompt}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
