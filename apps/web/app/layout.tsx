import type { Metadata } from "next";
import localFont from "next/font/local";
import "@repo/ui/globals.css";
import Provider from "./provider";
import { Toaster } from "@repo/ui/components/toaster";
import { Navbar } from "@repo/ui/components/navbar";
import { headers } from "next/headers";
import Head from "next/head";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Cosmo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const url = headers().get('x-pathname') || "";
 
  return (
    <html lang="en">
      <Head>
        <title>cosmo</title>
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider>
          <Toaster />
          {url == "/user/create"?"":<Navbar></Navbar>}
          {children}
        </Provider>
      </body>
    </html>
  );
}
