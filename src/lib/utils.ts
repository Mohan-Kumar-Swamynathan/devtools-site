// ... existing code ...

/**
 * Format number as Indian currency (₹ with Indian numbering system)
 * Example: 100000 -> ₹1,00,000.00
 */
export function formatIndianCurrency(amount: number, decimals: number = 2): string {
  if (isNaN(amount) || amount === 0) {
    return `₹0${decimals > 0 ? '.' + '0'.repeat(decimals) : ''}`;
  }

  // Split into integer and decimal parts
  const parts = amount.toFixed(decimals).split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  // Indian numbering system: first 3 digits from right, then groups of 2
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
 * Example: "₹1,00,000" or "1,00,000" -> 100000
 */
export function parseIndianCurrency(value: string): number {
  if (!value) return 0;
  
  // Remove currency symbol, spaces, and commas
  const cleaned = value
    .replace(/₹/g, '')
    .replace(/,/g, '')
    .replace(/\s/g, '')
    .trim();
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Unescape HTML entities
 */
export function unescapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&#39;': "'"
  };
  return text.replace(/&(amp|lt|gt|quot|#039|#39);/g, (m) => map[m] || m);
}

/**
 * Generate a random string of specified length
 */
export function randomString(length: number, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}
