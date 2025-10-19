Dyslexia eBook - Multilingual (English + Urdu Naskh)

Quick Start:
1) npm install
2) npm run dev
3) Open http://localhost:3000

Routes:
- /stories     -> story selection menu (click a story to open reader)
- /reader/[id] -> reader for story id (0-based index)

Notes:
- Language toggle available (English / اردو). Language preference is saved in localStorage.
- Urdu pages use RTL layout for readability. Urdu text uses simple Naskh-friendly rendering.
- Read Aloud sets utterance.lang to 'en-US' or 'ur' where possible (voice availability varies by browser/OS).
- Page flip sound provided via remote sound file.
