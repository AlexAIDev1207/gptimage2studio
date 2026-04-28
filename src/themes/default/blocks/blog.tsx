import { ArrowRight, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/core/i18n/navigation';
import { Tabs } from '@/shared/blocks/common/tabs';
import { cn } from '@/shared/lib/utils';
import {
  Category as CategoryType,
  Post as PostType,
} from '@/shared/types/blocks/blog';
import { Tab } from '@/shared/types/blocks/common';
import { Section } from '@/shared/types/blocks/landing';

import { BlogShellFooter, BlogShellHeader } from './blog-shell';

export function Blog({
  section,
  className,
  categories,
  currentCategory,
  posts,
}: {
  section: Section;
  className?: string;
  categories: CategoryType[];
  currentCategory: CategoryType;
  posts: PostType[];
}) {
  const t = useTranslations('pages.blog.messages');
  const tabs: Tab[] = [];
  categories?.map((category: CategoryType) => {
    tabs.push({
      name: category.slug,
      title: category.title,
      url:
        !category.slug || category.slug === 'all'
          ? '/blog'
          : `/blog/category/${category.slug}`,
      is_active: currentCategory?.slug == category.slug,
    });
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-cyan-400/30 selection:text-white dark:bg-[#09090B] dark:text-zinc-200">
      <BlogShellHeader />
      <section
        id={section.id}
        className={cn(
          'relative overflow-hidden px-4 py-20 md:px-8 md:py-28',
          section.className,
          className
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent dark:via-cyan-300/40" />
        <div className="mx-auto mb-12 max-w-4xl text-center">
          {section.sr_only_title && (
            <h1 className="sr-only">{section.sr_only_title}</h1>
          )}
          <span className="mb-5 inline-flex items-center rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-normal text-emerald-700 uppercase dark:border-white/10 dark:bg-white/5 dark:text-emerald-300">
            Creator guides
          </span>
          <h2 className="mb-5 text-4xl font-semibold text-pretty text-slate-950 dark:text-white md:text-5xl">
            {section.title}
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 dark:text-zinc-400 md:text-lg">
            {section.description}
          </p>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8">
          {categories && categories.length > 1 && (
            <div className="mb-2 flex flex-wrap items-center justify-center gap-4">
              <Tabs tabs={tabs} />
            </div>
          )}

          {posts && posts.length > 0 ? (
            <div className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-3">
              {posts?.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.url || ''}
                  target={item.target || '_self'}
                  className="group block min-w-0 rounded-lg focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:outline-none"
                >
                  <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_22px_60px_-46px_rgba(15,23,42,0.28)] transition duration-200 group-hover:-translate-y-1 group-hover:border-cyan-300/60 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-xl dark:shadow-black/20 dark:group-hover:border-cyan-300/30 dark:group-hover:bg-white/[0.06]">
                    {item.image && (
                      <div className="border-b border-slate-200/80 bg-slate-50 dark:border-white/10 dark:bg-white/5">
                        <img
                          src={item.image}
                          alt={item.title || ''}
                          className="aspect-video h-full w-full object-cover object-center"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500">
                        {item.created_at && (
                          <span className="inline-flex items-center gap-2">
                            <Calendar className="size-4" />
                            {item.created_at}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl leading-snug font-semibold text-pretty text-slate-950 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 line-clamp-4 flex-1 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                        {item.description}
                      </p>

                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                        Read guide
                        <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-md py-8 text-slate-600 dark:text-zinc-400">
              {t('no_content')}
            </div>
          )}
        </div>
      </section>
      <BlogShellFooter />
    </div>
  );
}
