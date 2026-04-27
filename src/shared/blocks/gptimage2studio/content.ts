export type PromptCard = {
  title: string;
  category: string;
  image: string;
  prompt: string;
  href: string;
  fullPrompt: string;
};

export type UseCase = {
  title: string;
  image: string;
  copy: string;
  cta: string;
  snippet: string;
  href: string;
};

export type EditDemo = {
  title: string;
  image: string;
  copy: string;
  prompt: string;
};

export const promoBar = {
  text: 'Launch offer: early users get priority access to GPT Image 2 Studio workflows.',
  cta: 'View Plans',
  href: '#pricing',
};

export const nav = [
  { label: 'Generator', href: '#workbench' },
  { label: 'Prompts', href: '#prompts' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '#pricing' },
];

export const hero = {
  eyebrow: 'GPT Image 2 AI image generator and editor',
  title: 'GPT Image 2 Studio',
  subtitle:
    'Create product photos, posters, social ads, infographics, UI mockups, and text-rich visuals with GPT Image 2 and Nano Banana in one prompt-first studio.',
  primaryCta: { label: 'Start Creating', href: '#workbench' },
  secondaryCta: { label: 'Explore Prompts', href: '#prompts' },
  trustHeadline: 'Creators are testing GPT Image 2 workflows',
  trustLabels: [
    'LIVE',
    'Prompt-first image creation',
    'Product, ads, UI, and text visuals',
  ],
  support:
    'Use reusable prompts, model controls, and reference-image workflows to move from idea to usable visual faster.',
};

export type WorkbenchMode = {
  value: 'text-to-image' | 'image-to-image';
  label: string;
  icon: 'wand' | 'pencil';
};

export type WorkbenchModelKey = 'gpt-image-2' | 'nano-banana';

export type WorkbenchModel = {
  value: WorkbenchModelKey;
  label: string;
  tagline: string;
  emoji: string;
  provider: string;
  modelId: string;
  editProvider: string;
  editModelId: string;
  badge?: string;
};

export type WorkbenchAspectRatio = {
  value: string;
  label: string;
};

export type WorkbenchResolution = {
  tier: '1K' | '2K' | '4K';
  label: string;
  dim: string;
  costMultiplier: number;
};

export const workbench = {
  title: 'Create Images with GPT Image 2 Studio',
  subcopy:
    'Start from a prompt or reference image, choose a model, and preview image ideas for product, marketing, and content workflows. The MVP interface is designed around reusable prompts, clear settings, and fast creative iteration.',
  promoCard: {
    icon: 'gift',
    title: 'Get 20 Free Credits & Try Pro',
    subtitle: 'New accounts unlock 20 credits to test Pro features today.',
    cta: 'Sign Up Free',
    href: '#pricing',
  },
  modes: [
    { value: 'image-to-image', label: 'Image Edit', icon: 'pencil' },
    { value: 'text-to-image', label: 'Text-to-Image', icon: 'wand' },
  ] satisfies WorkbenchMode[],
  models: [
    {
      value: 'gpt-image-2',
      label: 'GPT Image 2',
      tagline: 'Perfect text rendering · 4K resolution',
      emoji: '✨',
      provider: 'replicate',
      modelId: 'bytedance/seedream-4',
      editProvider: 'replicate',
      editModelId: 'bytedance/seedream-4',
    },
    {
      value: 'nano-banana',
      label: 'Nano Banana',
      tagline: 'Reference-driven editing · fast iteration',
      emoji: '🍌',
      provider: 'replicate',
      modelId: 'google/nano-banana-pro',
      editProvider: 'fal',
      editModelId: 'fal-ai/nano-banana-pro/edit',
    },
  ] satisfies WorkbenchModel[],
  aspectRatios: [
    { value: 'auto', label: 'Auto · AI auto-decide' },
    { value: '1:1', label: '1:1 · Square' },
    { value: '4:5', label: '4:5 · Portrait' },
    { value: '5:4', label: '5:4 · Landscape' },
    { value: '3:4', label: '3:4 · Portrait' },
    { value: '4:3', label: '4:3 · Landscape' },
    { value: '16:9', label: '16:9 · Widescreen' },
    { value: '9:16', label: '9:16 · Vertical' },
    { value: '3:2', label: '3:2 · Photo' },
    { value: '2:3', label: '2:3 · Photo Portrait' },
    { value: '21:9', label: '21:9 · Cinematic' },
  ] satisfies WorkbenchAspectRatio[],
  resolutions: [
    { tier: '1K', label: '1K (1024 × 1024)', dim: '1024x1024', costMultiplier: 1 },
    { tier: '2K', label: '2K (2048 × 2048)', dim: '2048x2048', costMultiplier: 2 },
    { tier: '4K', label: '4K (4096 × 4096)', dim: '4096x4096', costMultiplier: 4 },
  ] satisfies WorkbenchResolution[],
  outputCounts: [1, 2, 4] as const,
  defaultPrompt:
    'Create a clean studio product photo of a premium skincare serum bottle on a white marble surface. Soft daylight, realistic contact shadows, subtle reflection, minimal luxury background. The label must read "HYDRA GLOW SERUM". Commercial ecommerce photography, sharp product edges, natural glass texture, no extra text.',
  primaryAction: 'Start Creation',
  primaryImage: '/imgs/gptimage2studio/webp/workbench-primary-hydra-glow-serum.webp',
  primaryAlt:
    'Premium skincare serum bottle product photo generated from a GPT Image 2 prompt.',
  thumbnails: [
    {
      src: '/imgs/gptimage2studio/webp/workbench-thumb-create-forward-poster.webp',
      alt: 'Create Forward event poster with bold readable typography.',
      label: 'Poster',
    },
    {
      src: '/imgs/gptimage2studio/webp/workbench-thumb-solar-panel-infographic.webp',
      alt: 'Solar panel educational infographic with labeled steps.',
      label: 'Infographic',
    },
    {
      src: '/imgs/gptimage2studio/webp/workbench-thumb-studiometrics-dashboard.webp',
      alt: 'StudioMetrics SaaS analytics dashboard mockup.',
      label: 'UI Mockup',
    },
  ],
};

