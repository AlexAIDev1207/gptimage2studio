import { revalidateTag, unstable_cache } from 'next/cache';

import { db } from '@/core/db';
import { envConfigs } from '@/config';
import { config } from '@/config/db/schema';
import { isCloudflareWorker } from '@/shared/lib/env';
import {
  getAllSettingNames,
  publicSettingNames,
} from '@/shared/services/settings';

export type Config = typeof config.$inferSelect;
export type NewConfig = typeof config.$inferInsert;
export type UpdateConfig = Partial<Omit<NewConfig, 'name'>>;

export type Configs = Record<string, string>;

export const CACHE_TAG_CONFIGS = 'configs';

export async function saveConfigs(configs: Record<string, string>) {
  const dbi = db();
  const entries = Object.entries(configs);
  if (entries.length === 0) return [];

  // D1 doesn't support BEGIN/COMMIT transactions — use db.batch (atomic).
  const stmts = entries.map(([name, configValue]) =>
    dbi
      .insert(config)
      .values({ name, value: configValue })
      .onConflictDoUpdate({
        target: config.name,
        set: { value: configValue },
      })
  );

  await dbi.batch(stmts);

  revalidateTag(CACHE_TAG_CONFIGS);

  // Read back to keep return shape compatible with previous .returning() result.
  const result = await dbi.select().from(config);
  return result.filter((row: any) =>
    entries.some(([name]) => name === row.name)
  );
}

export async function addConfig(newConfig: NewConfig) {
  const [result] = await db().insert(config).values(newConfig).returning();
  revalidateTag(CACHE_TAG_CONFIGS);

  return result;
}

export const getConfigs = unstable_cache(
  async (): Promise<Configs> => {
    const configs: Record<string, string> = {};

    // D1 is only available inside Cloudflare Workers runtime (not during build)
    if (envConfigs.database_provider === 'd1' && !isCloudflareWorker) {
      return configs;
    }
    if (!envConfigs.database_url && envConfigs.database_provider !== 'd1') {
      return configs;
    }

    const result = await db().select().from(config);
    if (!result) {
      return configs;
    }

    for (const config of result) {
      configs[config.name] = config.value ?? '';
    }

    return configs;
  },
  ['configs'],
  {
    revalidate: 3600,
    tags: [CACHE_TAG_CONFIGS],
  }
);

export async function getAllConfigs(): Promise<Configs> {
  let dbConfigs: Configs = {};

  // only get configs from db in server side
  const hasDb = envConfigs.database_url || (envConfigs.database_provider === 'd1' && isCloudflareWorker);
  if (typeof window === 'undefined' && hasDb) {
    try {
      dbConfigs = await getConfigs();
    } catch (e) {
      console.log(`get configs from db failed:`, e);
      dbConfigs = {};
    }
  }

  const settingNames = await getAllSettingNames();
  settingNames.forEach((key) => {
    const upperKey = key.toUpperCase();
    // use env configs if available
    if (process.env[upperKey]) {
      dbConfigs[key] = process.env[upperKey] ?? '';
    } else if (process.env[key]) {
      dbConfigs[key] = process.env[key] ?? '';
    }
  });

  const configs = {
    ...envConfigs,
    ...dbConfigs,
  };

  return configs;
}

export async function getPublicConfigs(): Promise<Configs> {
  let allConfigs = await getAllConfigs();

  const publicConfigs: Record<string, string> = {};

  // get public configs
  for (const key in allConfigs) {
    if (publicSettingNames.includes(key)) {
      publicConfigs[key] = String(allConfigs[key]);
    }
  }

  const configs = {
    ...publicConfigs,
  };

  return configs;
}
