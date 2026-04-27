import { and, count, desc, eq } from 'drizzle-orm';

import { imageAsset } from '@/config/db/schema';
import { db } from '@/core/db';
import { getUuid } from '@/shared/lib/hash';
import { getStorageService } from '@/shared/services/storage';

export enum ImageAssetSource {
  UPLOAD = 'upload',
  AI_OUTPUT = 'ai-output',
}

export enum ImageAssetStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
}

export enum ImageAssetVisibility {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export enum ImageAssetStorageStatus {
  EXTERNAL = 'external',
  MIRRORING = 'mirroring',
  STORED = 'stored',
  FAILED = 'failed',
}

export type ImageAsset = typeof imageAsset.$inferSelect;
export type NewImageAsset = typeof imageAsset.$inferInsert;
export type UpdateImageAsset = Partial<NewImageAsset>;

function safeJSONParse<T = any>(value: unknown): T | null {
  if (!value) return null;
  if (typeof value === 'object') return value as T;
  if (typeof value !== 'string') return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function normalizeImageUrl(item: any): string | undefined {
  if (!item) return undefined;
  if (typeof item === 'string') return item;
  if (typeof item !== 'object') return undefined;

  return (
    item.imageUrl ||
    item.providerUrl ||
    item.url ||
    item.uri ||
    item.image ||
    item.src ||
    undefined
  );
}

function normalizeSourceUrl(item: any): string | undefined {
  if (!item) return undefined;
  if (typeof item === 'string') return item;
  if (typeof item !== 'object') return undefined;

  return item.providerUrl || item.sourceUrl || item.imageUrl || item.url || item.uri || item.image || item.src;
}

function guessImageContentType(url?: string, fallback?: string | null) {
  if (fallback) return fallback;
  const cleanUrl = (url || '').split('?')[0].toLowerCase();
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'image/jpeg';
  if (cleanUrl.endsWith('.webp')) return 'image/webp';
  return 'image/png';
}

function extFromContentType(contentType: string) {
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg';
  if (contentType.includes('webp')) return 'webp';
  return 'png';
}

function datePath(date = new Date()) {
  return date.toISOString().slice(0, 10).replace(/-/g, '/');
}

export async function createImageAsset(newImageAsset: NewImageAsset) {
  const [result] = await db()
    .insert(imageAsset)
    .values(newImageAsset)
    .returning();

  return result;
}

export async function updateImageAssetById(id: string, updateImageAsset: UpdateImageAsset) {
  const [result] = await db()
    .update(imageAsset)
    .set(updateImageAsset)
    .where(eq(imageAsset.id, id))
    .returning();

  return result;
}

export async function findImageAssetByUrl({
  userId,
  imageUrl,
}: {
  userId: string;
  imageUrl: string;
}) {
  const [result] = await db()
    .select()
    .from(imageAsset)
    .where(and(eq(imageAsset.userId, userId), eq(imageAsset.imageUrl, imageUrl)))
    .limit(1);

  return result;
}

export async function findImageAssetBySourceUrl({
  userId,
  sourceUrl,
}: {
  userId: string;
  sourceUrl: string;
}) {
  const [result] = await db()
    .select()
    .from(imageAsset)
    .where(and(eq(imageAsset.userId, userId), eq(imageAsset.sourceUrl, sourceUrl)))
    .limit(1);

  return result;
}

export async function getImageAssetsByAITaskId({
  aiTaskId,
  userId,
}: {
  aiTaskId: string;
  userId?: string;
}) {
  return db()
    .select()
    .from(imageAsset)
    .where(
      and(
        eq(imageAsset.aiTaskId, aiTaskId),
        userId ? eq(imageAsset.userId, userId) : undefined,
        eq(imageAsset.status, ImageAssetStatus.ACTIVE)
      )
    );
}

export async function getUserImageAssets({
  userId,
  page = 1,
  limit = 30,
  source,
  status = ImageAssetStatus.ACTIVE,
}: {
  userId: string;
  page?: number;
  limit?: number;
  source?: string;
  status?: string;
}) {
  const where = and(
    eq(imageAsset.userId, userId),
    eq(imageAsset.status, status),
    source ? eq(imageAsset.source, source) : undefined
  );

  return db()
    .select()
    .from(imageAsset)
    .where(where)
    .orderBy(desc(imageAsset.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);
}

export async function getUserImageAssetsCount({
  userId,
  source,
  status = ImageAssetStatus.ACTIVE,
}: {
  userId: string;
  source?: string;
  status?: string;
}) {
  const [result] = await db()
    .select({ count: count() })
    .from(imageAsset)
    .where(
      and(
        eq(imageAsset.userId, userId),
        eq(imageAsset.status, status),
        source ? eq(imageAsset.source, source) : undefined
      )
    );

  return result?.count || 0;
}

export async function syncImageAssetsFromAITask(task: {
  id: string;
  userId: string;
  taskId?: string | null;
  taskInfo?: string | null;
  options?: string | null;
  provider: string;
  model: string;
  prompt: string | null;
}) {
  if (!task?.id || !task.userId || !task.taskInfo) return [];

  const taskInfo = safeJSONParse<any>(task.taskInfo);
  const images = Array.isArray(taskInfo?.images) ? taskInfo.images : [];
  if (images.length === 0) return [];

  const createdOrExisting: ImageAsset[] = [];

  for (const image of images) {
    const imageUrl = normalizeImageUrl(image);
    const sourceUrl = normalizeSourceUrl(image) || imageUrl;
    if (!imageUrl || imageUrl.startsWith('data:')) continue;

    const existing = sourceUrl
      ? await findImageAssetBySourceUrl({ userId: task.userId, sourceUrl })
      : await findImageAssetByUrl({ userId: task.userId, imageUrl });

    if (existing) {
      createdOrExisting.push(existing);
      continue;
    }

    const metadata = {
      providerTaskId: task.taskId,
      taskInfoImage: image,
      options: safeJSONParse(task.options),
    };

    const asset = await createImageAsset({
      id: getUuid(),
      userId: task.userId,
      aiTaskId: task.id,
      source: ImageAssetSource.AI_OUTPUT,
      provider: task.provider,
      model: task.model,
      prompt: task.prompt,
      imageUrl,
      sourceUrl,
      storageProvider: task.provider === 'kie' ? 'external' : 'r2',
      storageBucket: null,
      storageKey: typeof image === 'object' ? image.key || null : null,
      storageStatus: task.provider === 'kie' ? ImageAssetStorageStatus.EXTERNAL : ImageAssetStorageStatus.STORED,
      storageError: null,
      mimeType: typeof image === 'object' ? image.contentType || null : null,
      width: typeof image === 'object' ? image.width || null : null,
      height: typeof image === 'object' ? image.height || null : null,
      sizeBytes: typeof image === 'object' ? image.sizeBytes || null : null,
      visibility: ImageAssetVisibility.PRIVATE,
      status: ImageAssetStatus.ACTIVE,
      metadata: JSON.stringify(metadata),
    });

    createdOrExisting.push(asset);
  }

  return createdOrExisting;
}

export async function mirrorImageAssetToR2(asset: ImageAsset) {
  if (!asset?.id) return null;
  if (asset.storageStatus === ImageAssetStorageStatus.STORED && asset.storageKey) return asset;

  const sourceUrl = asset.sourceUrl || asset.imageUrl;
  if (!sourceUrl) {
    return updateImageAssetById(asset.id, {
      storageStatus: ImageAssetStorageStatus.FAILED,
      storageError: 'missing source url',
    } as UpdateImageAsset);
  }

  await updateImageAssetById(asset.id, {
    storageStatus: ImageAssetStorageStatus.MIRRORING,
    storageError: null,
  } as UpdateImageAsset);

  const contentType = guessImageContentType(sourceUrl, asset.mimeType);
  const ext = extFromContentType(contentType);
  const key = `kie/gpt-image-2/${datePath()}/${asset.id}.${ext}`;

  try {
    const storageService = await getStorageService();
    const uploaded = await storageService.downloadAndUpload({
      url: sourceUrl,
      key,
      contentType,
      disposition: 'inline',
    });

    if (!uploaded.success || !uploaded.url) {
      throw new Error(uploaded.error || 'R2 upload failed');
    }

    return updateImageAssetById(asset.id, {
      imageUrl: uploaded.url,
      storageProvider: uploaded.provider || 'r2',
      storageBucket: uploaded.bucket || null,
      storageKey: uploaded.key || key,
      storageStatus: ImageAssetStorageStatus.STORED,
      storageError: null,
      mimeType: contentType,
    } as UpdateImageAsset);
  } catch (error: any) {
    return updateImageAssetById(asset.id, {
      storageStatus: ImageAssetStorageStatus.FAILED,
      storageError: error?.message || 'R2 mirror failed',
    } as UpdateImageAsset);
  }
}

export async function mirrorImageAssetsForTask({
  aiTaskId,
  userId,
}: {
  aiTaskId: string;
  userId?: string;
}) {
  const assets = await getImageAssetsByAITaskId({ aiTaskId, userId });
  const mirrored: ImageAsset[] = [];

  for (const asset of assets) {
    if (asset.storageStatus === ImageAssetStorageStatus.STORED && asset.storageKey) {
      mirrored.push(asset);
      continue;
    }

    const result = await mirrorImageAssetToR2(asset);
    if (result) mirrored.push(result);
  }

  return mirrored;
}
