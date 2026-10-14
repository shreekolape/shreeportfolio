import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { WhatIDo } from "@/components/sections/WhatIDo";
import { StackMarquee } from "@/components/sections/StackMarquee";

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
