// Pure business functions — no I/O, fully unit-tested (tests/unit/).

export interface SaleLine {
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
}

export interface SaleTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

/** Line total = qty * price - line discount + line tax. */
export function lineTotal(line: SaleLine): number {
  return line.quantity * line.unitPrice - line.discount + line.tax;
}

/** Sale totals: subtotal of lines, then order-level discount and tax. */
export function calculateSaleTotals(
  lines: SaleLine[],
  order: { discount?: number; tax?: number } = {},
): SaleTotals {
  const subtotal = lines.reduce((sum, l) => sum + lineTotal(l), 0);
  const discount = order.discount ?? 0;
  const tax = order.tax ?? 0;
  return { subtotal, discount, tax, total: subtotal - discount + tax };
}

/** True when stock is at or below the reorder level. */
export function isLowStock(onHand: number, reorderLevel: number): boolean {
  return onHand <= reorderLevel;
}

/** Khata balance: positive = customer owes the business. */
export function ledgerBalance(opening: number, debits: number, credits: number): number {
  return opening + debits - credits;
}
