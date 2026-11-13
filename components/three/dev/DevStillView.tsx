"use client";

import dynamic from "next/dynamic";

// Reads the URL on the client only, so the scene never renders on the server.
const DevStill = dynamic(() => import("./DevStill"), { ssr: false });

/** /dev/still?state=sleep&shot=hero&t=0 — see DevStill. */
export default function DevStillView() {
  return (
    <div className="fixed inset-0 bg-bg">
      <DevStill />
    </div>
  );
}
