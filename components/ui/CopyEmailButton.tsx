"use client";

import { useState } from "react";

/** Small icon button next to the footer's "Email" link: copies the address, briefly shows "Copied". */
export function CopyEmailButton({ email, ariaLabel, copiedLabel }: { email: string; ariaLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (old browser, insecure context, denied permission): no-op.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-sound=""
      aria-label={ariaLabel}
      className="relative inline-flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:text-accent"
    >
      {copied ? (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5">
          <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3 3 7-7" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5">
          <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            d="M3.5 10.5h-.75A1.25 1.25 0 0 1 1.5 9.25v-6.5A1.25 1.25 0 0 1 2.75 1.5h6.5a1.25 1.25 0 0 1 1.25 1.25v.75"
          />
        </svg>
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
      {copied && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-fg px-2 py-0.5 font-mono text-[10px] text-bg"
        >
          {copiedLabel}
        </span>
      )}
    </button>
  );
}
