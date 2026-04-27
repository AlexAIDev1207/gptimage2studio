import Script from 'next/script';

/**
 * Google Analytics 4 注入组件。
 *
 * 在 root layout 渲染。仅当 NEXT_PUBLIC_GA_ID 配置（生产环境）时才注入脚本，
 * 避免开发/预览环境污染统计数据。
 *
 * Consent Mode v2：默认 analytics_storage=granted（仅匿名分析），未启用 ad_storage，
 * 无需 cookie consent banner 即可符合大多数地区合规要求。
 */
export default function GA4() {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID;

  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'analytics_storage': 'granted',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
          });
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
