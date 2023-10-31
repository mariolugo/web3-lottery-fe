import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { MoralisProvider } from "react-moralis";
import { Provider } from "./Provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Contract Lottery",
  description: "Smart Contract Lottery by Mario Lugo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Provider>
          <Header />
          {children}
        </Provider>
      </body>
    </html>
  );
}
