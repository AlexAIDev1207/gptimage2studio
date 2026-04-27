import PromptsListPageClient from '@/shared/blocks/gptimage2studio/prompts-list-page';

export const metadata = {
  title: 'Prompts Library | GPT Image 2 Studio',
  description:
    'Browse the GPT Image 2 Studio prompt library — product photos, posters, social ads, UI mockups, infographics, and more. Click any card to see the full prompt and load it into the workbench.',
};

export default function PromptsListPage() {
  return <PromptsListPageClient />;
}
