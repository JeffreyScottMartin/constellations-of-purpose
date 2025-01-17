export const metadata = {
  title: "Constellations of Purpose",
  description: "Visualize your goals and tasks as constellations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark text-white">
        <header className="p-4 bg-black shadow-md">
          <h1 className="text-2xl font-bold text-center">
            Constellations of Purpose
          </h1>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
