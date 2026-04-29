import { ReactNode } from 'react';
import Script from 'next/script';

import { AnalyticsConfigs, AnalyticsProvider } from '.';

/**
 * Plausible analytics configs
 * 适配 Plausible CE v3+ 的 init() 风格 snippet（hash 文件名内置 domain）。
 * 旧版 data-domain 风格已不再使用，domain 字段仅作为 UI 标签保留。
 * @docs https://plausible.io/docs/plausible-script
 */
export interface PlausibleAnalyticsConfigs extends AnalyticsConfigs {
  domain?: string; // 仅用于配置 UI 显示，不参与脚本注入
  src: string; // 完整 script URL，例如 https://analysis.example.com/js/pa--xxx.js
}

/**
 * Plausible provider
 * @website https://plausible.io/
 */
export class PlausibleAnalyticsProvider implements AnalyticsProvider {
  readonly name = 'plausible';

  configs: PlausibleAnalyticsConfigs;

  constructor(configs: PlausibleAnalyticsConfigs) {
    this.configs = configs;
  }

  getHeadScripts(): ReactNode {
    return (
      <>
        {/* Plausible Analytics: init queue stub + init() 触发上报 */}
        <Script
          id={this.name}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`,
          }}
        />
        <Script src={this.configs.src} strategy="afterInteractive" async />
      </>
    );
  }
}
