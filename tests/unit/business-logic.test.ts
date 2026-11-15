import { describe, expect, it } from "vitest";
import { calculateSaleTotals, isLowStock } from "@dukaan360/business-logic";

describe("calculateSaleTotals", () => {
  it("sums lines, applies discount and tax", () => {
    const totals = calculateSaleTotals(
      [
        { quantity: 2, unitPrice: 100, discount: 0, tax: 0 },
        { quantity: 1, unitPrice: 50, discount: 10, tax: 5 },
      ],
      { discount: 10, tax: 0 },
    );
    // lines: 200 + (50 - 10 + 5) = 245; order discount 10 -> 235
    expect(totals.subtotal).toBe(245);
    expect(totals.total).toBe(235);
  });
});

describe("isLowStock", () => {
  it("flags stock at or below the reorder level", () => {
    expect(isLowStock(5, 5)).toBe(true);
    expect(isLowStock(4, 5)).toBe(true);
    expect(isLowStock(6, 5)).toBe(false);
  });
});