export const capabilityCards = [
  {
    title: 'Reasoning-Powered Layout',
    copy: 'GPT Image 2 plans the composition before rendering. Multi-element briefs come out coherent — every callout, label, and dimension reasoned in context.',
    image: '/imgs/gptimage2studio/webp/carousel-reasoning-rocket.webp',
    alt: 'Saturn V rocket launch with engineering annotations demonstrating GPT Image 2 reasoning and real-world knowledge.',
    badge: 'Reasoning #1',
  },
  {
    title: 'Perfect Text in 6 Languages',
    copy: 'Around 99% character accuracy across English, Japanese, Korean, Chinese, Hindi, and Bengali — usable for posters, packaging, and brand assets without post-edit fixes.',
    image: '/imgs/gptimage2studio/webp/carousel-multilingual-typography.webp',
    alt: 'Six gallery posters showing the word DESIGN rendered in English, Japanese, Korean, Chinese, Hindi, and Bengali.',
    badge: 'Multilingual #2',
  },
  {
    title: 'Multi-Image Consistency',
    copy: 'Generate 1 to 8 images in a single prompt — same character, same props, same palette across every panel. Storyboards, ad sets, and brand systems in one pass.',
    image: '/imgs/gptimage2studio/webp/carousel-character-consistency.webp',
    alt: 'Eight-panel storyboard showing the same character across cafe, podcast, beach, mountain, coding, conference, garden, and spacecraft scenes with full visual consistency.',
    badge: 'Consistency #3',
  },
  {
    title: 'Any Aspect Ratio, Native 4K',
    copy: 'From 1:1 Instagram squares to 21:9 cinema banners — generate the same brief in any ratio your channel needs, all at native 4K fidelity.',
    image: '/imgs/gptimage2studio/webp/carousel-4k-detail-frames.webp',
    alt: 'The same MORNI coffee campaign rendered as four ad mockups in 1:1 Instagram, 9:16 TikTok, 16:9 YouTube, and 21:9 cinema formats.',
    badge: 'Formats #4',
  },
];

export const promptCategories = [
  'All',
  'Product',
  'Poster',
  'Social',
  'Text',
  'UI',
  'Infographic',
  'Editing',
  'Brand',
];

