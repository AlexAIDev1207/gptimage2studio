# Drizzle schema snippets for `image_asset`

Add the matching snippet to the active schema file(s) in `src/config/db/`. The project imports `imageAsset` from `@/config/db/schema`, so the active schema export must include `export const imageAsset = ...`.

This Kie-oriented version stores both URLs:

- `imageUrl`: the current display URL. It is initially the Kie provider URL, then becomes the R2 URL after mirroring.
- `sourceUrl`: the original provider URL, kept for idempotent sync and audit.
- `storageStatus`: `external`, `mirroring`, `stored`, or `failed`.

## PostgreSQL: `src/config/db/schema.postgres.ts`

```ts
export const imageAsset = table(
  'image_asset',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    aiTaskId: text('ai_task_id').references(() => aiTask.id, { onDelete: 'set null' }),
    source: text('source').notNull().default('ai-output'),
    provider: text('provider'),
    model: text('model'),
    prompt: text('prompt'),
    imageUrl: text('image_url').notNull(),
    sourceUrl: text('source_url'),
    storageProvider: text('storage_provider').notNull().default('r2'),
    storageBucket: text('storage_bucket'),
    storageKey: text('storage_key'),
    storageStatus: text('storage_status').notNull().default('external'),
    storageError: text('storage_error'),
    mimeType: text('mime_type'),
    width: integer('width'),
    height: integer('height'),
    sizeBytes: integer('size_bytes'),
    visibility: text('visibility').notNull().default('private'),
    status: text('status').notNull().default('active'),
    metadata: text('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('idx_image_asset_user_status_created').on(table.userId, table.status, table.createdAt),
    index('idx_image_asset_user_source').on(table.userId, table.source),
    index('idx_image_asset_ai_task').on(table.aiTaskId),
    uniqueIndex('idx_image_asset_user_source_url').on(table.userId, table.sourceUrl),
    index('idx_image_asset_storage_status').on(table.storageStatus),
  ]
);
```

## SQLite / D1: `src/config/db/schema.sqlite.ts`

```ts
export const imageAsset = table(
  'image_asset',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    aiTaskId: text('ai_task_id').references(() => aiTask.id, { onDelete: 'set null' }),
    source: text('source').notNull().default('ai-output'),
    provider: text('provider'),
    model: text('model'),
    prompt: text('prompt'),
    imageUrl: text('image_url').notNull(),
    sourceUrl: text('source_url'),
    storageProvider: text('storage_provider').notNull().default('r2'),
    storageBucket: text('storage_bucket'),
    storageKey: text('storage_key'),
    storageStatus: text('storage_status').notNull().default('external'),
    storageError: text('storage_error'),
    mimeType: text('mime_type'),
    width: integer('width'),
    height: integer('height'),
    sizeBytes: integer('size_bytes'),
    visibility: text('visibility').notNull().default('private'),
    status: text('status').notNull().default('active'),
    metadata: text('metadata'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sqliteNowMs).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(sqliteNowMs).$onUpdate(() => new Date()).notNull(),
    deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
  },
  (table) => [
    index('idx_image_asset_user_status_created').on(table.userId, table.status, table.createdAt),
    index('idx_image_asset_user_source').on(table.userId, table.source),
    index('idx_image_asset_ai_task').on(table.aiTaskId),
    uniqueIndex('idx_image_asset_user_source_url').on(table.userId, table.sourceUrl),
    index('idx_image_asset_storage_status').on(table.storageStatus),
  ]
);
```

## MySQL: `src/config/db/schema.mysql.ts`

Use the same camelCase field names, with `mysqlTable`, `varchar`, `text`, `int`, `timestamp`, and matching indexes. Avoid a normal unique index on `source_url` if it is stored as `text`; use a bounded `varchar(2048)` or a separate hash column when you need uniqueness in MySQL.
