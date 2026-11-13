# UI sounds

Short synthesized blips (35–120 ms), played at 12–35% volume. To change them, replace the files
(same names) or the paths in `providers/SoundProvider.tsx` → `SOUNDS`. Keep each clip short
(under ~150 ms) and quiet. Sound is off by default; visitors turn it on with the header toggle.

| File             | Used for                                                                 |
| ---------------- | ------------------------------------------------------------------------ |
| `click.wav`      | Clicking buttons, nav links, filters, the form submit and footer links/CTA |
| `hover.wav`      | Hovering those same elements (mouse only, throttled)                     |
| `toggle-on.wav`  | Turning sound on with the header toggle                                  |
| `toggle-off.wav` | Turning sound off with the header toggle                                 |

Elements opt in with a `data-sound` attribute; the provider plays hover/click for them.
