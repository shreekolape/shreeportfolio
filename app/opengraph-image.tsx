import { home } from "@/content/home";
import { site } from "@/content/site";
import { ogSize, renderOgImage } from "@/lib/ogImage";

export const alt = `${site.name}: ${site.pitch}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ kicker: home.hero.smallLine, title: site.name, subtitle: site.pitch });
}
