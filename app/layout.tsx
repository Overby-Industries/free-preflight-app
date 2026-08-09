import type { Metadata, Viewport } from "next";
import { instrumentSerif, syne, dmMono } from '@/app/ui/fonts';
import React from 'react';
import "@/app/ui/globals.css";
import { ThemeProvider } from '@/app/context/theme-context';

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem('freeflight-theme');
    var theme = stored === 'day' ? 'day' : 'night';
    document.documentElement.classList.add('theme-' + theme);
  } catch (e) {
    document.documentElement.classList.add('theme-night');
  }
})();
`;

const APP_NAME = "FreeFlight PWA App";
const APP_DEFAULT_TITLE = "FreeFlight";
const APP_TITLE_TEMPLATE = "FreeFlight's - PWA App";
const APP_DESCRIPTION = "Pilot pre-flight electronic flight bag";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#14100d",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${syne.variable} ${dmMono.variable} antialiased bg-[var(--color-bg)] text-[var(--color-text)]`}
      dir="ltr"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;