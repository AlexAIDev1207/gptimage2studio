import type { Metadata } from 'next';

import { ChatHistory } from '@/shared/blocks/chat/history';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ChatHistoryPage() {
  return <ChatHistory />;
}
