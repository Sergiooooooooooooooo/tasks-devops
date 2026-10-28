import { describe, it, expect } from "vitest";
import { cleanTitle, sortTasks, countPending, MAX_TITLE } from "./tasks";

describe("cleanTitle", () => {
  it("quita espacios sobrantes", () => {
    expect(cleanTitle("  Comprar   pan  ")).toBe("Comprar pan");
  });
  it("rechaza vacío o solo espacios", () => {
    expect(cleanTitle("   ")).toBeNull();
    expect(cleanTitle("")).toBeNull();
  });
  it("rechaza títulos demasiado largos", () => {
    expect(cleanTitle("a".repeat(MAX_TITLE + 1))).toBeNull();
    expect(cleanTitle("a".repeat(MAX_TITLE))).not.toBeNull();
  });
  it("rechaza valores que no son texto", () => {
    expect(cleanTitle(null)).toBeNull();
    expect(cleanTitle(42)).toBeNull();
  });
});

describe("sortTasks", () => {
  it("pone pendientes primero y las más recientes arriba", () => {
    const list = [
      { id: "a", done: true, createdAt: 3 },
      { id: "b", done: false, createdAt: 1 },
      { id: "c", done: false, createdAt: 2 },
    ];
    expect(sortTasks(list).map((t) => t.id)).toEqual(["c", "b", "a"]);
  });
});

describe("countPending", () => {
  it("cuenta solo las no terminadas", () => {
    expect(countPending([{ done: true }, { done: false }, { done: false }])).toBe(2);
  });
});
