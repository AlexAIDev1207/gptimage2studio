import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { envConfigs } from '@/config';

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Image
        src={envConfigs.app_logo}
        alt={envConfigs.app_name}
        width={80}
        height={80}
      />
      <h1 className="text-2xl font-normal">Page not found</h1>
      <Link
        href="/"
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
