export const metadata = {
  title: "Dyslexia eBook - Multilingual",
  description: "Dyslexia-friendly storybook in English and Urdu (Naskh)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* OpenDyslexic font for Latin, and fallback for Urdu Naskh rendering */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic@latest/OD_1.0.0/od.css"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
