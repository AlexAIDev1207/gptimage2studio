import { ReactNode } from 'react';

import { AppRuntimeProvider } from '@/shared/contexts/app-runtime-provider';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return <AppRuntimeProvider>{children}</AppRuntimeProvider>;
}
