import { md5, getUuid } from '@/shared/lib/hash';
import { respData, respErr } from '@/shared/lib/resp';
import {
  createImageAsset,
  findImageAssetByUrl,
  ImageAssetSource,
  ImageAssetStatus,
  ImageAssetStorageStatus,
  ImageAssetVisibility,
} from '@/shared/models/image_asset';
import { getUserInfo } from '@/shared/models/user';
import { getStorageService } from '@/shared/services/storage';

const extFromMime = (mimeType: string) => {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
    'image/heic': 'heic',
    'image/heif': 'heif',
  };

  return map[mimeType] || '';
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return respErr('No files provided');
    }

    const storageService = await getStorageService();
    const user = await getUserInfo().catch(() => null);
    const uploadResults = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return respErr(`File ${file.name} is not an image`);
      }

      const arrayBuffer = await file.arrayBuffer();
      const body = new Uint8Array(arrayBuffer);
      const digest = md5(body);
      const ext = extFromMime(file.type) || file.name.split('.').pop() || 'bin';
      const userFolder = user?.id || 'anonymous';
      const key = `${userFolder}/${digest}.${ext}`;

      const exists = await storageService.exists({ key });
      if (exists) {
        const publicUrl = storageService.getPublicUrl({ key });
        if (publicUrl) {
          uploadResults.push({
            url: publicUrl,
            key,
            filename: file.name,
            deduped: true,
          });

          if (user?.id) {
            const existingAsset = await findImageAssetByUrl({
              userId: user.id,
              imageUrl: publicUrl,
            });

            if (!existingAsset) {
              await createImageAsset({
                id: getUuid(),
                userId: user.id,
                aiTaskId: null,
                source: ImageAssetSource.UPLOAD,
                provider: null,
                model: null,
                prompt: null,
                imageUrl: publicUrl,
                sourceUrl: publicUrl,
                storageProvider: 'r2',
                storageBucket: null,
                storageKey: key,
                storageStatus: ImageAssetStorageStatus.STORED,
                storageError: null,
                mimeType: file.type,
                width: null,
                height: null,
                sizeBytes: file.size,
                visibility: ImageAssetVisibility.PRIVATE,
                status: ImageAssetStatus.ACTIVE,
                metadata: JSON.stringify({
                  originalFilename: file.name,
                  digest,
                  deduped: true,
                }),
              });
            }
          }

          continue;
        }
      }

      const result = await storageService.uploadFile({
        body,
        key,
        contentType: file.type,
        disposition: 'inline',
      });

      if (!result.success) {
        console.error('[API] Upload failed:', result.error);
        return respErr(result.error || 'Upload failed');
      }

      uploadResults.push({
        url: result.url,
        key: result.key,
        filename: file.name,
        deduped: false,
      });

      if (user?.id && result.url) {
        const existingAsset = await findImageAssetByUrl({
          userId: user.id,
          imageUrl: result.url,
        });

        if (!existingAsset) {
          await createImageAsset({
            id: getUuid(),
            userId: user.id,
            aiTaskId: null,
            source: ImageAssetSource.UPLOAD,
            provider: null,
            model: null,
            prompt: null,
            imageUrl: result.url,
            sourceUrl: result.url,
            storageProvider: result.provider,
            storageBucket: result.bucket || null,
            storageKey: result.key || key,
            storageStatus: ImageAssetStorageStatus.STORED,
            storageError: null,
            mimeType: file.type,
            width: null,
            height: null,
            sizeBytes: file.size,
            visibility: ImageAssetVisibility.PRIVATE,
            status: ImageAssetStatus.ACTIVE,
            metadata: JSON.stringify({
              originalFilename: file.name,
              digest,
              uploadPath: result.uploadPath,
            }),
          });
        }
      }
    }

    return respData({
      urls: uploadResults.map((r) => r.url),
      results: uploadResults,
    });
  } catch (e) {
    console.error('upload image failed:', e);
    return respErr('upload image failed');
  }
}
