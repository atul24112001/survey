import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Survey",
  description:
    "This app is result of my curiosity during the lock sabha election 2024.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="w-[90%] min-h-screen sm:w-[80%] md:w-[70%] lg:w-[40%] xl:w-[30%] m-auto py-4 flex flex-col">
          <div className="flex-1">{children}</div>
          <div className="mt-4">
            <p className="text-xs text-center text-gray-300">
              We will only save your info like country, city, state, coordinates
              and ip, just for counting purposes.
            </p>
            <p className="text-xs text-center text-gray-300">
              🇮🇳 All rights 2024 ©{" "}
              <a href="https://github.com/atul24112001">Atul</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
