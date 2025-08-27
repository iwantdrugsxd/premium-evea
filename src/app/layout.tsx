import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ScrollBlobs from "@/components/ScrollBlobs";
// import CustomCursor from "@/components/CustomCursor"; // Temporarily disabled
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "EVEA - Redefining Event Excellence",
  description: "End-to-end event management with dedicated teams, verified vendors, and transparent pricing. Transform your vision into reality with our expert team and revolutionary platform.",
  keywords: "event management, event planning, wedding planning, corporate events, event vendors, event services",
  authors: [{ name: "EVEA Team" }],
  openGraph: {
    title: "EVEA - Redefining Event Excellence",
    description: "End-to-end event management with dedicated teams, verified vendors, and transparent pricing.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Liquid Background */}
        <div className="liquid-bg">
          <div className="liquid-blob blob1"></div>
          <div className="liquid-blob blob2"></div>
          <div className="liquid-blob blob3"></div>
          <div className="liquid-blob blob4"></div>
          <div className="liquid-blob blob5"></div>
        </div>

        {/* Grid Overlay */}
        <div className="grid-overlay"></div>

        {/* Grain Overlay */}
        <div className="grain"></div>

        {/* Custom Cursor */}
        {/* <CustomCursor /> */} {/* Temporarily disabled */}

        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
