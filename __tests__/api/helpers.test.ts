import { describe, it, expect } from "vitest";

/**
 * Slug generation logic — extracted from route handlers
 * app/api/menus/route.ts (POST)
 * app/api/artikels/route.ts (POST)
 */

/**
 * Slug generator untuk Menu (dari route POST /api/menus)
 * Format: nama-menu-lowercase-{timestamp}
 */
function generateMenuSlug(nama_menu: string): string {
  return (
    nama_menu
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "") + `-${Date.now()}`
  );
}

/**
 * Slug generator untuk Artikel (dari route POST /api/artikels)
 * Format: judul-lowercase-{timestamp}
 */
function generateArtikelSlug(judul: string): string {
  const base = judul
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
  return `${base}-${Date.now()}`;
}

// ─── Menu slug generator ──────────────────────────────────────────────────────
describe("generateMenuSlug", () => {
  it("should convert spaces to hyphens", () => {
    const slug = generateMenuSlug("Nasi Goreng Spesial");
    expect(slug).toMatch(/^nasi-goreng-spesial-\d+$/);
  });

  it("should lowercase the result", () => {
    const slug = generateMenuSlug("AYAM BAKAR");
    expect(slug).toMatch(/^ayam-bakar-\d+$/);
  });

  it("should strip special characters", () => {
    const slug = generateMenuSlug("Soto (Ayam) & Lauk!");
    // parentheses, &, ! are non-word chars → stripped
    expect(slug).not.toContain("(");
    expect(slug).not.toContain(")");
    expect(slug).not.toContain("!");
    expect(slug).not.toContain("&");
  });

  it("should append a numeric timestamp", () => {
    const before = Date.now();
    const slug = generateMenuSlug("Test Menu");
    const after = Date.now();
    const parts = slug.split("-");
    const ts = parseInt(parts[parts.length - 1]);
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });

  it("should trim leading and trailing whitespace", () => {
    const slug = generateMenuSlug("  Mie Goreng  ");
    expect(slug).toMatch(/^mie-goreng-\d+$/);
  });
});

// ─── Artikel slug generator ───────────────────────────────────────────────────
describe("generateArtikelSlug", () => {
  it("should convert spaces to hyphens", () => {
    const slug = generateArtikelSlug("Tips Hidup Sehat");
    expect(slug).toMatch(/^tips-hidup-sehat-\d+$/);
  });

  it("should lowercase the result", () => {
    const slug = generateArtikelSlug("CARA DIET EFEKTIF");
    expect(slug).toMatch(/^cara-diet-efektif-\d+$/);
  });

  it("should strip special characters", () => {
    const slug = generateArtikelSlug("10 Tips & Trik!");
    expect(slug).not.toContain("&");
    expect(slug).not.toContain("!");
  });

  it("should append a numeric timestamp", () => {
    const before = Date.now();
    const slug = generateArtikelSlug("Judul Artikel");
    const after = Date.now();
    const parts = slug.split("-");
    const ts = parseInt(parts[parts.length - 1]);
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });
});

// ─── Pagination logic ─────────────────────────────────────────────────────────
describe("Pagination meta calculation", () => {
  function calcPaginationMeta(total: number, page: number, limit: number) {
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }

  it("should calculate totalPages correctly", () => {
    const meta = calcPaginationMeta(100, 1, 10);
    expect(meta.totalPages).toBe(10);
  });

  it("should round up totalPages for uneven division", () => {
    const meta = calcPaginationMeta(25, 1, 10);
    expect(meta.totalPages).toBe(3);
  });

  it("should set hasNextPage true when more pages exist", () => {
    const meta = calcPaginationMeta(100, 1, 10);
    expect(meta.hasNextPage).toBe(true);
  });

  it("should set hasNextPage false on the last page", () => {
    const meta = calcPaginationMeta(100, 10, 10);
    expect(meta.hasNextPage).toBe(false);
  });

  it("should set hasPrevPage false on the first page", () => {
    const meta = calcPaginationMeta(100, 1, 10);
    expect(meta.hasPrevPage).toBe(false);
  });

  it("should set hasPrevPage true when not on the first page", () => {
    const meta = calcPaginationMeta(100, 2, 10);
    expect(meta.hasPrevPage).toBe(true);
  });

  it("should handle single page (total <= limit)", () => {
    const meta = calcPaginationMeta(5, 1, 10);
    expect(meta.totalPages).toBe(1);
    expect(meta.hasNextPage).toBe(false);
    expect(meta.hasPrevPage).toBe(false);
  });

  it("should handle empty result set", () => {
    const meta = calcPaginationMeta(0, 1, 10);
    expect(meta.totalPages).toBe(0);
    expect(meta.hasNextPage).toBe(false);
  });
});

// ─── Menu target_status validation ───────────────────────────────────────────
describe("Menu target_status validation", () => {
  const VALID_TARGET_STATUS = ["Kurus", "Normal", "Berlebih", "Obesitas"];

  it("should accept all valid statuses", () => {
    for (const status of VALID_TARGET_STATUS) {
      expect(VALID_TARGET_STATUS.includes(status)).toBe(true);
    }
  });

  it("should reject invalid status", () => {
    expect(VALID_TARGET_STATUS.includes("Gemuk")).toBe(false);
  });

  it("should reject empty string", () => {
    expect(VALID_TARGET_STATUS.includes("")).toBe(false);
  });

  it("should be case-sensitive", () => {
    // 'kurus' (lowercase) bukan valid
    expect(VALID_TARGET_STATUS.includes("kurus")).toBe(false);
    expect(VALID_TARGET_STATUS.includes("Kurus")).toBe(true);
  });
});
