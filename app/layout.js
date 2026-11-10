import { Analytics } from "@vercel/analytics/next";
import AnalyticsEvents from "./analytics-events";

export const metadata = {
  title: "InstantReply AI Agent | AI Customer Support Automation",
  description:
    "InstantReply AI Agent helps support teams reduce response time with context-aware AI reply drafts, human review, and multi-channel support workflows.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "InstantReply AI Agent",
    description:
      "Context-aware AI agent for enterprise support teams that drafts replies in under 30 seconds across email, chat, Slack, and WhatsApp.",
    type: "website",
  },
};

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