export const promptCards: PromptCard[] = [
  {
    title: 'Premium Skincare Product Photo',
    category: 'Product',
    image: '/imgs/gptimage2studio/webp/prompt-skincare-product-photo.webp',
    prompt:
      'Clean studio packshot with readable label text, marble surface, soft daylight, and realistic shadows.',
    href: '/prompts/skincare-product-photo',
    fullPrompt:
      'Create a premium ecommerce photo of a skincare serum bottle on a marble surface with readable label text and soft daylight. Sharp product edges and natural glass texture.',
  },
  {
    title: 'Product Lifestyle Ad',
    category: 'Product',
    image: '/imgs/gptimage2studio/webp/prompt-product-lifestyle-ad.webp',
    prompt:
      'Lifestyle ad for a water bottle with morning light, citrus props, condensation, and a short headline.',
    href: '/prompts/ecommerce-lifestyle-ad',
    fullPrompt:
      'Lifestyle ad for a stainless steel water bottle. Morning kitchen light, citrus props, condensation drops, and a short headline "Stay Fresh All Day".',
  },
  {
    title: 'Launch Poster with Clear Headline',
    category: 'Poster',
    image: '/imgs/gptimage2studio/webp/prompt-launch-poster-clear-headline.webp',
    prompt:
      'Bold event poster with exact headline text, subtitle, geometric shapes, and high-contrast typography.',
    href: '/prompts/launch-poster-clear-text',
    fullPrompt:
      'Design a launch poster with headline "CREATE FORWARD", subtitle "AI Design Summit 2026", bold typography, and blue-black geometric shapes.',
  },
  {
    title: 'Multilingual Packaging Mockup',
    category: 'Text',
    image: '/imgs/gptimage2studio/webp/prompt-multilingual-packaging-mockup.webp',
    prompt:
      'Premium tea can packaging with English and Japanese label text, realistic material, and soft shadows.',
    href: '/prompts/multilingual-packaging-mockup',
    fullPrompt:
      'Premium matcha tea can packaging with English and Japanese label text, realistic aluminum material, soft studio shadows, and clean product framing.',
  },
  {
    title: 'SaaS Dashboard UI Mockup',
    category: 'UI',
    image: '/imgs/gptimage2studio/webp/prompt-saas-dashboard-ui-mockup.webp',
    prompt:
      'SaaS analytics dashboard with sidebar, charts, metric cards, and readable interface labels.',
    href: '/prompts/saas-dashboard-ui-mockup',
    fullPrompt:
      'Create a SaaS analytics dashboard mockup with a left sidebar, header bar, line chart, donut chart, four metric cards, and readable interface labels for "StudioMetrics".',
  },
  {
    title: 'Educational Infographic',
    category: 'Infographic',
    image: '/imgs/gptimage2studio/webp/prompt-solar-panel-infographic.webp',
    prompt:
      'Solar panel explainer with four labeled steps, simple diagrams, arrows, and classroom-friendly layout.',
    href: '/prompts/solar-panel-infographic',
    fullPrompt:
      'How Solar Panels Work infographic with four labeled steps, simple diagrams, arrows, and a friendly classroom-style layout. Headline "How Solar Panels Work".',
  },
  {
    title: 'YouTube Thumbnail',
    category: 'Social',
    image:
      '/imgs/gptimage2studio/webp/prompt-youtube-thumbnail-prompts-that-work.webp',
    prompt:
      'High-contrast creator thumbnail with large readable text and colorful generated image previews.',
    href: '/prompts/youtube-thumbnail-prompt',
    fullPrompt:
      'YouTube thumbnail with high-contrast colors, large readable headline "Prompts That Work", and three smaller AI image previews layered to the right.',
  },
  {
    title: 'Social Media Sale Ad',
    category: 'Social',
    image: '/imgs/gptimage2studio/webp/prompt-sneaker-social-sale-ad.webp',
    prompt:
      'Vertical sneaker launch ad with offer text, retail styling, energetic motion, and a clear CTA.',
    href: '/prompts/sneaker-social-ad',
    fullPrompt:
      'Vertical 9:16 social ad for a Spring Drop sneaker launch. Energetic motion, retail styling, headline "Spring Drop -20%", and a clear "Shop Now" CTA button.',
  },
  {
    title: 'Brand Identity Grid',
    category: 'Brand',
    image: '/imgs/gptimage2studio/webp/prompt-northline-coffee-brand-grid.webp',
    prompt:
      'A 3x3 brand system mockup with logo, color palette, packaging, storefront, social, and stationery.',
    href: '/prompts/brand-identity-grid',
    fullPrompt:
      '3x3 brand identity grid for "Northline Coffee" with logo, color palette, packaging, storefront, social posts, and stationery. Editorial photography style.',
  },
  {
    title: 'App Store Screenshot Set',
    category: 'UI',
    image:
      '/imgs/gptimage2studio/webp/prompt-dailyloop-app-store-screenshots.webp',
    prompt:
      'Three mobile app store screenshots for a habit tracker with short marketing captions and UI labels.',
    href: '/prompts/app-store-screenshot-set',
    fullPrompt:
      'Three vertical mobile app store screenshots for "DailyLoop" habit tracker. Each screen has UI labels and marketing captions: Plan, Track, Improve.',
  },
  {
    title: 'Character Concept Sheet',
    category: 'Brand',
    image:
      '/imgs/gptimage2studio/webp/prompt-sci-fi-courier-character-sheet.webp',
    prompt:
      'Original sci-fi character sheet with front view, side view, expressions, gear details, and labels.',
    href: '/prompts/sci-fi-character-sheet',
    fullPrompt:
      'Original sci-fi courier character sheet with front view, side view, expression panel, gear callouts, and labels for jacket, satchel, helmet, and boots.',
  },
  {
    title: 'Sticker Pack',
    category: 'Brand',
    image: '/imgs/gptimage2studio/webp/prompt-robot-sticker-pack.webp',
    prompt:
      'Consistent robot mascot sticker sheet with eight poses, thick white outlines, and playful style.',
    href: '/prompts/robot-sticker-pack',
    fullPrompt:
      'Consistent round robot mascot sticker pack with eight poses, thick white outlines, friendly style, and matte color palette on a transparent-feeling background.',
  },
  {
    title: 'Blog Hero Illustration',
    category: 'Editing',
    image:
      '/imgs/gptimage2studio/webp/prompt-small-business-ai-blog-hero.webp',
    prompt:
      'Editorial blog image for small business marketing with laptop, sticky notes, charts, and workspace props.',
    href: '/prompts/blog-hero-small-business-ai',
    fullPrompt:
      'Editorial blog hero illustration about AI tools for small business marketing. Laptop, sticky notes, charts, coffee cup, and workspace props in soft daylight.',
  },
  {
    title: 'Restaurant Menu Board',
    category: 'Text',
    image: '/imgs/gptimage2studio/webp/prompt-kizuna-matcha-menu-board.webp',
    prompt:
      'Cafe menu board with short readable drink names, soft green palette, and product photos.',
    href: '/prompts/matcha-menu-board',
    fullPrompt:
      'Cafe menu board for "Kizuna Matcha" with short readable drink names, prices, soft green palette, and three small product photos along the top.',
  },
  {
    title: 'Technical Product Annotation',
    category: 'Infographic',
    image:
      '/imgs/gptimage2studio/webp/prompt-headphone-product-annotation.webp',
    prompt:
      'Wireless headphone product infographic with clean callout lines and five readable feature labels.',
    href: '/prompts/product-annotation-infographic',
    fullPrompt:
      'Wireless headphone product annotation infographic. Clean callout lines and five readable feature labels: noise cancel, dynamic driver, soft cushion, USB-C, 40h battery.',
  },
  {
    title: 'Sports Poster Double Exposure',
    category: 'Poster',
    image:
      '/imgs/gptimage2studio/webp/prompt-sports-double-exposure-poster.webp',
    prompt:
      'Fictional match day sports poster with double exposure profile, action pose, and bold headline text.',
    href: '/prompts/sports-double-exposure-poster',
    fullPrompt:
      'Fictional football match day poster with a double exposure profile silhouette, an action pose inside, headline "MATCH DAY", date, and venue text.',
  },
  {
    title: 'AI Action Figure Box',
    category: 'Product',
    image: '/imgs/gptimage2studio/prompts/ai-action-figure-box.png',
    prompt:
      'Collectible blister-pack action figure with AI-themed accessories, retail packaging, and clear product labels.',
    href: '/prompts/ai-action-figure-box',
    fullPrompt:
      'Photo of a collectible action figure in a retail blister pack. The figure is an AI character with miniature accessories (laptop, headset, sticker sheet). Front of pack reads "PROMPT HERO · LIMITED EDITION". Studio lighting, sharp plastic shrink wrap, eye-level product photography, clean white seamless background.',
  },
  {
    title: 'Anime Cyber Hero Concept Sheet',
    category: 'Brand',
    image: '/imgs/gptimage2studio/prompts/anime-cyber-hero-sheet.png',
    prompt:
      'Original anime cyber hero character sheet with front view, side view, expressions, and gear callouts.',
    href: '/prompts/anime-cyber-hero-sheet',
    fullPrompt:
      'Original anime-style cyber hero character concept sheet. Three-quarter front view, side view, back view; expression panel with neutral / focused / smirk; weapon and gear callouts labeled. Cel-shaded line art, neon cyan + magenta accents, dark teal background grid.',
  },
  {
    title: 'Basketball Street Poster',
    category: 'Poster',
    image: '/imgs/gptimage2studio/prompts/basketball-street-poster.png',
    prompt:
      'Streetwear basketball poster with bold headline, action silhouette, and gritty urban backdrop.',
    href: '/prompts/basketball-street-poster',
    fullPrompt:
      'Streetwear basketball poster. Bold headline "RUN THE COURT" at top, action silhouette of a player mid-dunk, gritty asphalt backdrop with chain-link fence, orange + black palette, halftone print texture, vertical 9:16 composition.',
  },
  {
    title: 'Cinematic Beauty Mirror Selfie',
    category: 'Social',
    image: '/imgs/gptimage2studio/prompts/cinematic-beauty-mirror-selfie.png',
    prompt:
      'Cinematic mirror selfie with soft warm light, beauty product reflection, and editorial framing.',
    href: '/prompts/cinematic-beauty-mirror-selfie',
    fullPrompt:
      'Cinematic mirror selfie editorial. Soft warm tungsten light, model holding a beauty product visible in the mirror reflection, vintage gold-frame mirror, gentle film grain, 4:5 ratio, magazine-quality skin texture.',
  },
  {
    title: 'Cute Pet Action Figure',
    category: 'Product',
    image: '/imgs/gptimage2studio/prompts/cute-pet-action-figure.png',
    prompt:
      'Boxed pet action figure with toy accessories, retail packaging, and a cute mascot illustration.',
    href: '/prompts/cute-pet-action-figure',
    fullPrompt:
      'Boxed action figure of a cute corgi mascot with mini accessories (bone, ball, sticker sheet). Retail blister pack with cartoon brand illustration, headline "BARKVERSE EP.01", studio product photo on a soft pastel gradient background.',
  },
  {
    title: 'Cyberpunk Car Ad',
    category: 'Social',
    image: '/imgs/gptimage2studio/prompts/cyberpunk-car-ad.png',
    prompt:
      'Cyberpunk hero car ad with rain-slicked street, neon reflections, and bold product headline.',
    href: '/prompts/cyberpunk-car-ad',
    fullPrompt:
      'Cyberpunk hero car ad. Sleek concept EV on a rain-slicked Tokyo street at night, neon shop signs reflecting on wet asphalt, headline "DRIVE THE FUTURE", subtitle "EV-X · 2027", widescreen 16:9 cinematic framing, deep teal + magenta palette.',
  },
  {
    title: 'Fashion Editorial Neon Portrait',
    category: 'Brand',
    image:
      '/imgs/gptimage2studio/prompts/fashion-editorial-neon-portrait.png',
    prompt:
      'Editorial neon portrait with high-contrast color gels, sharp wardrobe styling, and clean negative space.',
    href: '/prompts/fashion-editorial-neon-portrait',
    fullPrompt:
      'Editorial fashion portrait lit with two opposing color gels (magenta key, cyan rim). Tailored oversized blazer, minimal makeup, sharp expression, clean black studio backdrop, vertical 4:5 composition, 35mm look with controlled grain.',
  },
  {
    title: 'Fashion Magazine Cover',
    category: 'Poster',
    image: '/imgs/gptimage2studio/prompts/fashion-magazine-cover.png',
    prompt:
      'High-end fashion magazine cover with masthead, cover lines, and editorial portrait.',
    href: '/prompts/fashion-magazine-cover',
    fullPrompt:
      'High-end fashion magazine cover. Masthead "VANTAGE" top-left in serif caps, three cover lines along the right edge, editorial three-quarter portrait of a model in a tailored coat, color palette: ivory + black + one accent. 4:5 cover crop, clean print typography.',
  },
  {
    title: 'Fitness Transformation Poster',
    category: 'Poster',
    image: '/imgs/gptimage2studio/prompts/fitness-transformation-poster.png',
    prompt:
      'Before/after fitness transformation poster with bold headline, split frame, and program tagline.',
    href: '/prompts/fitness-transformation-poster',
    fullPrompt:
      'Before/after fitness transformation poster. Vertical split frame: left "Week 0", right "Week 12"; bold headline "30 MINUTES A DAY"; subtitle "real clients · no filters"; high-contrast gym lighting; black + lime green palette; 9:16 vertical for Instagram story.',
  },
  {
    title: 'Future City Infographic',
    category: 'Infographic',
    image: '/imgs/gptimage2studio/prompts/future-city-infographic.png',
    prompt:
      'Future smart city infographic with five labeled districts, callout arrows, and clean isometric layout.',
    href: '/prompts/future-city-infographic',
    fullPrompt:
      'Future smart city infographic in isometric perspective. Five labeled districts: Energy / Mobility / Housing / Greenspace / Data. Callout arrows from each district to a short descriptor. Clean editorial illustration, blue-teal palette, soft shadows, 16:9 layout, sans-serif labels.',
  },
  {
    title: 'K-Pop Album Cover Concept',
    category: 'Brand',
    image: '/imgs/gptimage2studio/prompts/kpop-album-cover-concept.png',
    prompt:
      'K-pop album cover concept with bilingual title text, color-blocked portrait, and edition tag.',
    href: '/prompts/kpop-album-cover-concept',
    fullPrompt:
      'K-pop album cover concept. Bilingual title "EVER AFTER · 영원히" in stylized type, three-quarter portrait of a stylized member silhouette, color-blocked background (peach + lavender), edition tag "VOL.03 · LIMITED" bottom-right, square 1:1 cover format, glossy print finish.',
  },
  {
    title: 'Luxury Perfume Beauty Ad',
    category: 'Product',
    image: '/imgs/gptimage2studio/prompts/luxury-perfume-beauty-ad.png',
    prompt:
      'Luxury perfume hero ad with crystal bottle, soft focus florals, and condensed brand wordmark.',
    href: '/prompts/luxury-perfume-beauty-ad',
    fullPrompt:
      'Luxury perfume hero ad. Crystal bottle on a marble pedestal, soft-focus florals in the background, brand wordmark "ÉCLAT NOIR" in condensed serif at bottom, golden honey light, 4:5 portrait crop, premium fragrance campaign feel.',
  },
  {
    title: 'Luxury Sneaker Liquid Chrome',
    category: 'Product',
    image: '/imgs/gptimage2studio/prompts/luxury-sneaker-liquid-chrome.png',
    prompt:
      'Liquid chrome luxury sneaker product shot with reflective surface and minimal product label.',
    href: '/prompts/luxury-sneaker-liquid-chrome',
    fullPrompt:
      'Luxury sneaker product shot in liquid chrome material. Single side profile, mirrored chrome upper, sole reading "AURA · 01", suspended on a glossy black acrylic stage with subtle ripple reflection, studio strobe lighting, 1:1 square ecommerce hero shot.',
  },
  {
    title: 'Match Day Red Poster',
    category: 'Poster',
    image: '/imgs/gptimage2studio/prompts/match-day-red-poster.png',
    prompt:
      'Bold red match day poster with tournament headline, date, and stadium silhouette.',
    href: '/prompts/match-day-red-poster',
    fullPrompt:
      'Bold red match day poster. Headline "MATCH DAY", subtitle "FINAL · MAY 18 · CITY ARENA", stadium silhouette in distress halftone behind the text, deep red + cream palette, vintage sports print feel, vertical 9:16 social-friendly crop.',
  },
  {
    title: 'Movie Storyboard Grid',
    category: 'Brand',
    image: '/imgs/gptimage2studio/prompts/movie-storyboard-grid.png',
    prompt:
      'Six-panel movie storyboard grid with shot numbers, action notes, and consistent character framing.',
    href: '/prompts/movie-storyboard-grid',
    fullPrompt:
      'Six-panel movie storyboard grid (3×2). Each frame shows the same protagonist in a different shot — wide / over-shoulder / close-up / insert / two-shot / hero — with shot numbers (S01–S06) and one-line action notes underneath. Pencil-on-paper rendering, 16:9 frame ratio per panel.',
  },
  {
    title: 'Night Street UGC Fashion',
    category: 'Social',
    image: '/imgs/gptimage2studio/prompts/night-street-ugc-fashion.png',
    prompt:
      'Authentic night-street UGC fashion shot with mixed light sources and casual posing.',
    href: '/prompts/night-street-ugc-fashion',
    fullPrompt:
      'Authentic night-street UGC fashion shot. Subject in oversized denim and a graphic tee, leaning on a railing under a mix of sodium street lights and a passing car headlamp, mild handheld blur, vertical 9:16 phone format, looks like a friend\'s casual photo, slight ISO grain.',
  },
  {
    title: 'Polaroid Travel Memory Wall',
    category: 'Brand',
    image: '/imgs/gptimage2studio/prompts/polaroid-travel-memory-wall.png',
    prompt:
      'Pinned polaroid travel memory wall with handwritten captions and varied snapshot moments.',
    href: '/prompts/polaroid-travel-memory-wall',
    fullPrompt:
      'Pinned polaroid travel memory wall. Twelve polaroid prints arranged on cork board, each with a handwritten city + date caption ("Lisbon · 03.18", "Kyoto · 04.02", etc.), warm faded film tones, soft natural daylight from the side, 4:3 wide composition.',
  },
  {
    title: 'Travel Poster Kyoto Night',
    category: 'Poster',
    image: '/imgs/gptimage2studio/prompts/travel-poster-kyoto-night.png',
    prompt:
      'Vintage Kyoto night travel poster with pagoda silhouette, lantern glow, and Japanese typography.',
    href: '/prompts/travel-poster-kyoto-night',
    fullPrompt:
      'Vintage Kyoto night travel poster. Pagoda silhouette against a deep indigo sky, warm lantern glow along the path, Japanese typography "京都の夜" + English headline "KYOTO BY NIGHT", subtle paper grain, 1930s-style limited color print feel, vertical 2:3 crop.',
  },
  {
    title: 'Viral Food Poster: Ramen',
    category: 'Poster',
    image: '/imgs/gptimage2studio/prompts/viral-food-poster-ramen.png',
    prompt:
      'Top-down viral food poster of ramen with bold caption, splash effect, and high-saturation styling.',
    href: '/prompts/viral-food-poster-ramen',
    fullPrompt:
      'Top-down viral food poster of a steaming bowl of tonkotsu ramen. Bold headline "SLURP SEASON", chopsticks lifting noodles with a frozen broth splash, soft-boiled egg cross-section visible, high-saturation styling, 1:1 square crop optimized for Instagram.',
  },
  {
    title: 'Viral YouTube AI Faceoff',
    category: 'Social',
    image: '/imgs/gptimage2studio/prompts/viral-youtube-ai-faceoff.png',
    prompt:
      'Viral YouTube thumbnail with two AI faces facing off, large readable headline, and bold contrast.',
    href: '/prompts/viral-youtube-ai-faceoff',
    fullPrompt:
      'Viral YouTube thumbnail. Two stylized AI character faces in a left/right faceoff, large readable headline "WHICH AI WINS?" between them, lightning split down the center, bright high-contrast palette (red vs blue), 16:9 thumbnail crop, eye-friendly text size at 1280×720.',
  },
];

