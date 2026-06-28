# Font Files Required

This directory must contain the following WOFF2 font files for the typography system to work.
If the files are absent, `next/font/local` falls back silently to Inter — no build error.

## Clash Display (Display font — hero headlines)

Download from: https://www.fontshare.com/fonts/clash-display

```
ClashDisplay-Medium.woff2    (weight: 500)
ClashDisplay-Semibold.woff2  (weight: 600)
ClashDisplay-Bold.woff2      (weight: 700)
```

## JetBrains Mono (Monospace — code snippets, stat values)

Download from: https://www.jetbrains.com/lp/mono/ or via npm:
```bash
npm install @fontsource/jetbrains-mono
```
Then copy from node_modules/@fontsource/jetbrains-mono/files/:
```
JetBrainsMono-Regular.woff2  (weight: 400)
JetBrainsMono-Medium.woff2   (weight: 500)
```

Alternatively, use the Google Fonts CDN version by replacing `localFont` in `layout.js`
with a `next/font/google` import:
```js
import { JetBrains_Mono } from 'next/font/google';
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
```
