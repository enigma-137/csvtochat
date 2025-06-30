import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { UserLimitsProvider } from "@/hooks/UserLimitsContext";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CSV2Chat",
  description: "Talk with your CSV with Together.ai",
  openGraph: {
    images: ["https://csvtochat.com/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.variable} antialiased`}>
        <UserLimitsProvider>
          {children}
          <Toaster richColors />
        </UserLimitsProvider>
      </body>
    </html>
  );
}
