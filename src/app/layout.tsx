import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { PresetProvider } from '@/contexts/PresetContext';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "PixelGlow - AI-Powered Photo Transformation",
  description: "Transform your photos with AI using professional style presets. Upload any photo and get LinkedIn-ready, artistic, or creative transformations in seconds. No prompt writing needed - just choose your style and download.",
  keywords: ["AI photo editing", "photo transformation", "AI image generation", "professional headshots", "creative photo effects", "DALL-E", "Flux AI"],
  authors: [{ name: "PixelGlow Team" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "PixelGlow - AI-Powered Photo Transformation",
    description: "Transform your photos with AI using professional style presets. No complex prompts needed.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "PixelGlow Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelGlow - AI-Powered Photo Transformation",
    description: "Transform your photos with AI using professional style presets. No complex prompts needed.",
    images: ["/web-app-manifest-512x512.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider >
      <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <PresetProvider>
            {children}
          </PresetProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
