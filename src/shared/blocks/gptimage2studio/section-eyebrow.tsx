import { ReactNode } from 'react';

export function SectionEyebrow({
  children,
  badgeTextClassName,
}: {
  children: ReactNode;
  badgeTextClassName: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase ${badgeTextClassName}`}
    >
      <span className="size-1 rounded-full bg-current" />
      {children}
    </span>
  );
}
