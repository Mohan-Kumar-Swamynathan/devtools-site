import { getToolBySlug, type Tool } from '@/lib/tools';

export interface ToolContext {
  tool: Tool | null;
  inputs: Record<string, any>;
  results: Record<string, any>;
  hasResults: boolean;
  pageType: 'tool' | 'home' | 'other';
}

/**
 * Get current tool from URL
 */
export function getCurrentTool(): Tool | null {
  if (typeof window === 'undefined') return null;
  
  const path = window.location.pathname;
  const slug = path.replace(/^\//, '').replace(/\/$/, '');
  
  if (!slug || slug === 'index.html' || slug === '') {
    return null; // Home page
  }
  
  return getToolBySlug(slug) || null;
}

/**
 * Extract input values from DOM using data attributes
 */
function extractInputs(toolSlug: string): Record<string, any> {
  const inputs: Record<string, any> = {};
  
  // Find all inputs with data-tool-input attribute
  const inputElements = document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    '[data-tool-input]'
  );
  
  inputElements.forEach((element) => {
    const key = element.getAttribute('data-tool-input');
    if (key) {
      const value = element.value;
      // Try to parse as number if it looks like a number
      const numValue = parseFloat(value);
      inputs[key] = isNaN(numValue) || value !== numValue.toString() ? value : numValue;
    }
  });
  
  return inputs;
}

/**
 * Extract result values from DOM using data attributes
 */
function extractResults(toolSlug: string): Record<string, any> {
  const results: Record<string, any> = {};
  
  // Find all elements with data-tool-result attribute
  const resultElements = document.querySelectorAll('[data-tool-result]');
  
  resultElements.forEach((element) => {
    const key = element.getAttribute('data-tool-result');
    if (key) {
      const text = element.textContent?.trim() || '';
      // Try to extract numeric value (remove currency symbols ₹, $, commas)
      const numMatch = text.replace(/[₹$,]/g, '').match(/[\d,]+\.?\d*/);
      if (numMatch) {
        // Remove commas from Indian format (1,00,000 -> 100000)
        const cleaned = numMatch[0].replace(/,/g, '');
        const numValue = parseFloat(cleaned);
        results[key] = isNaN(numValue) ? text : numValue;
      } else {
        results[key] = text;
      }
    }
  });
  
  return results;
}

/**
 * Get context for loan calculator specifically
 */
function getLoanCalculatorContext(): ToolContext {
  const tool = getCurrentTool();
  if (!tool || tool.slug !== 'loan-calculator') {
    return { tool: null, inputs: {}, results: {}, hasResults: false, pageType: 'other' };
  }
  
  const inputs = extractInputs('loan-calculator');
  const results = extractResults('loan-calculator');
  
  // Also try to read from common input patterns if data attributes aren't present
  if (Object.keys(inputs).length === 0) {
    const allNumberInputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="number"]'));
    const principalInput = allNumberInputs.find(input => 
      input.placeholder?.includes('100000') || 
      input.previousElementSibling?.textContent?.toLowerCase().includes('loan amount')
    ) || allNumberInputs[0];
    const interestInput = allNumberInputs.find(input => 
      input.previousElementSibling?.textContent?.toLowerCase().includes('interest')
    ) || allNumberInputs[1];
    const termInput = allNumberInputs.find(input => 
      input.previousElementSibling?.textContent?.toLowerCase().includes('term')
    ) || allNumberInputs[2];
    const termSelect = document.querySelector<HTMLSelectElement>('select');
    
    if (principalInput && principalInput.value) {
      const val = parseFloat(principalInput.value);
      inputs.principal = isNaN(val) ? principalInput.value : val;
    }
    if (interestInput && interestInput.value) {
      const val = parseFloat(interestInput.value);
      inputs.interestRate = isNaN(val) ? interestInput.value : val;
    }
    if (termInput && termInput.value) {
      const val = parseFloat(termInput.value);
      inputs.loanTerm = isNaN(val) ? termInput.value : val;
    }
    if (termSelect) inputs.termType = termSelect.value;
  }
  
  // Try to read results from common patterns (support both ₹ and $)
  if (Object.keys(results).length === 0) {
    const emiElement = document.querySelector('[class*="text-3xl"], [class*="font-bold"]');
    if (emiElement && (emiElement.textContent?.includes('₹') || emiElement.textContent?.includes('$'))) {
      const emiText = emiElement.textContent.replace(/[₹$,]/g, '').replace(/,/g, '');
      const emiValue = parseFloat(emiText);
      if (!isNaN(emiValue)) {
        results.emi = emiValue;
      }
    }
  }
  
  return {
    tool,
    inputs,
    results,
    hasResults: Object.keys(results).length > 0 && (results.emi > 0 || results.totalAmount > 0),
    pageType: 'tool'
  };
}

