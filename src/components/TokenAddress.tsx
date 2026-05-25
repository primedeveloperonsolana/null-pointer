'use client';

import { useState } from 'react';

export default function TokenAddress() {
  const [copied, setCopied] = useState(false);
  const address = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || 'Placeholder';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 animate-fade-in-delay-1">
      <div className="text-xs text-foreground/50 mb-1 font-mono">
        {'>'} token_address --show
      </div>
      
      <button
        onClick={handleCopy}
        className={`group relative px-6 py-3 border-2 rounded-lg font-mono text-sm transition-all duration-300 token-glow ${
          copied 
            ? 'border-foreground-cyan text-foreground-cyan bg-foreground-cyan/10' 
            : 'border-foreground/40 text-foreground/80 hover:border-foreground hover:text-foreground hover:bg-foreground/5'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-foreground-amber font-bold">$NULL</span>
          <span className="text-foreground/60 hidden sm:inline">|</span>
          <span className="text-foreground/70 hidden sm:inline">{address}</span>
          <span className="text-foreground/70 sm:hidden">{address.slice(0, 8)}...{address.slice(-8)}</span>
          
          <span className="ml-2">
            {copied ? (
              <span className="text-foreground-cyan text-xs">
                [COPIED]
              </span>
            ) : (
              <span className="text-foreground/40 text-xs group-hover:text-foreground/60 transition-colors">
                [COPY]
              </span>
            )}
          </span>
        </div>
        
        {/* Scanline effect on button */}
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </div>
      </button>
      
      <div className="text-xs text-foreground/30 font-mono">
        Solana SPL Token — Click to copy
      </div>
    </div>
  );
}
