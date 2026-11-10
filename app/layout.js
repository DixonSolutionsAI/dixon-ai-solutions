import { Analytics } from "@vercel/analytics/next";
import AnalyticsEvents from "./analytics-events";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <AnalyticsEvents />
      </body>
    </html>
  );
}