export const useCases: UseCase[] = [
  {
    title: 'Product Photos & Packaging Mockups',
    image: '/imgs/gptimage2studio/webp/usecase-product-photos-mockup-hero.webp',
    copy: 'Generate ecommerce-ready product shots and 3D packaging mockups in one prompt — used by DTC founders, Shopify sellers, and brand designers. GPT Image 2 nails label text, material textures, and contact shadows so visuals look ready for product pages without retouching.',
    cta: 'Start Creating',
    snippet:
      'Create a premium ecommerce photo of a skincare serum bottle on a marble surface with readable label text and soft daylight.',
    href: '#workbench',
  },
  {
    title: 'Posters & Banners with Perfect Text',
    image: '/imgs/gptimage2studio/webp/usecase-posters-banners-text.webp',
    copy: "Design launch posters, event banners, and print-ready visuals where every headline stays sharp and on-brand. GPT Image 2's text rendering hits 99% accuracy across English, Japanese, Korean, and Chinese, so creative drafts ship without manual fixes.",
    cta: 'Try It Now',
    snippet:
      'Design a launch poster with headline "CREATE FORWARD", subtitle "AI Design Summit 2026", bold typography, and blue-black geometric shapes.',
    href: '#workbench',
  },
  {
    title: 'Social Ads & Creator Thumbnails',
    image: '/imgs/gptimage2studio/webp/usecase-social-ads-thumbnails.webp',
    copy: 'Spin up TikTok ads, Instagram covers, and YouTube thumbnails with bold readable text and vertical-ratio layouts. Use GPT Image 2 prompts to test multiple ad creatives a day instead of waiting on a designer.',
    cta: 'Experience It',
    snippet:
      'Vertical 9:16 social ad for a Spring Drop sneaker launch. Energetic motion, retail styling, headline "Spring Drop -20%", clear "Shop Now" CTA.',
    href: '#workbench',
  },
  {
    title: 'Infographics & UI Mockups',
    image: '/imgs/gptimage2studio/webp/usecase-infographics-ui-mockups.webp',
    copy: "Draft labeled infographics, dashboard concepts, app screenshots, and explainer diagrams from a single structured prompt. GPT Image 2's reasoning model plans the layout before rendering, keeping labels, arrows, and steps coherent.",
    cta: 'Generate Yours',
    snippet:
      'SaaS analytics dashboard mockup with sidebar, line chart, four metric cards, readable labels for "StudioMetrics".',
    href: '#workbench',
  },
];