/**
 * Get context for mortgage calculator
 */
function getMortgageCalculatorContext(): ToolContext {
  const tool = getCurrentTool();
  if (!tool || tool.slug !== 'mortgage-calculator') {
    return { tool: null, inputs: {}, results: {}, hasResults: false, pageType: 'other' };
  }
  
  const inputs = extractInputs('mortgage-calculator');
  const results = extractResults('mortgage-calculator');
  
  return {
    tool,
    inputs,
    results,
    hasResults: Object.keys(results).length > 0,
    pageType: 'tool'
  };
}

/**
 * Get generic tool context
 */
function getGenericToolContext(): ToolContext {
  const tool = getCurrentTool();
  if (!tool) {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html' || path === '') {
      return { tool: null, inputs: {}, results: {}, hasResults: false, pageType: 'home' };
    }
    return { tool: null, inputs: {}, results: {}, hasResults: false, pageType: 'other' };
  }
  
  const inputs = extractInputs(tool.slug);
  const results = extractResults(tool.slug);
  
  return {
    tool,
    inputs,
    results,
    hasResults: Object.keys(results).length > 0,
    pageType: 'tool'
  };
}

/**
 * Get full context for current page
 */
export function getToolContext(): ToolContext {
  if (typeof window === 'undefined') {
    return { tool: null, inputs: {}, results: {}, hasResults: false, pageType: 'other' };
  }
  
  const tool = getCurrentTool();
  
  // Tool-specific context extractors
  if (tool?.slug === 'loan-calculator') {
    return getLoanCalculatorContext();
  }
  
  if (tool?.slug === 'mortgage-calculator') {
    return getMortgageCalculatorContext();
  }
  
  // Generic context for other tools
  return getGenericToolContext();
}

/**
 * Get a human-readable description of current context
 */
export function getContextDescription(context: ToolContext): string {
  if (context.pageType === 'home') {
    return "You're on the home page. I can help you find tools!";
  }
  
  if (!context.tool) {
    return "I'm not sure which tool you're using. How can I help?";
  }
  
  const parts: string[] = [`You're using ${context.tool.name} ${context.tool.icon}`];
  
  if (Object.keys(context.inputs).length > 0) {
    const inputSummary = Object.entries(context.inputs)
      .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    
    if (inputSummary) {
      parts.push(`Current inputs: ${inputSummary}`);
    }
  }
  
  if (context.hasResults) {
    parts.push('Results are available.');
  } else if (Object.keys(context.inputs).length > 0) {
    parts.push('Ready to calculate!');
  } else {
    parts.push('Enter values to get started.');
  }
  
  return parts.join(' ');
}

/**
 * Check if a tool has inputs that can be filled
 */
export function canFillInputs(context: ToolContext): boolean {
  return context.pageType === 'tool' && context.tool !== null;
}

/**
 * Check if a tool can calculate results
 */
export function canCalculate(context: ToolContext): boolean {
  if (context.pageType !== 'tool' || !context.tool) return false;
  
  // Check if there are inputs with values
  const hasInputValues = Object.values(context.inputs).some(
    value => value !== '' && value !== null && value !== undefined && value !== 0
  );
  
  return hasInputValues;
}

