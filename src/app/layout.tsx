/**
 * layout.tsx
 *
 * Layout for the Cabinette application.
 * - Sets up global metadata/styles/page structure.
 * - Wraps all pages with Redux provider and shared header/navigation.
 */
import type { Metadata } from "next";
import ClientProvider from "./store/provider";
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
                <a
                  href="https://github.com/vmgaribay/cabinette-frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About (GitHub
                  <span aria-label="external link" role="img">
                    🔗
                  </span>
                  )
                </a>
              </li>
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
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