export const editDemos: EditDemo[] = [
  {
    title: 'Background Replacement',
    image:
      '/imgs/gptimage2studio/webp/edit-demo-background-replacement.webp',
    copy: 'Keep the product identity, label, and camera angle while replacing a plain background with a premium ecommerce studio scene.',
    prompt:
      'Keep the product exactly the same. Replace the background with a clean beige studio set, add soft shadows and subtle reflection, and preserve the label text.',
  },
  {
    title: 'Lighting Adjustment',
    image: '/imgs/gptimage2studio/webp/edit-demo-lighting-adjustment.webp',
    copy: 'Improve exposure, direction, and material texture while preserving the original subject and composition.',
    prompt:
      'Keep the subject and composition unchanged. Improve exposure, add soft directional light from the left, preserve natural product texture, and remove harsh shadows.',
  },
  {
    title: 'Object Replacement',
    image: '/imgs/gptimage2studio/webp/edit-demo-object-replacement.webp',
    copy: 'Swap one object in a scene while keeping the desk, lighting, shadows, and perspective consistent.',
    prompt:
      'Replace the mug with a matte black travel tumbler while keeping the desk, lighting, shadows, and camera perspective realistic.',
  },
  {
    title: 'Text and Poster Refinement',
    image: '/imgs/gptimage2studio/webp/edit-demo-poster-refinement.webp',
    copy: 'Turn a rough layout into a cleaner poster with stronger hierarchy, better contrast, and readable headline text.',
    prompt:
      'Refine this poster into a clean modern layout. Keep the same theme, make the headline "CREATE FORWARD" readable, improve spacing and contrast, and remove any garbled text.',
  },
];

