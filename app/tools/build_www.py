#!/usr/bin/env python3
"""Builds app/www/index.html from the web game (../arkana10.html by default).
Swaps the CDN scripts and Google Fonts for local copies so the app works offline
and passes App Store review without network dependencies, and loads native-bridge.js."""
import re, sys, pathlib
app = pathlib.Path(__file__).resolve().parent.parent
src = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else app.parent / 'index.html'
s = src.read_text()
s = re.sub(r'<link rel="preconnect"[^>]*>\s*', '', s)
s = re.sub(r'<link href="https://fonts.googleapis.com[^>]*>', '<style>'
  "@font-face{font-family:'Fredoka';font-weight:300 700;font-display:swap;src:url(fonts/fredoka-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212,U+FEFF,U+FFFD}"
  "@font-face{font-family:'Fredoka';font-weight:300 700;font-display:swap;src:url(fonts/fredoka-latin-ext.woff2) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1EFF,U+20A0-20AB,U+20AD-20CF}"
  "@font-face{font-family:'Bangers';font-weight:400;font-display:swap;src:url(fonts/bangers-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212,U+FEFF,U+FFFD}"
  "@font-face{font-family:'Bangers';font-weight:400;font-display:swap;src:url(fonts/bangers-latin-ext.woff2) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1EFF,U+20A0-20AB,U+20AD-20CF}"
  '</style>', s)
s = s.replace('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>', '<script src="three.min.js"></script>\n<script src="three-post.js"></script>\n<script src="native-bridge.js"></script>')
s = re.sub(r'<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/[^"]*"></script>\s*', '', s)
# the web page's CDN fallback for three.js is not needed in the app (three.js is bundled)
s = re.sub(r'<script>window\.THREE \|\| document\.write\(.*?</script>\s*', '', s)
left = re.findall(r'(?:src|href)="(https?://[^"]+)"', s)
if left: sys.exit('external resources still referenced: %s' % left)
(app / 'www' / 'index.html').write_text(s)
print('www/index.html written from', src.name, len(s), 'bytes')
