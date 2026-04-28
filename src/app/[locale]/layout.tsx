import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { routing } from '@/core/i18n/config';
import { ThemeProvider } from '@/core/theme/provider';
import CookieConsent from '@/shared/components/analytics/cookie-consent';
import GA4 from '@/shared/components/analytics/ga4';
import { Toaster } from '@/shared/components/ui/sonner';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata();

type Messages = Record<string, any>;

function pickClientMessages(messages: Messages) {
  const picked: Messages = {};

  if (messages.common) {
    picked.common = messages.common;
  }

  if (messages.pages) {
    picked.pages = {};
    if (messages.pages.blog?.messages) {
      picked.pages.blog = { messages: messages.pages.blog.messages };
    }
    if (messages.pages.pricing?.messages) {
      picked.pages.pricing = { messages: messages.pages.pricing.messages };
    }
  }

  if (messages.ai) {
    picked.ai = {};
    for (const namespace of ['chat', 'image', 'video', 'music']) {
      if (messages.ai[namespace]) {
        picked.ai[namespace] = messages.ai[namespace];
      }
    }
  }

  return picked;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const clientMessages = pickClientMessages(await getMessages());

  return (
    <NextIntlClientProvider messages={clientMessages}>
      <ThemeProvider>
        {children}
        <CookieConsent />
        <GA4 />
        <Toaster position="top-center" richColors />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
