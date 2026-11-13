"use client";

import type { ReactNode } from "react";
import { MotionPrefsProvider } from "@/providers/MotionPrefsProvider";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { AccentProvider } from "@/providers/AccentProvider";
import { SoundProvider } from "@/providers/SoundProvider";
import { TransitionProvider } from "@/providers/TransitionProvider";
import { DayCycleProvider } from "@/providers/DayCycleProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionPrefsProvider>
      <SmoothScrollProvider>
        <AccentProvider>
          <SoundProvider>
            <TransitionProvider>
              <DayCycleProvider>{children}</DayCycleProvider>
            </TransitionProvider>
          </SoundProvider>
        </AccentProvider>
      </SmoothScrollProvider>
    </MotionPrefsProvider>
  );
}
