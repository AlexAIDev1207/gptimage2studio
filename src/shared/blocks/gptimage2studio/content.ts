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
  { label: 'Blog', href: '#blog' },
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

export const workbench = {
  title: 'Create Images with GPT Image 2 Studio',
  subcopy:
    'Start from a prompt or reference image, choose a model, and preview image ideas for product, marketing, and content workflows. The MVP interface is designed around reusable prompts, clear settings, and fast creative iteration.',
  signupTitle: 'Get Early Access to GPT Image 2 Studio',
  signupBody:
    'Join the launch list to test GPT Image 2 and Nano Banana workflows when access opens.',
  signupCta: 'Sign Up Free',
  modes: ['Text-to-Image', 'Image Edit'],
  models: ['GPT Image 2', 'Nano Banana'],
  ratios: ['1:1', '4:5', '16:9', '9:16'],
  resolutions: ['Standard', 'High'],
  outputs: ['1', '2', '4'],
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
    title: 'Prompt-to-Image Creation',
    copy: 'Turn structured prompts into product photos, campaign assets, educational visuals, UI concepts, and editorial graphics.',
    image: '/imgs/gptimage2studio/webp/workbench-primary-hydra-glow-serum.webp',
    alt: 'GPT Image 2 Studio product photo preview with readable label text.',
    badge: 'Image #1',
  },
  {
    title: 'Image Editing with References',
    copy: 'Use reference images and natural-language instructions to adjust backgrounds, lighting, layout, objects, and visual style.',
    image: '/imgs/gptimage2studio/webp/edit-demo-background-replacement.webp',
    alt: 'Before and after reference image edit for product background replacement.',
    badge: 'Edit #2',
  },
  {
    title: 'Text-Rich Visuals',
    copy: 'Create posters, menu boards, labels, app screens, infographics, and ads where short readable text matters.',
    image:
      '/imgs/gptimage2studio/webp/workbench-thumb-create-forward-poster.webp',
    alt: 'Create Forward poster preview with readable GPT Image 2 generated text.',
    badge: 'Text #3',
  },
  {
    title: 'Multi-Model Studio Workflow',
    copy: 'Compare GPT Image 2 and Nano Banana style workflows from one prompt-focused workspace as the product evolves.',
    image: '/imgs/gptimage2studio/webp/usecase-infographics-ui-concepts.webp',
    alt: 'Infographic and UI concept previews for multi-model image workflows.',
    badge: 'Flow #4',
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
];

