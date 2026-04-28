import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { getRequestConfig } from 'next-intl/server';

import {
  defaultLocale,
  localeMessagesPaths,
} from '@/config/locale';

import { routing } from './config';

function getLocaleMessageFile(locale: string, messagePath: string) {
  return path.join(
    process.cwd(),
    'src',
    'config',
    'locale',
    'messages',
    locale,
    `${messagePath}.json`
  );
}

async function readLocaleMessageFile(locale: string, messagePath: string) {
  try {
    const file = getLocaleMessageFile(locale, messagePath);
    return JSON.parse(await readFile(file, 'utf-8'));
  } catch {
    return null;
  }
}

export async function loadMessages(
  messagePath: string,
  locale: string = defaultLocale
) {
  const localizedMessages = await readLocaleMessageFile(locale, messagePath);
  if (localizedMessages) {
    return localizedMessages;
  }

  if (locale !== defaultLocale) {
    try {
      const fallbackMessages = await readLocaleMessageFile(
        defaultLocale,
        messagePath
      );
      if (fallbackMessages) {
        return fallbackMessages;
      }
    } catch {
      return {};
    }
  }

  return {};
}

async function buildLocaleMessages(locale: string) {
  const allMessages = await Promise.all(
    localeMessagesPaths.map((messagePath) => loadMessages(messagePath, locale))
  );

  const messages: Record<string, any> = {};

  localeMessagesPaths.forEach((messagePath, index) => {
    const localMessages = allMessages[index];
    const keys = messagePath.split('/');
    let current = messages;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = localMessages;
  });

  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as string)) {
    locale = routing.defaultLocale;
  }

  try {
    return {
      locale,
      messages: await buildLocaleMessages(locale),
    };
  } catch {
    return {
      locale: defaultLocale,
      messages: await buildLocaleMessages(defaultLocale),
    };
  }
});
