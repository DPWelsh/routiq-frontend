import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DynamicClerk } from '@/components/providers/dynamic-clerk';
import { QueryProvider } from '@/components/providers/query-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Routiq - Active Patient Management",
  description: "Smart patient management with churn analysis and rebooking automation for healthcare providers",
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/site.webmanifest',
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
            {children}
          </DynamicClerk>
        </QueryProvider>
      </body>
    </html>
  );
} 
