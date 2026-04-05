'use client';
import { useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-brand font-medium cursor-pointer bg-transparent border-none hover:opacity-80 transition-opacity"
    >
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  );
}


