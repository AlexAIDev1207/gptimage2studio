import type { Metadata } from 'next';

import { ChatGenerator } from '@/shared/blocks/chat/generator';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ChatPage() {
  return <ChatGenerator />;
}