export const useCases: UseCase[] = [
  {
    title: 'Ecommerce Product Photos',
    image: '/imgs/gptimage2studio/webp/usecase-ecommerce-product-photos.webp',
    copy: 'Create clean product shots, lifestyle scenes, packaging mockups, and before/after product edits from structured prompts. GPT Image 2 Studio is useful when you need consistent ecommerce visuals without setting up a photo shoot for every product angle or campaign idea. Start with the product, define the setting, lock the label text, and generate a result that feels ready for a store page, landing page, or ad creative.',
    cta: 'Try Product Photo Prompts',
    snippet:
      'Create a premium ecommerce photo of a skincare serum bottle on a marble surface with readable label text and soft daylight.',
    href: '#prompts',
  },
  {
    title: 'Marketing Posters & Social Ads',
    image:
      '/imgs/gptimage2studio/webp/usecase-marketing-posters-social-ads.webp',
    copy: 'Turn campaign ideas into posters, story ads, thumbnails, banners, and launch visuals. Use short exact text, format-specific prompts, and visual hierarchy to create assets for product launches, newsletters, social media, events, and paid creative testing. The best prompts define the headline, subtitle, CTA, format, composition, and negative constraints in one reusable brief.',
    cta: 'Explore Marketing Prompts',
    snippet:
      'Design a launch poster with headline "CREATE FORWARD", subtitle "AI Design Summit 2026", bold typography, and blue-black geometric shapes.',
    href: '#prompts',
  },
  {
    title: 'Infographics and UI Concepts',
    image: '/imgs/gptimage2studio/webp/usecase-infographics-ui-concepts.webp',
    copy: 'Create explainers, product annotations, dashboard concepts, app screenshots, funnel diagrams, and visual drafts for content or product teams. These assets work best when the prompt specifies the exact labels, layout structure, number of sections, and visual style. Use GPT Image 2 Studio to turn rough communication ideas into structured visuals that are easier to review, rewrite, and refine.',
    cta: 'Browse UI and Infographic Prompts',
    snippet:
      'Create a launch funnel infographic with four steps: Visit, Sign Up, Create, Share, beside a clean SaaS dashboard concept.',
    href: '#prompts',
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

export const whatIsCards = [
  {
    title: 'Generate from Prompts',
    copy: 'Write structured prompts for product shots, ads, posters, thumbnails, dashboards, and infographics.',
  },
  {
    title: 'Edit with Reference Images',
    copy: 'Use existing images as starting points for background changes, object swaps, lighting fixes, and layout improvements.',
  },
  {
    title: 'Reuse Prompt Templates',
    copy: 'Save repeatable prompt patterns for ecommerce, marketing, education, UI, brand, and content workflows.',
  },
];

export const comparison = [
  {
    dimension: 'Product role',
    studio:
      'Prompt-first web studio for generating, editing, organizing, and reusing image workflows.',
    nano: 'Image model/workflow option known for image generation and editing use cases.',
  },
  {
    dimension: 'Best fit',
    studio:
      'Product photos, posters, social ads, text-rich visuals, prompt templates, and reusable creative briefs.',
    nano: 'Reference-image workflows, creative exploration, and image editing scenarios where it performs well.',
  },
  {
    dimension: 'User workflow',
    studio:
      'Start with a prompt, choose model/settings, preview results, copy prompts, and move between examples and guides.',
    nano: 'Used as one model choice inside a broader creative workflow.',
  },
  {
    dimension: 'SEO value',
    studio:
      'Gives users a landing page, prompt library, blog, examples, and use cases around GPT Image 2 workflows.',
    nano: 'Supports comparison and multi-model content, especially for users searching Nano Banana prompts.',
  },
];

export const benefits = [
  {
    title: 'One Studio for Prompt-First Image Work',
    copy: 'Keep generation, editing, examples, prompts, and model choices in one workflow instead of jumping between disconnected tools and notes.',
  },
  {
    title: 'Built Around Real Project Scenarios',
    copy: 'Use prompts for ecommerce, ads, thumbnails, infographics, UI mockups, brand visuals, and content assets that real teams need.',
  },
  {
    title: 'Prompt Library Connected to Every Workflow',
    copy: 'Every example is designed to become a prompt page, blog guide, internal link, and reusable starting point for future projects.',
  },
];

export const howToUse = [
  {
    step: '01',
    title: 'Choose GPT Image 2 or Nano Banana',
    copy: 'Pick the model workflow that best matches your task, such as product imagery, text-rich design, editing, or reference-driven visuals.',
  },
  {
    step: '02',
    title: 'Add a Prompt or Reference Image',
    copy: 'Write a structured prompt, paste a prompt template, or upload a reference image when the task starts from an existing visual.',
  },
  {
    step: '03',
    title: 'Set Ratio, Quality, and Output Count',
    copy: 'Choose the image format that matches your final use case, from square product cards to vertical ads and widescreen UI concepts.',
  },
  {
    step: '04',
    title: 'Generate, Refine, and Download',
    copy: 'Review the output, edit the prompt, improve details, and save the result for campaigns, product pages, social posts, or content.',
  },
];

export const coreFeatures = [
  {
    title: 'Text-to-Image Generator',
    copy: 'Create new visuals from structured prompts for product, marketing, education, UI, brand, and editorial workflows.',
  },
  {
    title: 'Reference Image Editing',
    copy: 'Start with an uploaded image and describe the edit you want, such as background replacement, object changes, or lighting adjustment.',
  },
  {
    title: 'Readable Text Layouts',
    copy: 'Build prompts for posters, packaging, menu boards, infographics, thumbnails, and UI mockups where short text needs to be visible.',
  },
  {
    title: 'Ecommerce Product Visuals',
    copy: 'Generate product shots, lifestyle scenes, comparison panels, and annotation graphics for stores, ads, and landing pages.',
  },
  {
    title: 'Prompt Library and Templates',
    copy: 'Use ready-made prompt patterns and long-tail prompt pages to start faster and keep image workflows consistent.',
  },
  {
    title: 'Format and Quality Controls',
    copy: 'Choose aspect ratio, output count, and quality settings before generation so each result fits the target channel.',
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
  initial: string;
  color: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: 'Maya Chen',
    role: 'Ecommerce Founder',
    handle: '@mayabuilds',
    initial: 'M',
    color: 'from-cyan-500 to-blue-500',
    quote:
      'Generated three product photo variations for my skincare line in one afternoon. The label text actually stays readable, which never worked in older models.',
  },
  {
    name: 'Diego Alvarez',
    role: 'Brand Designer',
    handle: '@diegodraws',
    initial: 'D',
    color: 'from-violet-500 to-fuchsia-500',
    quote:
      'I use it to draft launch posters with exact headlines before we book the photographer. The structured prompt approach saves a full day of mood-boarding.',
  },
  {
    name: 'Priya Raman',
    role: 'Content Marketer',
    handle: '@priyawrites',
    initial: 'P',
    color: 'from-emerald-500 to-teal-500',
    quote:
      'Infographics used to take me hours in Figma. Now I draft a prompt with the four steps I want labeled and refine the result, instead of building from scratch.',
  },
  {
    name: 'Theo Larsen',
    role: 'Indie Product Builder',
    handle: '@theobuilds',
    initial: 'T',
    color: 'from-amber-500 to-orange-500',
    quote:
      'GPT Image 2 finally gets UI mockups close enough to share with my dev team. We use it for early dashboard concepts before any real Figma work.',
  },
  {
    name: 'Amélie Roux',
    role: 'Packaging Designer',
    handle: '@ameliestudio',
    initial: 'A',
    color: 'from-rose-500 to-pink-500',
    quote:
      'Multilingual packaging mockups are the killer feature for me. English plus Japanese label text rendered correctly on a tea can — that was the moment I switched workflows.',
  },
  {
    name: 'Jordan Park',
    role: 'YouTube Creator',
    handle: '@jordanpark',
    initial: 'J',
    color: 'from-indigo-500 to-purple-500',
    quote:
      'Thumbnails with bold readable text used to mean Photoshop nights. I prompt the layout, copy the result, and iterate on the headline in minutes.',
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
    q: 'What is GPT Image 2 Studio?',
    a: 'GPT Image 2 Studio is an independent AI image generator and editor workspace for creating product photos, posters, ads, infographics, UI mockups, and text-rich visuals from prompts and reference images.',
  },
  {
    q: 'Is GPT Image 2 Studio free to use?',
    a: 'The MVP can include a free or early-access entry point, but final plan details, credits, and usage limits should be shown in the pricing section before launch.',
  },
  {
    q: 'Can I use Nano Banana inside GPT Image 2 Studio?',
    a: 'The planned workflow includes GPT Image 2 and Nano Banana as model options. Availability depends on the final model integrations used in the product.',
  },
  {
    q: 'Can GPT Image 2 Studio generate text inside images?',
    a: 'GPT Image 2 Studio is designed for text-rich visual workflows such as posters, packaging, menu boards, infographics, thumbnails, and UI mockups. For best results, prompts should use short quoted text and clear layout instructions.',
  },
  {
    q: 'Can I edit existing images?',
    a: 'The planned editing workflow supports reference-image tasks such as background replacement, lighting adjustment, object replacement, and layout refinement. Exact behavior depends on the model and integration used.',
  },
  {
    q: 'What prompts work best for GPT Image 2?',
    a: 'The best prompts describe the asset type, subject, exact text, layout, lighting, style, aspect ratio, and constraints. For example, a product photo prompt should name the product, surface, label text, lighting, camera style, and things to avoid.',
  },
  {
    q: 'Is GPT Image 2 Studio good for ecommerce and marketing?',
    a: 'Yes, the homepage workflow is focused on ecommerce and marketing use cases such as product photos, social ads, posters, landing page visuals, product annotations, and reusable prompt templates.',
  },
];

export const finalCta = {
  title: 'Start Creating with GPT Image 2 Studio',
  subcopy:
    'Use prompts, references, and model controls to turn image ideas into product visuals, ads, explainers, and text-rich creative assets.',
  primary: { label: 'Start Creating', href: '#workbench' },
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