export const whatIsIntro =
  "GPT Image 2 Studio is a web workspace for AI image creation. Bring a prompt or a reference image, pick GPT Image 2 or Nano Banana, and walk away with product photos, posters, social ads, infographics, and UI mockups in minutes — no design software, no API setup.";

export const whatIsCards = [
  {
    title: 'Two Top Models, One Workspace',
    copy: "GPT Image 2 Studio is a prompt-first web workspace for generating and editing images with OpenAI's GPT Image 2 and Google's Nano Banana side by side. Bring a prompt or reference image, pick the model that fits the task, and ship the result in minutes — no separate API keys or accounts.",
  },
  {
    title: 'Built for Creators Who Ship',
    copy: 'DTC founders, brand designers, content creators, marketers, and educators use the Studio for product photos, social ads, posters, infographics, and UI mockups — anywhere ready-to-publish AI images matter more than tinkering with raw API parameters.',
  },
  {
    title: 'Independent of OpenAI and Google',
    copy: 'GPT Image 2 Studio is an independent product and is not affiliated with, endorsed by, or sponsored by OpenAI or Google. We provide a workflow layer on top of their public model APIs, with our own UI, prompt library, and editing experience.',
  },
];

export const comparisonIntro =
  "GPT Image 2 and Nano Banana are two of the strongest image models available today, but they're built around different strengths. GPT Image 2 leads on text rendering, layout reasoning, and production speed; Nano Banana leads on portrait realism and multi-reference character consistency. Use this side-by-side to pick the right starting point for your task — not to declare a winner.";

export const comparisonHero = {
  src: '/imgs/gptimage2studio/webp/vs-gpt-image-2-vs-nano-banana-hero.webp',
  alt: 'Side-by-side example comparing GPT Image 2 and Nano Banana outputs from a similar creative brief.',
};

export const comparisonCta = {
  label: 'Try Both Models',
  href: '#workbench',
};

export const comparison = [
  {
    dimension: 'Core strength',
    gptImage2:
      "OpenAI's reasoning-first image model — plans the layout before rendering, strong on instruction-heavy briefs and text-rich visuals.",
    nanoBanana:
      'Google Gemini-based model focused on character consistency and reference-driven editing, with strong portrait realism.',
  },
  {
    dimension: 'Text in image',
    gptImage2:
      'Renders headlines, labels, and UI text with around 99% accuracy in English, plus solid Japanese, Korean, Chinese, Hindi, and Bengali.',
    nanoBanana:
      'Solid multilingual text rendering, strongest on logos, posters, and short overlays.',
  },
  {
    dimension: 'Reference & multi-image input',
    gptImage2:
      'Standard image-to-image plus multi-turn editing; supports up to 16 reference images per edit.',
    nanoBanana:
      'Accepts up to 14 reference images and multi-character composition — convenient for character locking and brand consistency.',
  },
  {
    dimension: 'Resolution & output',
    gptImage2:
      'Up to 4K with flexible aspect ratios from ultra-wide 3:1 to vertical 1:3, plus 1–8 image batching per prompt.',
    nanoBanana:
      '2K and 4K outputs with quick reformatting for multiple ad sizes.',
  },
  {
    dimension: 'Speed',
    gptImage2:
      'Instant mode generates in roughly 3 seconds; thinking mode takes longer on layout-heavy briefs.',
    nanoBanana:
      'Generation typically takes around 10–15 seconds per image.',
  },
  {
    dimension: 'Best for',
    gptImage2:
      'Posters, packaging, UI mockups, infographics, and any brief where text accuracy and layout reasoning matter.',
    nanoBanana:
      'Portraits, lifestyle imagery, and reference-driven edits where pore-level realism or multi-character consistency matters.',
  },
];

export const whyChooseSubtitle =
  "OpenAI's GPT Image 2 leads on text rendering, layout reasoning, and production speed — here's what that means for the briefs you actually ship.";

export const whyChooseCta = {
  label: 'Try GPT Image 2 Now',
  href: '#workbench',
};

export const benefits = [
  {
    title: 'Perfect Text in Every Language',
    copy: 'Around 99% character accuracy in English plus solid Japanese, Korean, Chinese, Hindi, and Bengali. Build print-ready menus, posters, UI mockups, and brand assets without post-edit fixes.',
  },
  {
    title: 'Thinks Before It Generates',
    copy: "GPT Image 2 is OpenAI's first image model with native reasoning. It plans the composition, verifies the layout, and follows multi-constraint briefs in a single prompt — fewer \"almost right\" generations, less iteration.",
  },
  {
    title: 'Production-Ready, Out of the Box',
    copy: 'Native 4K output, 1–8 image batching with consistent characters and props, and noticeably faster generation than the previous model. Skip upscaling, skip retouching, ship the result.',
  },
];

export type HowToStep = {
  step: string;
  title: string;
  copy: string;
  image: string;
  alt: string;
};

export const howToUseSubtitle =
  'Transform your idea into a finished visual in four steps:';

