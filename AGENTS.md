# Scrollitis

Static game in `public/` (plain HTML/CSS/JS), deployed to Cloudflare Workers with `make deploy`.

## Never use ad-like class names or IDs

Content blockers (Safari extensions, uBlock, AdGuard, etc.) apply EasyList's cosmetic rules, which hide
elements by class name — e.g. `##.is-ad`, `##.ad-cta`, `##.ad-footer`, `##.ad-hero`, `##.ad-hint`,
`##.ad-title`. When the ad slot was `.is-ad` it got `display: none`, so the feed silently ended at the
last reel and players were stuck (only for people with a blocker, including in private browsing).

- The in-game ad uses the `pitch` prefix: `.is-pitch`, `.pitch-x`, `.pitch-cta`, etc. Keep it that way.
- Avoid `ad`, `ads`, `advert`, `sponsor`, `promo`, `banner` in any class/ID. The JS-internal
  `type: "ad"` is fine since it never reaches the DOM.
- When adding a class, check it: `curl -sL https://easylist.to/easylist/easylist.txt | grep -xF '##.your-class'`.
