import "@/styles/globals.css";

import { Roboto } from "next/font/google";

export const metadata = {
  title: "Magic Chords",
  description: "Generate your chords progression on the fly.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};


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
      <body>{children}</body>
    </html>
  );
}
