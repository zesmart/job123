import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers";

export const metadata: Metadata = {
  title: "求职记录管理 · Job Tracker",
  description:
    "个人私有的求职记录管理工具，记录每一次投递、跟踪每一步进展。",
  keywords: ["求职", "投递记录", "招聘", "Job Tracker"],
  authors: [{ name: "Personal" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground font-sans"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster />
            <SonnerToaster position="top-center" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
