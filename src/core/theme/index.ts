import { envConfigs } from '@/config';
import { defaultTheme } from '@/config/theme';

type ThemeModule = Record<string, any>;
type ThemeLoader = () => Promise<ThemeModule>;

const themePageLoaders: Record<string, Record<string, ThemeLoader>> = {
  default: {
    'dynamic-page': () => import('@/themes/default/pages/dynamic-page'),
    'static-page': () => import('@/themes/default/pages/static-page'),
  },
};

const themeLayoutLoaders: Record<string, Record<string, ThemeLoader>> = {
  default: {
    landing: () => import('@/themes/default/layouts/landing'),
  },
};

const themeBlockLoaders: Record<string, Record<string, ThemeLoader>> = {
  default: {
    blog: () => import('@/themes/default/blocks/blog'),
    'blog-detail': () => import('@/themes/default/blocks/blog-detail'),
    'blog-shell': () => import('@/themes/default/blocks/blog-shell'),
    cta: () => import('@/themes/default/blocks/cta'),
    faq: () => import('@/themes/default/blocks/faq'),
    'features-accordion': () =>
      import('@/themes/default/blocks/features-accordion'),
    'features-flow': () => import('@/themes/default/blocks/features-flow'),
    'features-list': () => import('@/themes/default/blocks/features-list'),
    'features-media': () => import('@/themes/default/blocks/features-media'),
    'features-step': () => import('@/themes/default/blocks/features-step'),
    features: () => import('@/themes/default/blocks/features'),
    footer: () => import('@/themes/default/blocks/footer'),
    header: () => import('@/themes/default/blocks/header'),
    hero: () => import('@/themes/default/blocks/hero'),
    index: () => import('@/themes/default/blocks/index'),
    logos: () => import('@/themes/default/blocks/logos'),
    'page-detail': () => import('@/themes/default/blocks/page-detail'),
    pricing: () => import('@/themes/default/blocks/pricing'),
    'showcases-flow': () => import('@/themes/default/blocks/showcases-flow'),
    showcases: () => import('@/themes/default/blocks/showcases'),
    'social-avatars': () => import('@/themes/default/blocks/social-avatars'),
    stats: () => import('@/themes/default/blocks/stats'),
    subscribe: () => import('@/themes/default/blocks/subscribe'),
    testimonials: () => import('@/themes/default/blocks/testimonials'),
    updates: () => import('@/themes/default/blocks/updates'),
  },
};

async function loadThemeModule(
  registry: Record<string, Record<string, ThemeLoader>>,
  kind: string,
  themeName: string,
  moduleName: string
) {
  const themedRegistry = registry[themeName];
  const fallbackRegistry = registry[defaultTheme];
  const loader =
    themedRegistry?.[moduleName] ??
    (themeName !== defaultTheme ? fallbackRegistry?.[moduleName] : undefined);

  if (!loader) {
    throw new Error(
      `Missing ${kind} module "${moduleName}" for theme "${themeName}"`
    );
  }

  return loader();
}

/**
 * get active theme
 */
export function getActiveTheme(): string {
  const theme = envConfigs.theme as string;

  if (theme) {
    return theme;
  }

  return defaultTheme;
}

/**
 * load theme page
 */
export async function getThemePage(pageName: string, theme?: string) {
  const loadTheme = theme || getActiveTheme();
  const module = await loadThemeModule(
    themePageLoaders,
    'page',
    loadTheme,
    pageName
  );
  return module.default;
}

/**
 * load theme layout
 */
export async function getThemeLayout(layoutName: string, theme?: string) {
  const loadTheme = theme || getActiveTheme();
  const module = await loadThemeModule(
    themeLayoutLoaders,
    'layout',
    loadTheme,
    layoutName
  );
  return module.default;
}

/**
 * convert kebab-case to PascalCase
 */
function kebabToPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * load theme block
 */
export async function getThemeBlock(blockName: string, theme?: string) {
  const loadTheme = theme || getActiveTheme();
  const pascalCaseName = kebabToPascalCase(blockName);
  const module = await loadThemeModule(
    themeBlockLoaders,
    'block',
    loadTheme,
    blockName
  );
  const component = module[pascalCaseName] || module[blockName];
  if (!component) {
    throw new Error(`No valid export found in block "${blockName}"`);
  }
  return component;
}
