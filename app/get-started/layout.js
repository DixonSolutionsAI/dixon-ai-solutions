"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WorkSpace from "../work-space";
import { AccessProvider } from "./access-context";
import { StaffProvider, useStaff } from "./staff-context";

const tabs = [
  { href: "/get-started/employee", label: "Employee" },
  { href: "/get-started", label: "Work Space" },
  { href: "/get-started/company-documents", label: "Company Documents" },
  { href: "/get-started/access", label: "Access" },
];

function PersistentWorkSpace({ hidden }) {
  const { employee } = useStaff();
  return (
    <div hidden={hidden}>
      <WorkSpace key={employee?.employeeId || "none"} />
    </div>
  );
}

export default function GetStartedLayout({ children }) {
  const pathname = usePathname();
  const isWorkSpace = pathname === "/get-started" || [
    "/get-started/work-space/email",
    "/get-started/work-space/text",
    "/get-started/work-space/call",
    "/get-started/work-space/profile",
  ].includes(pathname);

  return (
    <AccessProvider>
      <StaffProvider>
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
          const isActive = href === "/get-started" ? isWorkSpace : pathname === href;
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
      <PersistentWorkSpace hidden={!isWorkSpace} />
      {children}
      </StaffProvider>
    </AccessProvider>
  );
}