export const howToUse: HowToStep[] = [
  {
    step: '01',
    title: 'Start with GPT Image 2',
    copy: 'Bring a prompt or reference image — text or visual, the Studio handles both. From a brief mood board to a polished editorial shot in one prompt.',
    image: '/imgs/gptimage2studio/webp/howto-step-01-start-prompt.webp',
    alt: 'A designer brief becoming a finished editorial fashion portrait, demonstrating GPT Image 2 text-to-image creation.',
  },
  {
    step: '02',
    title: 'Edit with GPT Image 2',
    copy: 'Describe the change in plain words. Edit text, swap colors, replace objects — no layers, no masks, no manual selections.',
    image: '/imgs/gptimage2studio/webp/howto-step-02-direct-edit.webp',
    alt: 'A cream sweater turning emerald and English mug text translating to Japanese, all from a single natural-language prompt.',
  },
  {
    step: '03',
    title: 'Iterate with GPT Image 2',
    copy: 'Refine the same image across multiple turns without breaking the rest. Multi-turn editing keeps the character, props, and identity intact.',
    image: '/imgs/gptimage2studio/webp/howto-step-03-iterate-refine.webp',
    alt: 'The same model and outfit moving from a studio to a Tokyo café across two editing turns, with character consistency preserved.',
  },
  {
    step: '04',
    title: 'Perfect with GPT Image 2',
    copy: 'Export at native 4K in 1:1, 9:16, 16:9, or 21:9 — the same brief reflows for any channel you ship to, every time.',
    image: '/imgs/gptimage2studio/webp/howto-step-04-ship-formats.webp',
    alt: 'The same fashion shot delivered as Instagram square, TikTok story, YouTube banner, and cinema poster mockups.',
  },
];

export const coreFeatures = [
  {
    title: 'Text-in-Image Rendering',
    copy: 'Build posters, packaging, menu boards, UI screens, and infographics where the text inside the image stays sharp and on-brand. Multilingual support across English, Japanese, Korean, Chinese, Hindi, and Bengali.',
  },
  {
    title: 'Reference Image Editing',
    copy: 'Upload a PNG, JPG, or WebP and describe the change — background swap, lighting adjustment, object replacement, or layout cleanup. Reference-based edits stay faithful to the original structure and details.',
  },
  {
    title: 'Multi-Turn Editing',
    copy: 'Iterate on the same image across multiple prompts without breaking the rest. Add, subtract, recolor, or refine specific elements while everything else stays intact across passes.',
  },
  {
    title: 'Multi-Image Consistency',
    copy: 'Generate 1 to 8 images in a single prompt, with consistent characters, props, and color palettes across the set. Useful for storyboards, multi-panel ads, product variations, and brand systems.',
  },
  {
    title: '4K Output & Flexible Aspect Ratios',
    copy: 'Native resolution up to 4K with aspect ratios from ultra-wide 3:1 to vertical 1:3, plus standard 1:1, 4:5, 16:9, and 9:16. Pick the ratio first, generate at the size your channel actually uses.',
  },
  {
    title: 'Instant & Thinking Modes',
    copy: 'Instant mode generates in seconds for fast iteration. Thinking mode plans the layout, verifies the output, and handles multi-constraint briefs better — useful for posters, infographics, and dense compositions.',
  },
];

export const pricing = [
  {
    name: 'Free',
    body: 'Explore the studio, test starter workflows, and try core prompt examples.',
    cta: 'Start Free',
    featured: false,
  },
  {
    name: 'Pro',
    body: 'Create more images, iterate faster, and use prompt templates for product, marketing, and content workflows.',
    cta: 'Upgrade to Pro',
    featured: true,
  },
  {
    name: 'Studio',
    body: 'Plan image workflows for teams, campaigns, ecommerce projects, and repeatable brand assets.',
    cta: 'Contact for Studio',
    featured: false,
  },
];

export type Testimonial = {
  name: string;
  role: string;
  handle: string;
  source: 'X' | 'Reddit';
  verified: boolean;
  url: string;
  engagement: string;
  date: string;
  avatarUrl?: string;
  initial: string;
  color: string;
  quote: string;
};

export const testimonialsIntro =
  'These are real posts from creators on X and Reddit testing GPT Image 2 — designers, builders, educators, and AI enthusiasts sharing what they’re shipping in the first weeks after launch.';

export const testimonialsDisclaimer =
  'Quotes link to the original public posts on X and Reddit. Engagement counts captured at time of indexing — see each post for current state.';

export const testimonials: Testimonial[] = [
  {
    name: 'Hewar',
    role: 'Brand Designer',
    handle: '@hewarsaber',
    source: 'X',
    verified: true,
    url: 'https://x.com/hewarsaber/status/2046707411335966796',
    engagement: '2.6K likes · 598K views',
    date: 'Apr 22, 2026',
    avatarUrl: 'https://unavatar.io/twitter/hewarsaber',
    initial: 'H',
    color: 'from-cyan-500 to-blue-500',
    quote:
      "GPT Image 2 is insane for branding. Designers, we're cooked.",
  },
  {
    name: 'WY',
    role: 'Education / Content',
    handle: '@akokoi1',
    source: 'X',
    verified: true,
    url: 'https://x.com/akokoi1/status/2044800630771134677',
    engagement: '2K likes · 430K views',
    date: 'Apr 16, 2026',
    avatarUrl: 'https://unavatar.io/twitter/akokoi1',
    initial: 'W',
    color: 'from-violet-500 to-fuchsia-500',
    quote:
      'I declare, GPT-image-2 has killed the competition. Generate textbooks, demos, test papers — you can directly storm into the education industry. (translated from Chinese)',
  },
  {
    name: 'INK',
    role: 'Indie Game Dev',
    handle: '@0xInk_',
    source: 'X',
    verified: true,
    url: 'https://x.com/0xInk_/status/2047648944004755679',
    engagement: '1.6K likes · 106K views',
    date: 'Apr 24, 2026',
    avatarUrl: 'https://unavatar.io/twitter/0xInk_',
    initial: 'I',
    color: 'from-emerald-500 to-teal-500',
    quote:
      'GPT Image 2 + Seedance 2 is an insane combo. The fact that you can get really high detail and animate it is so satisfying — this is the future of game development.',
  },
  {
    name: 'Min Zhou',
    role: 'Builder / Developer',
    handle: '@fMinZhou',
    source: 'X',
    verified: true,
    url: 'https://x.com/fMinZhou/status/2047214663721681288',
    engagement: '4.3K likes · 326K views',
    date: 'Apr 23, 2026',
    avatarUrl: 'https://unavatar.io/twitter/fMinZhou',
    initial: 'M',
    color: 'from-amber-500 to-orange-500',
    quote:
      'GPT Image 2 is insanely good... I generated a 360° equirectangular panorama with just a skill + prompt.',
  },
  {
    name: 'Min Choi',
    role: 'AI Influencer',
    handle: '@minchoi',
    source: 'X',
    verified: true,
    url: 'https://x.com/minchoi/status/2040419534507512306',
    engagement: '793 likes · 264K views',
    date: 'Apr 4, 2026',
    avatarUrl: 'https://unavatar.io/twitter/minchoi',
    initial: 'M',
    color: 'from-rose-500 to-pink-500',
    quote:
      'Holy smokes... leaked OpenAI GPT-Image-2 on Arena is wild. This is 100% AI.',
  },
  {
    name: 'r/singularity',
    role: 'Reddit Community',
    handle: 'r/singularity',
    source: 'Reddit',
    verified: false,
    url: 'https://www.reddit.com/r/singularity/comments/1sry7k9/gpt_image_2_has_the_biggest_jump_in_quality_ever/',
    engagement: 'Top comment · 1.2K-vote thread',
    date: 'Apr 2026',
    initial: 'R',
    color: 'from-indigo-500 to-purple-500',
    quote:
      'Open AI really cooked with this one. Nothing compares even remotely.',
  },
];

