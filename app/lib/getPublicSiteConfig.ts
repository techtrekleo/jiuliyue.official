import { readFile } from "node:fs/promises";
import path from "node:path";
import type { SiteConfig } from "./siteConfig";

/**
 * Server-only helper: read the public/site-config.json at request time.
 * This enables SSR-friendly metadata/structured-data without relying on client fetch.
 */
export async function getPublicSiteConfig(): Promise<SiteConfig | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "site-config.json");
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as SiteConfig;
  } catch {
    return null;
  }
}

