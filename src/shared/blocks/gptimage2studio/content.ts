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
  text: "Congrats! You've unlocked a limited-time exclusive 50% OFF!",
  cta: 'Grab Now',
  href: '/pricing#plans',
};

export const nav = [
  { label: 'Generator', href: '#workbench' },
  { label: 'Prompts', href: '/prompts' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
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
    href: '/pricing',
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
      label: 'Nano Banana 2',
      tagline: 'Reference-driven editing · fast iteration',
      emoji: '🍌',
      provider: 'kie',
      modelId: 'nano-banana-2',
      editProvider: 'kie',
      editModelId: 'nano-banana-2',
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
    {
      tier: '1K',
      label: '1K (1024 × 1024)',
      dim: '1024x1024',
      costMultiplier: 1,
    },
    {
      tier: '2K',
      label: '2K (2048 × 2048)',
      dim: '2048x2048',
      costMultiplier: 2,
    },
    {
      tier: '4K',
      label: '4K (4096 × 4096)',
      dim: '4096x4096',
      costMultiplier: 4,
    },
  ] satisfies WorkbenchResolution[],
  outputCounts: [1, 2, 4] as const,
  defaultPrompt: '',
  primaryAction: 'Start Creation',
  primaryImage:
    '/imgs/gptimage2studio/webp/workbench-primary-hydra-glow-serum.webp',
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

export const promptCards: PromptCard[] = [
  {
    title: 'Neon Fashion Editorial Portrait',
    category: 'Portrait',
    image: '/imgs/gptimage2studio/prompts/fashion-editorial-neon-portrait.webp',
    prompt:
      'High-fashion portrait with neon rim light, wet city reflections, and cinematic editorial energy.',
    href: '/prompts/neon-fashion-editorial-portrait',
    fullPrompt:
      'Ultra-realistic high-fashion editorial portrait of an original young woman, glossy black bob haircut, chrome silver jacket, neon cyan and magenta rim lighting, wet city street reflections, confident gaze, shallow depth of field, Vogue-style composition, cinematic grain, 4:5 vertical, no logo, no watermark.',
  },
  {
    title: 'AI Creator Action Figure Box',
    category: '3D',
    image: '/imgs/gptimage2studio/prompts/ai-action-figure-box.webp',
    prompt:
      'Collectible creator figurine in premium toy packaging with a clear window and desk-photo realism.',
    href: '/prompts/ai-creator-action-figure-box',
    fullPrompt:
      'A collectible AI creator action figure inside a premium toy box with clear plastic window, cyberpunk teal packaging, miniature laptop and camera accessories, 3D modeling screen in the background, realistic desk photo, product photography lighting, high-end collectible figure aesthetic, square image.',
  },
  {
    title: 'Cinematic Beauty Mirror Selfie',
    category: 'Fashion',
    image: '/imgs/gptimage2studio/prompts/cinematic-beauty-mirror-selfie.webp',
    prompt:
      'Influencer-style mirror selfie in a cozy RGB gaming room with realistic phone-photo framing.',
    href: '/prompts/cinematic-beauty-mirror-selfie',
    fullPrompt:
      'Ultra-realistic mirror selfie of an original fashionable woman in a cozy RGB gaming room, soft pink ambient light, dual monitors, tasteful outfit, natural phone photo framing, influencer lifestyle aesthetic, realistic skin texture, no celebrity likeness, 9:16 vertical.',
  },
  {
    title: 'AI Face-Off YouTube Thumbnail',
    category: 'Thumbnail',
    image: '/imgs/gptimage2studio/prompts/viral-youtube-ai-faceoff.webp',
    prompt:
      'Clickable creator thumbnail with human vs AI split-screen drama, bold text, arrows, and glow.',
    href: '/prompts/ai-faceoff-youtube-thumbnail',
    fullPrompt:
      'High-contrast YouTube thumbnail, dramatic split-screen face-off between human creator and glowing AI avatar, yellow and cyan typography reading "AI WON?", shocked expression, cinematic lighting, bold arrows and energy streaks, clickable creator thumbnail style, 16:9.',
  },
  {
    title: 'Red Match Day Sports Poster',
    category: 'Sports',
    image: '/imgs/gptimage2studio/prompts/match-day-red-poster.webp',
    prompt:
      'Explosive football poster with smoke, stadium lights, red-black grading, and bold match-day typography.',
    href: '/prompts/red-match-day-sports-poster',
    fullPrompt:
      'Explosive football match day poster, original male athlete in red kit sprinting through smoke and stadium lights, black and red color grading, dirt particles, dramatic side profile close-up blended with full-body action pose, huge readable headline "MATCH DAY", premium sports editorial design, 9:16 vertical.',
  },
  {
    title: 'Night Street UGC Fashion',
    category: 'Social',
    image: '/imgs/gptimage2studio/prompts/night-street-ugc-fashion.webp',
    prompt:
      'Candid fashion photo with red roses, wet pavement, restaurant glow, and direct-flash social realism.',
    href: '/prompts/night-street-ugc-fashion',
    fullPrompt:
      'Candid night street photo of an original stylish woman holding red roses outside a luxury restaurant, wet pavement, taxi headlights, warm bokeh, direct flash photography, social media UGC realism, imperfect natural pose, iPhone flash aesthetic, 4:5 vertical.',
  },
  {
    title: 'Anime Cyber Hero Sheet',
    category: 'Character',
    image: '/imgs/gptimage2studio/prompts/anime-cyber-hero-sheet.webp',
    prompt:
      'Cyberpunk heroine concept sheet with views, expressions, gear callouts, and game art polish.',
    href: '/prompts/anime-cyber-hero-sheet',
    fullPrompt:
      'Anime cyberpunk heroine character sheet, original female courier with blue tactical jacket, front view, side view, expressions, gear callouts, weapon accessories, clean white blueprint layout with electric blue accents, readable labels, high-detail game concept art, 16:9.',
  },
  {
    title: 'Polaroid Travel Memory Wall',
    category: 'Creative',
    image: '/imgs/gptimage2studio/prompts/polaroid-travel-memory-wall.webp',
    prompt:
      'Nostalgic wall of taped Polaroids with one traveler across cities, captions, stamps, and film grain.',
    href: '/prompts/polaroid-travel-memory-wall',
    fullPrompt:
      'A cinematic collage wall of vintage Polaroid travel photos, one stylish young woman appearing across different cities, handwritten captions, warm film grain, tape, stickers, passport stamps, soft sunlight, nostalgic 1980s instant photo aesthetic, highly detailed, 4:5.',
  },
  {
    title: 'Fitness Transformation Poster',
    category: 'Fitness',
    image: '/imgs/gptimage2studio/prompts/fitness-transformation-poster.webp',
    prompt:
      'Motivational fitness campaign poster with gym lights, training energy, and bold 30-day reset typography.',
    href: '/prompts/fitness-transformation-poster',
    fullPrompt:
      'High-impact fitness transformation poster, original athletic woman in black training outfit, split composition showing before-after energy without body shaming, gym lights, sweat particles, red and white typography reading "30 DAY RESET", premium Instagram fitness ad style, 4:5 vertical, no logo, no watermark.',
  },
  {
    title: 'Luxury Perfume Beauty Ad',
    category: 'Product',
    image: '/imgs/gptimage2studio/prompts/luxury-perfume-beauty-ad.webp',
    prompt:
      'Golden beauty campaign with perfume, silk, petals, and glossy magazine lighting.',
    href: '/prompts/luxury-perfume-beauty-ad',
    fullPrompt:
      'Luxury perfume beauty advertisement, crystal perfume bottle on champagne silk fabric, gold liquid reflections, pearl earrings, rose petals, soft spotlight, premium glossy magazine campaign, elegant serif headline "LUMIERE", clean composition, 4:5 vertical, no real brand logo.',
  },
  {
    title: 'Basketball Street Poster',
    category: 'Sports',
    image: '/imgs/gptimage2studio/prompts/basketball-street-poster.webp',
    prompt:
      'Neon street basketball dunk poster with sparks, gritty asphalt, and GAME ON headline.',
    href: '/prompts/basketball-street-poster',
    fullPrompt:
      'Dynamic street basketball poster, original player mid-air dunk at night, neon orange and teal lights, asphalt court, sparks and motion blur, dramatic low angle, bold readable headline "GAME ON", gritty urban sports design, 9:16 vertical.',
  },
  {
    title: 'K-Pop Album Cover Concept',
    category: 'Music',
    image: '/imgs/gptimage2studio/prompts/kpop-album-cover-concept.webp',
    prompt:
      'Glossy futuristic group album cover with chrome styling, pastel neon stage, and release artwork polish.',
    href: '/prompts/kpop-album-cover-concept',
    fullPrompt:
      'K-pop album cover concept with four original young performers, futuristic chrome outfits, pastel neon stage, symmetrical composition, glossy editorial lighting, readable title "ELECTRIC HEART", premium music release artwork, square format, no real celebrity likeness.',
  },
  {
    title: 'Movie Storyboard Grid',
    category: 'Creative',
    image: '/imgs/gptimage2studio/prompts/movie-storyboard-grid.webp',
    prompt:
      'Six-panel sci-fi storyboard with consistent heroine, desert portal, and cinematic teal-orange grading.',
    href: '/prompts/movie-storyboard-grid',
    fullPrompt:
      'Six-panel cinematic storyboard grid for an original sci-fi short film, consistent female explorer character, desert portal discovery, close-up reaction, wide landscape, action beat, final mystery shot, teal and orange grading, film frame borders, director notes, 16:9.',
  },
  {
    title: 'Liquid Chrome Sneaker Campaign',
    category: 'Product',
    image: '/imgs/gptimage2studio/prompts/luxury-sneaker-liquid-chrome.webp',
    prompt:
      'Floating futuristic sneaker with liquid chrome splash, electric blue trails, and premium ad lighting.',
    href: '/prompts/liquid-chrome-sneaker-campaign',
    fullPrompt:
      'Luxury sneaker campaign image, white futuristic running shoe floating above liquid chrome splash, electric blue motion trails, black studio background, premium sportswear advertising, sharp reflections, dramatic lighting, no brand logo, 4:5 vertical.',
  },
  {
    title: 'Midnight Ramen Food Poster',
    category: 'Food',
    image: '/imgs/gptimage2studio/prompts/viral-food-poster-ramen.webp',
    prompt:
      'Steaming ramen restaurant poster with chili oil splash, warm street-food lighting, and readable headline.',
    href: '/prompts/midnight-ramen-food-poster',
    fullPrompt:
      'Viral restaurant poster for spicy midnight ramen, huge steaming bowl, chili oil splash, soft-boiled egg, neon Japanese alley background, warm red-gold lighting, bold readable headline "MIDNIGHT RAMEN", appetizing food photography, 4:5 vertical.',
  },
  {
    title: 'Cute Pet Action Figure',
    category: '3D',
    image: '/imgs/gptimage2studio/prompts/cute-pet-action-figure.webp',
    prompt:
      'Corgi collectible toy box with clear plastic window, playful accessories, and product-photo realism.',
    href: '/prompts/cute-pet-action-figure',
    fullPrompt:
      'Cute corgi dog action figure inside a collectible toy box, clear plastic window packaging, tiny skateboard and tennis ball accessories, playful pastel design, realistic product photography on a desk, readable label "HAPPY CORGI", square format.',
  },
  {
    title: 'Cyberpunk Electric Car Ad',
    category: 'Automotive',
    image: '/imgs/gptimage2studio/prompts/cyberpunk-car-ad.webp',
    prompt:
      'Futuristic electric sports car ad with rainy neon street reflections and NEXT DRIVE headline.',
    href: '/prompts/cyberpunk-electric-car-ad',
    fullPrompt:
      'Futuristic electric sports car advertisement, black concept car speeding through rainy cyberpunk city street, blue and pink neon reflections, motion blur, dramatic cinematic lighting, bold readable headline "NEXT DRIVE", premium automotive campaign, 16:9.',
  },
  {
    title: 'Fashion Magazine Cover',
    category: 'Fashion',
    image: '/imgs/gptimage2studio/prompts/fashion-magazine-cover.webp',
    prompt:
      'Luxury fashion cover with sculptural red dress, AURA masthead, and clean editorial typography.',
    href: '/prompts/fashion-magazine-cover',
    fullPrompt:
      'Luxury fashion magazine cover, original model wearing sculptural red dress against clean white studio, dramatic shadow, elegant typography, masthead "AURA", cover lines about spring style, premium editorial photography, 4:5 vertical, no celebrity likeness.',
  },
  {
    title: 'Kyoto After Dark Travel Poster',
    category: 'Travel',
    image: '/imgs/gptimage2studio/prompts/travel-poster-kyoto-night.webp',
    prompt:
      'Lantern-lit Kyoto night travel poster with rain reflections, warm red-gold palette, and elegant headline.',
    href: '/prompts/kyoto-after-dark-travel-poster',
    fullPrompt:
      'Premium travel poster for Kyoto at night, lantern-lit alley, rain reflections, temple silhouette, traveler with umbrella, warm red and gold palette, elegant headline "KYOTO AFTER DARK", cinematic tourism campaign, 9:16 vertical.',
  },
  {
    title: 'Future City 2030 Infographic',
    category: 'Infographic',
    image: '/imgs/gptimage2studio/prompts/future-city-infographic.webp',
    prompt:
      'Editorial smart-city infographic with isometric buildings, robots, data lines, and readable labels.',
    href: '/prompts/future-city-2030-infographic',
    fullPrompt:
      'Beautiful editorial infographic explaining "AI CITY 2030", isometric futuristic city blocks, autonomous vehicles, solar roofs, delivery robots, data lines, clean labels, dark navy background with neon accents, high readability, magazine-quality information design, 16:9.',
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
    image: '/imgs/gptimage2studio/webp/edit-demo-background-replacement.webp',
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
  'GPT Image 2 Studio is a web workspace for AI image creation. Bring a prompt or a reference image, pick GPT Image 2 or Nano Banana, and walk away with product photos, posters, social ads, infographics, and UI mockups in minutes — no design software, no API setup.';

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
    nanoBanana: 'Generation typically takes around 10–15 seconds per image.',
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
    copy: 'GPT Image 2 is OpenAI\'s first image model with native reasoning. It plans the composition, verifies the layout, and follows multi-constraint briefs in a single prompt — fewer "almost right" generations, less iteration.',
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

export const launchOffer = {
  // 倒计时长度（小时）。每次进入 /pricing 都重新计时，不持久化。
  durationHours: 10,
  eyebrow: 'Launch offer',
  title: '50% OFF',
  description:
    "Congrats! You've unlocked special pricing for GPT Image 2 Studio.",
  cta: 'Claim Special Pricing',
};

export type PricingBilling = 'monthly' | 'yearly' | 'packs';

export type PricingPlan = {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  annualPrice?: string;
  discountLabel?: string;
  unit: string;
  billingNote: string;
  credits: string;
  creditValue: string;
  cta: string;
  productId?: string;
  amount?: number;
  interval?: 'one-time' | 'month' | 'year';
  validDays?: number;
  featured?: boolean;
  badge?: string;
  href?: string;
  icon?: 'bolt' | 'crown';
  features: string[];
};

const starterMonthlyPlan: PricingPlan = {
  name: 'Starter',
  description:
    'Perfect for trying out AI image generation and small projects.',
  price: '$14.99',
  unit: '/ mo',
  billingNote: 'Billed monthly. Cancel anytime.',
  credits: '350 credits / month',
  creditValue: '100 credits ≈ $4.28',
  cta: 'Buy Now',
  productId: 'starter-monthly',
  amount: 1499,
  interval: 'month',
  validDays: 30,
  icon: 'bolt',
  features: [
    '350 monthly generation credits',
    'GPT Image 2 and Nano Banana model picker',
    'Text-to-image and image edit workflows',
    '1K, 2K, and 4K output options',
    'Prompt library access',
    'Commercial usage for generated assets',
  ],
};

const proMonthlyPlan: PricingPlan = {
  name: 'Pro',
  description:
    'Ideal for creators, designers, and content professionals.',
  price: '$39.99',
  originalPrice: '$69',
  unit: '/ mo',
  billingNote: 'Billed monthly. Cancel anytime.',
  credits: '1,600 credits / month',
  creditValue: '100 credits ≈ $2.50',
  cta: 'Buy Now',
  productId: 'pro-monthly',
  amount: 3999,
  interval: 'month',
  validDays: 30,
  featured: true,
  badge: 'Most Popular',
  icon: 'crown',
  features: [
    '1,600 AI generation credits per month',
    'GPT Image 2 and Nano Banana workflows',
    'Up to 4K resolution',
    'Up to 10 reference images per edit',
    'Batch output for campaign variations',
    'Priority processing speed',
    'Commercial usage for generated assets',
  ],
};

const premiumMonthlyPlan: PricingPlan = {
  name: 'Premium',
  description:
    'For teams, agencies, and high-volume commercial use.',
  price: '$119',
  originalPrice: '$187',
  unit: '/ mo',
  billingNote: 'Billed monthly. Built for repeat production.',
  credits: '5,500 credits / month',
  creditValue: '100 credits ≈ $2.16',
  cta: 'Buy Now',
  productId: 'premium-monthly',
  amount: 11900,
  interval: 'month',
  validDays: 30,
  icon: 'bolt',
  features: [
    '5,500 AI generation credits per month',
    'Everything in Pro',
    'Fastest generation queue',
    'Permanent project history',
    'Reusable brand and campaign workflows',
    'Priority customer support',
    'Commercial usage for client work',
  ],
};

export const pricingPlansByBilling: Record<
  Exclude<PricingBilling, 'packs'>,
  PricingPlan[]
> = {
  monthly: [starterMonthlyPlan, proMonthlyPlan, premiumMonthlyPlan],
  yearly: [
    {
      ...starterMonthlyPlan,
      price: '$10.49',
      originalPrice: '$14.99',
      annualPrice: '$126.00/ Year',
      discountLabel: 'Save 30%',
      billingNote: 'One yearly payment. Cancel anytime.',
      credits: '4,200 credits / year',
      productId: 'starter-yearly',
      amount: 12600,
      interval: 'year',
      validDays: 365,
      creditValue: '100 credits ≈ $3.00',
    },
    {
      ...proMonthlyPlan,
      price: '$19.99',
      originalPrice: '$39.99',
      annualPrice: '$239.94/ Year',
      discountLabel: 'Save 50%',
      billingNote: 'One yearly payment. Cancel anytime.',
      credits: '19,200 credits / year',
      productId: 'pro-yearly',
      amount: 23994,
      interval: 'year',
      validDays: 365,
      creditValue: '100 credits ≈ $1.25',
    },
    {
      ...premiumMonthlyPlan,
      price: '$59.5',
      originalPrice: '$119',
      annualPrice: '$714.00/ Year',
      discountLabel: 'Save 50%',
      billingNote: 'One yearly payment. Built for repeat production.',
      credits: '66,000 credits / year',
      productId: 'premium-yearly',
      amount: 71400,
      interval: 'year',
      validDays: 365,
      creditValue: '100 credits ≈ $1.08',
    },
  ],
};

export const creditPacks: PricingPlan[] = [
  {
    name: 'Starter Credits Pack',
    description:
      'One-time purchase, credits valid for 1 year.',
    price: '$29.99',
    originalPrice: '$40',
    unit: '',
    billingNote: 'One-time purchase, credits valid for 1 year',
    credits: '1,000 credits',
    creditValue: '100 credits ≈ $3.00',
    cta: 'Buy Now',
    productId: 'credits-1000',
    amount: 2999,
    interval: 'one-time',
    validDays: 365,
    icon: 'bolt',
    features: [
      'Use with GPT Image 2 or Nano Banana',
      'Text-to-image and image edit workflows',
      'Works alongside subscription credits',
      'No subscription upgrade required',
    ],
  },
  {
    name: 'Professional Credits Pack',
    description:
      'One-time purchase, credits valid for 1 year.',
    price: '$99.99',
    originalPrice: '$120',
    unit: '',
    billingNote: 'One-time purchase, credits valid for 1 year',
    credits: '4,000 credits',
    creditValue: '100 credits ≈ $2.50',
    cta: 'Buy Now',
    productId: 'credits-4000',
    amount: 9999,
    interval: 'one-time',
    validDays: 365,
    featured: true,
    badge: 'Most Popular',
    icon: 'crown',
    features: [
      'Use with GPT Image 2 or Nano Banana',
      'Enough for 1,000 text-to-image generations at 2K',
      'Good for ads, thumbnails, and poster batches',
      'Works alongside subscription credits',
    ],
  },
  {
    name: 'Premium Credits Pack',
    description:
      'One-time purchase, credits valid for 1 year, perfect for professional designers.',
    price: '$230',
    originalPrice: '$400',
    unit: '',
    billingNote: 'One-time purchase, credits valid for 1 year',
    credits: '10,000 credits',
    creditValue: '100 credits ≈ $2.30',
    cta: 'Buy Now',
    productId: 'credits-10000',
    amount: 23000,
    interval: 'one-time',
    validDays: 365,
    icon: 'bolt',
    features: [
      'Use with GPT Image 2 or Nano Banana',
      'Enough for 2,500 text-to-image generations at 2K',
      'Good for high-volume campaign iteration',
      'Works alongside subscription credits',
    ],
  },
];

export const pricing = [
  {
    name: 'Starter',
    body: 'Perfect for trying out AI image generation and small projects.',
    price: '$14.99',
    originalPrice: '',
    unit: '/ mo',
    annualPrice: '',
    discountLabel: '',
    credits: '350 credits / month',
    creditValue: '100 credits ≈ $4.28',
    cta: 'Buy Now',
    href: '/pricing',
    featured: false,
  },
  {
    name: 'Pro',
    body: 'Ideal for creators, designers, and content professionals.',
    price: '$39.99',
    originalPrice: '$69',
    unit: '/ mo',
    annualPrice: '',
    discountLabel: '',
    credits: '1,600 credits / month',
    creditValue: '100 credits ≈ $2.50',
    cta: 'Buy Now',
    href: '/pricing',
    featured: true,
  },
  {
    name: 'Premium',
    body: 'For teams, agencies, and high-volume commercial use.',
    price: '$119',
    originalPrice: '$187',
    unit: '/ mo',
    annualPrice: '',
    discountLabel: '',
    credits: '5,500 credits / month',
    creditValue: '100 credits ≈ $2.16',
    cta: 'Buy Now',
    href: '/pricing',
    featured: false,
  },
];

export const pricingCreditUsage = [
  {
    mode: 'Text-to-image',
    values: ['1K: 2 credits', '2K: 4 credits', '4K: 8 credits'],
  },
  {
    mode: 'Image edit',
    values: ['1K: 4 credits', '2K: 8 credits', '4K: 16 credits'],
  },
];

export const pricingComparisonGroups = [
  {
    title: 'Usage',
    rows: [
      ['Included credits', '350 / month', '1,600 / month', '5,500 / month'],
      ['Generation speed', 'Standard queue', 'Priority queue', 'Fastest queue'],
      ['Batch output', 'Small projects', 'Campaign variations', 'High-volume sets'],
    ],
  },
  {
    title: 'Models',
    rows: [
      ['GPT Image 2', 'Included', 'Included', 'Included'],
      ['Nano Banana Pro', 'Included', 'Included', 'Included'],
      ['4K output', 'Limited by credits', 'Included', 'Included'],
    ],
  },
  {
    title: 'Workflow',
    rows: [
      ['Reference images', 'Basic uploads', 'Up to 10 references', 'Up to 10 references'],
      ['Prompt templates', 'Included', 'Included', 'Included'],
      ['Project history', 'Recent tasks', 'Saved history', 'Permanent history'],
    ],
  },
  {
    title: 'License',
    rows: [
      ['Commercial usage', 'Generated assets', 'Generated assets', 'Client work'],
      ['Private workspace', 'Account only', 'Account only', 'Team-ready workflows'],
    ],
  },
  {
    title: 'Support',
    rows: [
      ['Support level', 'Community updates', 'Priority support', 'Priority support'],
      ['Best for', 'Small projects', 'Active creators', 'Agencies and teams'],
    ],
  },
];

export const pricingFaqs = [
  {
    q: 'What payment methods are supported?',
    a: 'We support the payment methods enabled in checkout, including major cards and available third-party payment options. All payments are processed through secure payment providers; GPT Image 2 Studio does not store your card details.',
  },
  {
    q: 'What are annual, monthly subscriptions, and credit packs?',
    a: 'Monthly subscriptions renew and refill credits every month. Annual subscriptions are paid once per year and unlock the discounted yearly credit allocation. Credit packs are one-time top-ups that do not create a subscription.',
  },
  {
    q: 'How do GPT Image 2 Studio credits work?',
    a: 'Credits are consumed when you generate or edit images. Text-to-image starts at 2 credits for 1K, while image editing starts at 4 credits for 1K. Higher resolution and more outputs use more credits before the job starts.',
  },
  {
    q: 'Do credits expire?',
    a: 'Subscription credits are intended for the current billing period. Credit packs are valid for 1 year from purchase and can be used alongside subscription credits.',
  },
  {
    q: 'Can I use generated images commercially?',
    a: 'Paid plans include commercial usage for generated assets, as long as your use complies with the model providers, applicable law, and third-party rights.',
  },
  {
    q: 'Does GPT Image 2 Studio include Nano Banana?',
    a: 'Yes. The model picker lets you switch between GPT Image 2 and Nano Banana per task, so you can choose the best model for product shots, portraits, posters, reference edits, and campaign variations.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Monthly and yearly subscriptions can be managed from account billing after purchase. Cancellation stops future renewals and does not remove credits already issued for the paid period.',
  },
  {
    q: 'How do I buy more credits?',
    a: 'Choose Credits Packs on this pricing page when you need extra generations without changing your subscription. Packs are useful for launches, client batches, and short-term creative spikes.',
  },
  {
    q: 'What happens if payment fails?',
    a: 'No credits are added until the payment provider confirms the transaction. You can retry checkout or choose a different payment method if available.',
  },
  {
    q: 'Is GPT Image 2 Studio built for teams?',
    a: 'Premium is designed for agencies, ecommerce teams, and repeat campaign workflows. Team seat management can be added later without changing the current credit model.',
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
    quote: "GPT Image 2 is insane for branding. Designers, we're cooked.",
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
    a: 'GPT Image 2 Studio offers a Free tier for trying core prompts plus Pro and Studio plans for higher-volume creators and teams. See the pricing page for current credits and limits.',
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
  secondary: { label: 'View Plans', href: '/pricing' },
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
