import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react"
import { Roboto } from "next/font/google";
import Script from 'next/script';

export const metadata = {
  title: "Magic Chords",
  description: "Generate your chords progression on the fly.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],

}


const roboto = Roboto({
  weight:["100" , "300" , "400" , "500" , "700" , "900"],
  subsets: ["latin"]
})
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.className}`}>
      <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                strategy="afterInteractive"
            />
      <Analytics />
      <body>{children}</body>
    </html>
  );
}
