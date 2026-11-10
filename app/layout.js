import { Analytics } from "@vercel/analytics/next";
import AnalyticsEvents from "./analytics-events";
import BrandHeader from "./brand-header";

export const metadata = {
  applicationName: "InstantReply AI Agent",
  title: "InstantReply AI Agent | AI Customer Support Automation",
  description:
    "InstantReply AI Agent helps support teams reduce repetitive reply work with context-aware AI drafts, human review, and multi-channel customer support workflows.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "InstantReply AI Agent",
    description:
      "Context-aware AI agent for customer support teams that drafts replies across email, chat, Slack, and WhatsApp while keeping humans in control.",
    type: "website",
    siteName: "InstantReply AI Agent",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#020617", color: "white", fontFamily: "Arial, sans-serif" }}>
        <BrandHeader />
        {children}
        <Analytics />
        <AnalyticsEvents />
      </body>
    </html>
  );
}
