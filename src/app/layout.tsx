import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DynamicClerk } from '@/components/providers/dynamic-clerk';
import { QueryProvider } from '@/components/providers/query-provider';
import { TourProvider } from '@/components/onboarding/tour-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Routiq - Active Patient Management",
  description: "Smart patient management with churn analysis and rebooking automation for healthcare providers",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon-57x57.png', sizes: '57x57' },
      { url: '/apple-icon-60x60.png', sizes: '60x60' },
      { url: '/apple-icon-72x72.png', sizes: '72x72' },
      { url: '/apple-icon-76x76.png', sizes: '76x76' },
      { url: '/apple-icon-114x114.png', sizes: '114x114' },
      { url: '/apple-icon-120x120.png', sizes: '120x120' },
      { url: '/apple-icon-144x144.png', sizes: '144x144' },
      { url: '/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/apple-icon-180x180.png', sizes: '180x180' }
    ],
    other: [
      { rel: 'apple-touch-icon-precomposed', url: '/apple-icon-precomposed.png' },
      { rel: 'msapplication-TileImage', url: '/ms-icon-144x144.png' },
      { rel: 'msapplication-config', url: '/browserconfig.xml' }
    ]
  },
  manifest: '/manifest.json',
  other: {
    'msapplication-TileColor': '#ffffff'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <QueryProvider>
          <DynamicClerk>
            <TourProvider>
              {children}
            </TourProvider>
          </DynamicClerk>
        </QueryProvider>
      </body>
    </html>
  );
} 
