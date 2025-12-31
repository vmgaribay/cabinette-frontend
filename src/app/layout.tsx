import type { Metadata } from "next";
import "./globals.css";
import "./style.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Cabinette",
  description: "Cabin site ranking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>Victoria M. Garibay, Ph.D.</title>
        <link rel="icon" type="image/png" href="/elephant-thinking-icon.png" />
      </head>
      <body className={`antialiased`}>
        <header id="header-scroll" className="shrink">
          <h1>
            <a href="https://vmgaribay.github.io/portfolio/index.html">
              Victoria M. Garibay, Ph.D.
            </a>
          </h1>
          <nav>
            <ul>
              <li>
                <a href="https://vmgaribay.github.io/portfolio/cabinette_log.html">
                  Cabinette Log
                </a>
              </li>
              <li>
                <a href="https://vmgaribay.github.io/portfolio/index.html#projects">
                  Other Projects
                </a>
              </li>
              <li>
                <a href="https://vmgaribay.github.io/portfolio/index.html#contact">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
