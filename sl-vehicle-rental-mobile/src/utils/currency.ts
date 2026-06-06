// ============================================================================
// Currency Utils - Sri Lankan Rupee formatting
// ============================================================================

const CURRENCY_SYMBOL = 'Rs.';
const CURRENCY_CODE = 'LKR';

/**
 * Format amount as Sri Lankan Rupees
 */
export const formatCurrency = (amount: number, showDecimals = false): string => {
  const formatted = showDecimals
    ? amount.toFixed(2)
    : Math.round(amount).toLocaleString('en-LK');
  return `${CURRENCY_SYMBOL} ${formatted}`;
};

/**
 * Format amount with currency code (for API/international)
 */
export const formatCurrencyCode = (amount: number): string => {
  return `${CURRENCY_CODE} ${Math.round(amount).toLocaleString('en-LK')}`;
};

/**
 * Calculate booking subtotal (daily rate * days)
 */
export const calculateSubtotal = (dailyRate: number, days: number): number => {
  return dailyRate * days;
};

/**
 * Calculate add-ons total
 */
export const calculateAddOnsTotal = (
  addOns: { price: number; quantity?: number }[]
): number => {
  return addOns.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
};

/**
 * Calculate commission
 */
export const calculateCommission = (subtotal: number, rate = 0.05): number => {
  return Math.round(subtotal * rate);
};

/**
 * Calculate total with add-ons and commission
 */
export const calculateTotal = (
  dailyRate: number,
  days: number,
  addOns: { price: number; quantity?: number }[] = []
): { subtotal: number; addOnsTotal: number; commission: number; total: number } => {
  const subtotal = calculateSubtotal(dailyRate, days);
  const addOnsTotal = calculateAddOnsTotal(addOns);
  const commission = calculateCommission(subtotal);
  const total = subtotal + addOnsTotal + commission;

  return { subtotal, addOnsTotal, commission, total };
};

/**
 * Parse currency string back to number
 */
export const parseCurrency = (str: string): number => {
  const cleaned = str.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Format price range for display
 */
export const formatPriceRange = (min: number, max: number): string => {
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
};

/**
 * Format per-day pricing
 */
export const formatPerDay = (amount: number): string => {
  return `${formatCurrency(amount)}/day`;
};
