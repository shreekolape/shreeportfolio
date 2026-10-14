import type { Metadata } from "next";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { WhatIDo } from "@/components/sections/WhatIDo";
import { StackMarquee } from "@/components/sections/StackMarquee";

export const metadata: Metadata = pageMetadata({ description: site.pitch, path: "/" });

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <SelectedWork />
      <WhatIDo />
      <StackMarquee />
    </>
  );
}
