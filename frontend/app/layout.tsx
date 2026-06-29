import "../lib/theme/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-display" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0514' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://resume-builder-pro.vercel.app'),
  title: {
    default: "ATS Resume Builder | Professional Resume Maker",
    template: "%s | ATS Resume Builder"
  },
  description: "Create stunning, ATS-friendly professional resumes in minutes with our elegant builder. Choose from premium templates, preview in real-time, and download your pixel-perfect PDF to start applying with confidence.",
  keywords: ["resume builder", "ATS friendly resume", "professional CV maker", "resume templates", "free resume builder", "PDF resume maker", "ATS parser"],
  authors: [{ name: "Muhammad Shariq", url: "https://www.linkedin.com/in/muhammad---shariq" }],
  creator: "Muhammad Shariq",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "ATS Resume Builder | Professional Resume Maker",
    description: "Create stunning, ATS-friendly professional resumes in minutes with our elegant builder.",
    siteName: "ATS Resume Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATS Resume Builder | Professional Resume Maker",
    description: "Create stunning, ATS-friendly professional resumes in minutes.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-body bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 flex flex-col w-full relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
