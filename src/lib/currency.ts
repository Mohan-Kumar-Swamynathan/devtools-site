/**
 * Format number in Indian currency format
 * Example: 100000 -> ₹1,00,000.00
 */
export function formatIndianCurrency(amount: number, decimals: number = 2): string {
  if (isNaN(amount) || amount === 0) {
    return `₹0${decimals > 0 ? '.' + '0'.repeat(decimals) : ''}`;
  }

  // Format with Indian number system (lakhs, crores)
  const parts = amount.toFixed(decimals).split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  // Add commas in Indian format (first 3 digits, then groups of 2)
  let formatted = '';
  const reversed = integerPart.split('').reverse();
  
  for (let i = 0; i < reversed.length; i++) {
    if (i === 3) {
      formatted = ',' + formatted;
    } else if (i > 3 && (i - 3) % 2 === 0) {
      formatted = ',' + formatted;
    }
    formatted = reversed[i] + formatted;
  }

  return `₹${formatted}${decimalPart ? '.' + decimalPart : ''}`;
}

/**
 * Parse Indian currency string to number
 * Handles ₹ symbol and commas
 */
export function parseIndianCurrency(value: string): number {
  if (!value) return 0;
  
  // Remove ₹ symbol, commas, and spaces
  const cleaned = value.replace(/[₹,\s]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format number in Indian number format (without currency symbol)
 * Example: 100000 -> 1,00,000
 */
export function formatIndianNumber(num: number, decimals: number = 0): string {
  if (isNaN(num) || num === 0) {
    return '0' + (decimals > 0 ? '.' + '0'.repeat(decimals) : '');
  }

  const parts = num.toFixed(decimals).split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  // Add commas in Indian format
  let formatted = '';
  const reversed = integerPart.split('').reverse();
  
  for (let i = 0; i < reversed.length; i++) {
    if (i === 3) {
      formatted = ',' + formatted;
    } else if (i > 3 && (i - 3) % 2 === 0) {
      formatted = ',' + formatted;
    }
    formatted = reversed[i] + formatted;
  }

  return formatted + (decimalPart ? '.' + decimalPart : '');
}





