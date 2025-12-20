import { getToolContext, type ToolContext } from './context';

export interface ToolAction {
  type: 'fill_input' | 'calculate' | 'read_result' | 'clear' | 'explore';
  field?: string;
  value?: any;
  success?: boolean;
  message?: string;
}

/**
 * Fill an input field with a value
 */
export function fillInput(field: string, value: any): ToolAction {
  if (typeof window === 'undefined') {
    return { type: 'fill_input', field, value, success: false, message: 'Not available' };
  }
  
  try {
    // Try data attribute first
    let element = document.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      `[data-tool-input="${field}"]`
    );
    
    // Fallback: try to find by label or placeholder with better field name matching
    if (!element) {
      // Normalize field name for matching (e.g., "loan amount" -> "principal", "interest rate" -> "interestRate")
      const fieldMap: Record<string, string> = {
        'loan amount': 'principal',
        'principal': 'principal',
        'amount': 'principal',
        'interest rate': 'interestRate',
        'interest': 'interestRate',
        'rate': 'interestRate',
        'loan term': 'loanTerm',
        'term': 'loanTerm',
        'years': 'termType',
        'months': 'termType',
        'duration': 'loanTerm'
      };
      
      const normalizedField = fieldMap[field.toLowerCase()] || field.toLowerCase();
      
      // Try data attribute with normalized field
      element = document.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        `[data-tool-input="${normalizedField}"]`
      ) || null;
      
      // Try by label
      if (!element) {
        const labels = Array.from(document.querySelectorAll('label'));
        const label = labels.find(l => {
          const labelText = l.textContent?.toLowerCase() || '';
          return labelText.includes(field.toLowerCase()) || 
                 labelText.includes(normalizedField) ||
                 (field.toLowerCase().includes('amount') && labelText.includes('amount')) ||
                 (field.toLowerCase().includes('interest') && labelText.includes('interest')) ||
                 (field.toLowerCase().includes('term') && labelText.includes('term'));
        });
        
        if (label) {
          const labelFor = label.getAttribute('for');
          if (labelFor) {
            element = document.querySelector(`#${labelFor}`) as HTMLInputElement;
          } else {
            // Find input after label
            const input = label.nextElementSibling as HTMLInputElement;
            if (input && (input.tagName === 'INPUT' || input.tagName === 'SELECT' || input.tagName === 'TEXTAREA')) {
              element = input;
            }
          }
        }
      }
      
      // Another fallback: find by placeholder or name
      if (!element) {
        const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input, select, textarea'));
        element = inputs.find(input => {
          const placeholder = input.placeholder?.toLowerCase() || '';
          const name = input.name?.toLowerCase() || '';
          const id = input.id?.toLowerCase() || '';
          const searchTerm = field.toLowerCase();
          const normalizedSearch = normalizedField;
          return placeholder.includes(searchTerm) || 
                 placeholder.includes(normalizedSearch) ||
                 name.includes(searchTerm) || 
                 name.includes(normalizedSearch) ||
                 id.includes(searchTerm) ||
                 id.includes(normalizedSearch);
        }) || null;
      }
    }
    
    if (!element) {
      return { 
        type: 'fill_input', 
        field, 
        value, 
        success: false, 
        message: `Could not find input field: ${field}` 
      };
    }
    
    // Set the value
    if (element.tagName === 'SELECT') {
      // For select, try to match option text or value
      const select = element as HTMLSelectElement;
      const options = Array.from(select.options);
      const matchingOption = options.find(opt => 
        opt.text.toLowerCase().includes(String(value).toLowerCase()) ||
        opt.value.toLowerCase() === String(value).toLowerCase()
      );
      
      if (matchingOption) {
        select.value = matchingOption.value;
      } else {
        select.value = String(value);
      }
    } else {
      (element as HTMLInputElement | HTMLTextAreaElement).value = String(value);
    }
    
    // Trigger input event to notify React/other frameworks
    const event = new Event('input', { bubbles: true });
    element.dispatchEvent(event);
    
    // Also trigger change event
    const changeEvent = new Event('change', { bubbles: true });
    element.dispatchEvent(changeEvent);
    
    // Focus the element briefly to show it was updated
    element.focus();
    setTimeout(() => element.blur(), 500);
    
    return { 
      type: 'fill_input', 
      field, 
      value, 
      success: true, 
      message: `Set ${field} to ${value}` 
    };
  } catch (error) {
    return { 
      type: 'fill_input', 
      field, 
      value, 
      success: false, 
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Trigger a calculation (if the tool has a calculate button or auto-calculates)
 */
export function triggerCalculation(): ToolAction {
  if (typeof window === 'undefined') {
    return { type: 'calculate', success: false, message: 'Not available' };
  }
  
  try {
    const context = getToolContext();
    
    // For tools that auto-calculate (like LoanCalculator), just check if inputs are filled
    if (context.tool?.slug === 'loan-calculator') {
      // LoanCalculator auto-calculates, so we just need to ensure inputs trigger recalculation
      // Trigger change events on all inputs to force recalculation
      const inputs = document.querySelectorAll<HTMLInputElement>('input[type="number"]');
      inputs.forEach(input => {
        if (input.value) {
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      
      return { 
        type: 'calculate', 
        success: true, 
        message: 'Calculation updated' 
      };
    }
    
    // Look for a calculate button
    const calculateButton = document.querySelector<HTMLButtonElement>(
      'button[data-tool-action="calculate"], button:has-text("Calculate"), button:has-text("Calculate"), [class*="calculate"]'
    );
    
    // Try to find button by text content
    if (!calculateButton) {
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button'));
      const calcButton = buttons.find(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        return text.includes('calculate') || text.includes('compute') || text.includes('calculate');
      });
      
      if (calcButton) {
        calcButton.click();
        return { 
          type: 'calculate', 
          success: true, 
          message: 'Calculation triggered' 
        };
      }
    } else {
      calculateButton.click();
      return { 
        type: 'calculate', 
        success: true, 
        message: 'Calculation triggered' 
      };
    }
    
    return { 
      type: 'calculate', 
      success: false, 
      message: 'No calculate button found. The tool may auto-calculate.' 
    };
  } catch (error) {
    return { 
      type: 'calculate', 
      success: false, 
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Read results from the tool
 */
export function readResults(): ToolAction {
  if (typeof window === 'undefined') {
    return { type: 'read_result', success: false, message: 'Not available' };
  }
  
  try {
    const context = getToolContext();
    
    if (!context.hasResults) {
      return { 
        type: 'read_result', 
        success: false, 
        message: 'No results available yet. Please fill in the inputs and calculate.' 
      };
    }
    
    // Try to read from data attributes first
    const resultElements = document.querySelectorAll('[data-tool-result]');
    const results: Record<string, any> = {};
    
    resultElements.forEach(element => {
      const key = element.getAttribute('data-tool-result');
      if (key) {
        const text = element.textContent?.trim() || '';
        results[key] = text;
      }
    });
    
    // If no data attributes, try to read from common result patterns
    if (Object.keys(results).length === 0) {
      // Look for large text (usually results) - check for Indian currency format
      const largeTextElements = document.querySelectorAll('[class*="text-3xl"], [class*="text-2xl"], [class*="font-bold"]');
      largeTextElements.forEach(element => {
        const text = element.textContent?.trim() || '';
        // Check for Indian currency (₹) or dollar ($) or just numbers with commas
        if (text && (text.includes('₹') || text.includes('$') || text.match(/[\d,]+\.?\d*/))) {
          const label = element.previousElementSibling?.textContent?.trim() || 
                       element.parentElement?.querySelector('div')?.textContent?.trim() || 
                       'result';
          results[label.toLowerCase().replace(/\s+/g, '_')] = text;
        }
      });
    }
    
    if (Object.keys(results).length === 0) {
      return { 
        type: 'read_result', 
        success: false, 
        message: 'Could not read results. They may not be displayed yet.' 
      };
    }
    
    const resultText = Object.entries(results)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    
    return { 
      type: 'read_result', 
      success: true, 
      message: `Results: ${resultText}` 
    };
  } catch (error) {
    return { 
      type: 'read_result', 
      success: false, 
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Clear all inputs
 */
export function clearInputs(): ToolAction {
  if (typeof window === 'undefined') {
    return { type: 'clear', success: false, message: 'Not available' };
  }
  
  try {
    const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input[data-tool-input], textarea[data-tool-input], input[type="number"], input[type="text"]'
    );
    
    inputs.forEach(input => {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    return { 
      type: 'clear', 
      success: true, 
      message: 'All inputs cleared' 
    };
  } catch (error) {
    return { 
      type: 'clear', 
      success: false, 
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Get tool-specific guidance/exploration info
 */
export function exploreTool(context: ToolContext): string {
  if (!context.tool) {
    return "I'm not sure which tool you're using. Try asking me to find a specific tool!";
  }
  
  const parts: string[] = [
    `**${context.tool.name}** ${context.tool.icon}`,
    '',
    context.tool.description || context.tool.tagline,
    ''
  ];
  
  // Tool-specific guidance
  if (context.tool.slug === 'loan-calculator') {
    parts.push('**What you can do:**');
    parts.push('• Set loan amount: "set loan amount to 500000" or "loan amount 1000000"');
    parts.push('• Set interest rate: "set interest rate to 8.5" or "interest rate 7.5"');
    parts.push('• Set loan term: "set loan term to 20 years" or "term 15 years"');
    parts.push('• Calculate EMI: "calculate" or "what\'s my EMI" or "calculate EMI"');
    parts.push('• Read results: "what\'s the monthly payment" or "show results"');
    parts.push('• Clear inputs: "clear all" or "reset"');
  } else {
    parts.push('**Features:**');
    parts.push('• Fill inputs using voice or text commands');
    parts.push('• Calculate results');
    parts.push('• Read calculated values');
  }
  
  if (Object.keys(context.inputs).length > 0) {
    parts.push('');
    parts.push('**Current inputs:**');
    Object.entries(context.inputs).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        parts.push(`• ${displayKey}: ${value}`);
      }
    });
  }
  
  if (context.hasResults) {
    parts.push('');
    parts.push('✅ **Results are available!**');
    parts.push('Say "what\'s the result" or "read results" to see them.');
  } else if (Object.keys(context.inputs).length > 0) {
    parts.push('');
    parts.push('💡 **Ready to calculate!**');
    parts.push('Say "calculate" to get results.');
  } else {
    parts.push('');
    parts.push('💡 **Get started:**');
    parts.push('Use voice or text commands to fill inputs, then calculate!');
  }
  
  return parts.join('\n');
}

