const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/demo", label: "Demo" },
  { href: "/pricing", label: "Pricing" },
  { href: "/landing-page#billing", label: "Billing/Subscription" },
  { href: "/get-started", label: "All-in-One" },
];

export default function BrandHeader() {
  return (
    <header
      style={{
        background: "#020617",
        borderBottom: "1px solid #1e293b",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          minHeight: "76px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/"
          aria-label="OfficeVault AI home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.7rem",
            color: "white",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "1.05rem",
          }}
        >
          <svg aria-hidden="true" viewBox="0 0 64 64" width="38" height="38">
            <rect width="64" height="64" rx="16" fill="#0f172a" />
            <path d="M14 18a8 8 0 0 1 8-8h21a8 8 0 0 1 8 8v17a8 8 0 0 1-8 8H31l-11 9v-9h-1a8 8 0 0 1-8-8V18Z" fill="#38bdf8" />
            <path d="M22 25h21M22 33h14" fill="none" stroke="#082f49" strokeLinecap="round" strokeWidth="4" />
            <path d="m39 36 8 6-8 6" fill="none" stroke="#7dd3fc" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          </svg>
          <span>
            OfficeVault <span style={{ color: "#7dd3fc" }}>AI</span>
          </span>
        </a>

        <nav
          aria-label="Main navigation"
          style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{ color: "#dfe7f5", textDecoration: "none", fontSize: "0.95rem" }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