export const publicSignals = [
  {
    title: 'Readable Text Is the First Test',
    copy: 'Creators often test image models with posters, menu boards, packaging, captions, UI labels, and thumbnails because text accuracy is easy to judge and highly useful.',
  },
  {
    title: 'Product and Campaign Visuals Are High Intent',
    copy: 'Ecommerce sellers, founders, and marketers need product shots, lifestyle scenes, ads, banners, and launch visuals that can be generated from repeatable briefs.',
  },
  {
    title: 'Structured Prompts Produce Better Results',
    copy: 'The strongest examples define subject, text, layout, lighting, style, aspect ratio, and negative constraints instead of asking for a generic image.',
  },
];

export const faqs = [
  {
    q: 'What is GPT Image 2?',
    a: "GPT Image 2 is OpenAI's state-of-the-art image generation and editing model, released in April 2026. It's the first OpenAI image model with native reasoning — meaning it plans the layout and verifies the output before rendering. GPT Image 2 Studio gives you access to this model through a prompt-first web workspace.",
  },
  {
    q: 'How is GPT Image 2 different from DALL-E 3?',
    a: 'GPT Image 2 replaces DALL-E 3 with sharper text rendering, native 4K support, 1–8 image consistency in a single prompt, and reasoning-based layout planning. For most professional design briefs — posters, packaging, UI mockups, infographics — GPT Image 2 produces usable output without manual cleanup, where DALL-E 3 frequently required post-editing.',
  },
  {
    q: 'How is GPT Image 2 different from Nano Banana?',
    a: "Both are top-tier image models, but they're built around different strengths. GPT Image 2 leads on text rendering, layout reasoning, and production speed. Nano Banana leads on portrait realism and multi-reference character consistency (up to 14 reference images). Use GPT Image 2 for text-rich design and posters, Nano Banana for portraits and reference-driven edits.",
  },
  {
    q: 'How accurate is GPT Image 2 at generating text in images?',
    a: 'Around 99% character accuracy in English, with strong performance in Japanese, Korean, Chinese, Hindi, and Bengali. This is the biggest practical jump from previous models and makes posters, menu boards, packaging, and infographics shippable without post-edit fixes.',
  },
  {
    q: 'Can GPT Image 2 generate 4K images?',
    a: "Yes. GPT Image 2 supports native resolution up to 4K (4096×4096) with flexible aspect ratios from ultra-wide 3:1 to vertical 1:3, plus standard 1:1, 16:9, 9:16, and 4:5. Pick the ratio first, then resolution, in the Studio's settings panel.",
  },
  {
    q: 'Does GPT Image 2 support multilingual text in posters and packaging?',
    a: 'Yes. GPT Image 2 has strong multilingual text rendering across English, Japanese, Korean, Chinese, Hindi, and Bengali. It can render packaging labels, posters, menus, UI strings, and short captions in multiple scripts within the same image when prompted.',
  },
  {
    q: 'Is GPT Image 2 Studio free to use?',
    a: 'GPT Image 2 Studio offers a Free tier for trying core prompts plus Pro and Studio plans for higher-volume creators and teams. See the Pricing section above for current credits and limits.',
  },
  {
    q: 'Can I use Nano Banana inside GPT Image 2 Studio?',
    a: "Yes. The Studio's model picker lets you switch between GPT Image 2 and Nano Banana per task. You can run the same prompt through both, compare results side by side, or pick the model that fits the brief best — without switching accounts or services.",
  },
  {
    q: 'What prompts work best for GPT Image 2?',
    a: "Structured prompts outperform one-line prompts. The strongest briefs describe subject, exact text in quotes, layout and composition, lighting, style or camera reference, aspect ratio, and constraints (what to avoid). Browse the Studio's prompt library for ready-to-use templates.",
  },
];

export const finalCta = {
  title: 'Transform Your Creative Workflow with GPT Image 2',
  subcopy:
    'Experience production-grade AI image generation. Bring a prompt — walk away with assets your team can ship.',
  primary: { label: 'Try GPT Image 2 Now', href: '#workbench' },
  secondary: { label: 'View Plans', href: '#pricing' },
};

export const footer = {
  brand: 'GPT Image 2 Studio',
  description:
    'An independent prompt-first AI image generator and editor for product photos, posters, ads, infographics, UI mockups, and text-rich visuals.',
  product: ['Generator', 'Prompts', 'Blog', 'Pricing'],
  resource: [
    'Product Photo Prompts',
    'Poster Prompts',
    'Text Rendering Guide',
    'Ecommerce Prompts',
  ],
  legal: ['Privacy Policy', 'Terms of Service', 'Refund Policy'],
  contact: 'support@gptimage2studio.com',
  disclaimer:
    'GPT Image 2 Studio is an independent product and is not affiliated with OpenAI or Google.',
};
