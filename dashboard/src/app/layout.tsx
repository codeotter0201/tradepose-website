import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fira_Code } from "next/font/google";
import { ClerkProviderWrapper } from "@/components/providers/clerk-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "TradePose Dashboard",
  description: "Manage your API keys, monitor usage, and control your trading platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProviderWrapper>
      <html lang="zh-TW" className="dark">
        <body
          className={`${plusJakarta.variable} ${firaCode.variable} font-sans antialiased`}
        >
          <QueryProvider>
            {children}
          </QueryProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
