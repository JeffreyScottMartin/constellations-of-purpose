import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Constellations of Purpose",
  description: "Coming Soon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-[url('/bgimage.webp')] bg-opacity-50 bg-cover bg-center`}
      >
        <main className="p-6 flex justify-center w-full max-w-full overflow-hidden">
          <div className="hidden md:block fixed top-2 left-2 z-50 text-zinc-200 text-xs">
            Jeffrey Scott Martin -{" "}
            <strong>GitHub Copilot 1-Day Build Challenge</strong>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
