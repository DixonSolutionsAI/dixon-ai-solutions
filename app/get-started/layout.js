"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WorkSpace from "../work-space";
import { AccessProvider } from "./access-context";

const tabs = [
  { href: "/get-started", label: "Work Space" },
  { href: "/get-started/company-documents", label: "Company Documents" },
  { href: "/get-started/access", label: "Access" },
];

export default function GetStartedLayout({ children }) {
  const pathname = usePathname();

  return (
    <AccessProvider>
      <nav
        aria-label="Get Started"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          maxWidth: "900px",
          margin: "1.5rem auto 0",
          padding: "0 20px",
          borderBottom: "1px solid #334155",
        }}
      >
        {tabs.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.75rem 1rem",
                color: isActive ? "#7dd3fc" : "#cbd5e1",
                background: isActive ? "#0f172a" : "transparent",
                border: `1px solid ${isActive ? "#334155" : "transparent"}`,
                borderBottomColor: isActive ? "#0f172a" : "transparent",
                borderRadius: "10px 10px 0 0",
                fontWeight: isActive ? 700 : 500,
                textDecoration: "none",
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div hidden={pathname !== "/get-started"}>
        <WorkSpace />
      </div>
      {children}
    </AccessProvider>
  );
}
