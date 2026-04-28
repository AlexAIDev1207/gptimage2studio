'use client';

import { ReactNode } from 'react';

import { AuthRuntime } from '@/shared/blocks/sign/auth-runtime';

import { AppContextProvider } from './app';

export function AppRuntimeProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AppContextProvider>
      {children}
      <AuthRuntime />
    </AppContextProvider>
  );
}
