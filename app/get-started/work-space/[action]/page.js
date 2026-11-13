import { notFound } from "next/navigation";

const actions = ["email", "text", "call", "profile"];

export function generateStaticParams() {
  return actions.map((action) => ({ action }));
}

export default function ResponseActionPage({ params }) {
  if (!actions.includes(params.action)) {
    notFound();
  }
  return null;
}
