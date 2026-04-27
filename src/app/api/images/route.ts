import { respData, respErr } from '@/shared/lib/resp';
import {
  getUserImageAssets,
  getUserImageAssetsCount,
  ImageAssetStatus,
} from '@/shared/models/image_asset';
import { getUserInfo } from '@/shared/models/user';

export async function GET(req: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') || '1');
    const limit = Math.min(Number(searchParams.get('limit') || '30'), 100);
    const source = searchParams.get('source') || undefined;

    const [items, total] = await Promise.all([
      getUserImageAssets({
        userId: user.id,
        page,
        limit,
        source,
        status: ImageAssetStatus.ACTIVE,
      }),
      getUserImageAssetsCount({
        userId: user.id,
        source,
        status: ImageAssetStatus.ACTIVE,
      }),
    ]);

    return respData({
      items,
      total,
      page,
      limit,
    });
  } catch (e: any) {
    console.log('get image assets failed:', e);
    return respErr(e.message || 'get image assets failed');
  }
}
