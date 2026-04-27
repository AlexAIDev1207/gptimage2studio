'use client';

import { TOCItems, TOCProvider } from 'fumadocs-ui/components/layout/toc';
import { CalendarIcon, ListIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { MarkdownPreview } from '@/shared/blocks/common';
import { Crumb } from '@/shared/blocks/common/crumb';
import { type Post as PostType } from '@/shared/types/blocks/blog';
import { NavItem } from '@/shared/types/blocks/common';

import '@/config/style/docs.css';

import { BlogShellFooter, BlogShellHeader } from './blog-shell';

export function BlogDetail({ post }: { post: PostType }) {
  const t = useTranslations('pages.blog.messages');

  const crumbItems: NavItem[] = [
    {
      title: t('crumb'),
      url: '/blog',
      icon: 'Newspaper',
      is_active: false,
    },
    {
      title: post.title || '',
      url: `/blog/${post.slug}`,
      is_active: true,
    },
  ];

  // Check if TOC should be shown
  const showToc = post.toc && post.toc.length > 0;

  // Calculate main content column span based on what sidebars are shown
  const getMainColSpan = () => {
    if (showToc) return 'lg:col-span-9';
    return 'lg:col-span-12';
  };

  return (
    <TOCProvider toc={post.toc || []}>
      <div className="dark min-h-screen bg-[#09090B] text-zinc-200 antialiased selection:bg-cyan-400/30 selection:text-white">
        <BlogShellHeader />
        <section id={post.id}>
          <div className="py-16 md:py-24">
            <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
              <Crumb items={crumbItems} />

              {/* Header Section */}
              <div className="mt-14 text-center">
                <span className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-normal text-emerald-300 uppercase">
                  GPT Image 2 guide
                </span>
                <h1 className="mx-auto mb-5 w-full max-w-4xl text-3xl leading-tight font-semibold text-pretty text-white md:text-5xl">
                  {post.title}
                </h1>
                <div className="mb-8 flex items-center justify-center gap-4 text-sm text-zinc-500">
                  {post.created_at && (
                    <div className="flex items-center justify-center gap-2">
                      <CalendarIcon className="size-4" /> {post.created_at}
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 gap-8 md:mt-12 lg:grid-cols-12">
                {/* Table of Contents - Left Sidebar */}
                {showToc && (
                  <div className="lg:col-span-3">
                    <div className="sticky top-24 hidden md:block">
                      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                        <h2 className="mb-4 flex items-center gap-2 font-semibold text-white">
                          <ListIcon className="size-4" /> {t('toc')}
                        </h2>
                        <TOCItems />
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Content - Center */}
                <div className={getMainColSpan()}>
                  <article className="rounded-lg border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/20 md:p-8">
                    {post.body ? (
                      <div className="docs text-md space-y-5 font-normal text-zinc-300 *:leading-relaxed [&_a]:text-cyan-300 [&_a]:underline-offset-4 [&_a:hover]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-cyan-300/50 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-400 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-cyan-100 [&_h2]:mt-12 [&_h2]:border-t [&_h2]:border-white/10 [&_h2]:pt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_img]:my-8 [&_img]:aspect-video [&_img]:w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-white/10 [&_img]:object-cover [&_li]:text-zinc-300 [&_p]:text-zinc-300 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-black/40 [&_strong]:text-white [&_table]:text-sm">
                        {post.body}
                      </div>
                    ) : (
                      post.content && (
                        <div className="prose prose-invert prose-lg max-w-none space-y-6 *:leading-relaxed">
                          <MarkdownPreview content={post.content} />
                        </div>
                      )
                    )}
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>
        <BlogShellFooter />
      </div>
    </TOCProvider>
  );
}
