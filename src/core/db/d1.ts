import { drizzle } from 'drizzle-orm/d1';

// Minimal D1Database type to avoid pulling in @cloudflare/workers-types globally,
// which overrides built-in types like Response.json() and breaks non-Workers code.
type D1Database = {
  prepare(query: string): any;
  batch(statements: any[]): Promise<any[]>;
  exec(query: string): Promise<any>;
  dump(): Promise<ArrayBuffer>;
};

// D1 singleton instance (reused across requests in the same isolate)
let d1DbInstance: ReturnType<typeof drizzle> | null = null;

/**
 * Get the D1 database binding from Cloudflare Workers environment.
 *
 * Uses `getCloudflareContext()` from @opennextjs/cloudflare to access
 * env bindings declared in wrangler.toml ([[d1_databases]] binding="DB").
 *
 * During build/static rendering this will throw — callers should
 * handle the error gracefully (e.g. config.ts already catches it).
 */
function getD1Binding(): D1Database {
  // Lazy require to avoid bundling the OpenNext context module into routes
  // that never reach D1 (sitemap, robots, static pages).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getCloudflareContext } = require('@opennextjs/cloudflare');
  const ctx = getCloudflareContext();
  const binding = (ctx?.env as any)?.DB as D1Database | undefined;
  if (!binding) {
    throw new Error(
      'D1 binding "DB" not found on Cloudflare context (check wrangler.toml [[d1_databases]] binding="DB").'
    );
  }
  return binding;
}

export function getD1Db() {
  if (d1DbInstance) return d1DbInstance;

  const binding = getD1Binding();
  d1DbInstance = drizzle(binding);
  return d1DbInstance;
}
