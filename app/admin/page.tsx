import { notFound } from "next/navigation";
import AdminClient from "./AdminClient";

export default function AdminPage() {
  // Scheme C: only enable /admin in local development.
  // Production deploy will return 404 (so no one can browse it online).
  const enabled = process.env.NODE_ENV === "development";
  if (!enabled) notFound();

  return <AdminClient />;
}

