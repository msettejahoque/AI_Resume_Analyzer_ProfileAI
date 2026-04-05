export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="9" fill="#2563eb" />
      <rect x="8" y="11" width="14" height="2" rx="1" fill="white" opacity="0.85" />
      <rect x="8" y="16" width="20" height="2" rx="1" fill="white" opacity="0.85" />
      <rect x="8" y="21" width="16" height="2" rx="1" fill="white" opacity="0.6" />
      <path
        d="M27 8 L28.2 11.8 L32 13 L28.2 14.2 L27 18 L25.8 14.2 L22 13 L25.8 11.8 Z"
        fill="white"
        opacity="0.95"
      />
    </svg>
  );
}

export function LogoFull() {
  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon size={32} />
      <span className="text-text-primary font-bold text-[17px] tracking-[-0.03em] leading-none">
        Profile<span className="text-brand">AI</span>
      </span>
    </div>
  );
}