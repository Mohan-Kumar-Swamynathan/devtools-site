interface Intent {
  type: 'greeting' | 'list_tools' | 'find_tool' | 'tool_help' | 'navigate' | 'how_to' | 'thanks' | 'bye' | 'fill_input' | 'calculate' | 'read_result' | 'explore' | 'clear' | 'unknown';
  query?: string;
  toolSlug?: string;
  field?: string;
  value?: any;
}

const patterns: { type: Intent['type']; patterns: RegExp[] }[] = [
  {
    type: 'greeting',
    patterns: [/^(hi|hello|hey|howdy|hola|sup)/i]
  },
  {
    type: 'list_tools',
    patterns: [
      /what (tools|can you do)/i,
      /show (me )?(all )?tools/i,
      /list (all )?(the )?tools/i,
      /what do you have/i
    ]
  },
  {
    type: 'find_tool',
    patterns: [
      /find( me)?( a)? (.+) tool/i,
      /i need( a)? (.+)/i,
      /looking for (.+)/i,
      /search( for)? (.+)/i
    ]
  },
  {
    type: 'navigate',
    patterns: [
      /go to (.+)/i,
      /open (.+)/i,
      /take me to (.+)/i,
      /navigate to (.+)/i,
      /show me (.+)/i
    ]
  },
  {
    type: 'tool_help',
    patterns: [
      /how (do i |to )?(use )?(.+)/i,
      /help( me)? with (.+)/i,
      /explain (.+)/i,
      /what is (.+)/i
    ]
  },
  {
    type: 'how_to',
    patterns: [
      /how does (this|it) work/i,
      /how to use/i,
      /help$/i
    ]
  },
  {
    type: 'thanks',
    patterns: [/thank/i, /thanks/i, /thx/i]
  },
  {
    type: 'bye',
    patterns: [/bye/i, /goodbye/i, /see you/i, /later/i]
  },
  {
    type: 'fill_input',
    patterns: [
      /set (.+?) (?:to|as|is|at) (.+)/i,
      /fill (.+?) (?:with|to|as) (.+)/i,
      /put (.+?) (?:as|to|at) (.+)/i,
      /enter (.+?) (?:as|to|at) (.+)/i,
      /(.+?) (?:is|should be|equals) (.+)/i,
      // More specific fallback patterns for common tool fields
      /(?:loan|principal|amount) (?:is|to|at)? (\d+(?:\.\d+)?(?:k|K|m|M)?)/i,
      /(?:interest|rate) (?:is|to|at)? (\d+(?:\.\d+)?)/i,
      /(?:term|duration|years?|months?) (?:is|to|at)? (\d+)/i,
      // Generic fallback: "field value" where value looks like a number or short word
      /^(.+?)\s+(\d+(?:\.\d+)?(?:k|K|m|M)?|\w{1,20})$/i
    ]
  },
  {
    type: 'calculate',
    patterns: [
      /calculate/i,
      /compute/i,
      /(?:what'?s|what is) (?:the |my )?(?:result|answer|emi|payment|calculation)/i,
      /(?:show|give|tell) (?:me )?(?:the )?(?:result|answer|emi|payment)/i,
      /(?:get|do) (?:the )?calculation/i
    ]
  },
  {
    type: 'read_result',
    patterns: [
      /(?:what'?s|what is) (?:the |my )?(?:result|answer|emi|payment|total|output)/i,
      /(?:show|tell|read) (?:me )?(?:the )?(?:result|answer|emi|payment|total)/i,
      /(?:get|give) (?:me )?(?:the )?(?:result|answer|emi|payment)/i
    ]
  },
  {
    type: 'explore',
    patterns: [
      /explore (?:this )?(?:tool|page)/i,
      /(?:what can|what does) (?:this )?(?:tool|page) (?:do|calculate)/i,
      /(?:how do|how to) (?:use|work with) (?:this )?(?:tool|page)/i,
      /(?:tell|show) (?:me )?(?:about|what) (?:this )?(?:tool|page)/i,
      /(?:what'?s|what is) (?:this )?(?:tool|page)/i
    ]
  },
  {
    type: 'clear',
    patterns: [
      /clear (?:all )?(?:inputs|fields|data|values)/i,
      /reset (?:all )?(?:inputs|fields|data|values)/i,
      /(?:remove|delete) (?:all )?(?:inputs|fields|data|values)/i
    ]
  }
];

export function matchIntent(query: string): Intent {
  for (const { type, patterns: regexList } of patterns) {
    for (const regex of regexList) {
      const match = query.match(regex);
      if (match) {
        // Extract query from capture groups
        const capturedQuery = match[match.length - 1]?.replace(/[?.!]/g, '').trim();
        
        // Handle fill_input intent - extract field and value
        if (type === 'fill_input') {
          let field: string | undefined;
          let value: string | undefined;
          
          // For patterns with explicit separators (set X to Y)
          if (match.length >= 3 && match[1] && match[2]) {
            field = match[1].replace(/[?.!]/g, '').trim().toLowerCase();
            value = match[2].replace(/[?.!]/g, '').trim();
          } else if (match.length >= 2 && match[1]) {
            // For patterns like "loan amount 500000" - try to extract field and value
            const fullMatch = match[0] || query;
            const parts = fullMatch.split(/\s+/);
            
            // Look for numeric value at the end
            const lastPart = parts[parts.length - 1];
            const numMatch = lastPart.match(/^(\d+(?:\.\d+)?(?:k|K|m|M)?)$/i);
            
            if (numMatch && parts.length >= 2) {
              // Extract field name (everything except the last numeric part)
              field = parts.slice(0, -1).join(' ').toLowerCase();
              value = lastPart;
            } else if (parts.length >= 2) {
              // Fallback: use first part as field, last part as value
              field = parts.slice(0, -1).join(' ').toLowerCase();
              value = parts[parts.length - 1];
            }
          }
          
          if (field && value) {
            // Clean up field name (remove common words)
            field = field
              .replace(/^(set|fill|put|enter|make)\s+/i, '')
              .replace(/\s+(to|as|is|at|with)$/i, '')
              .trim();
            
            // Try to parse value as number (handle k, K, m, M suffixes)
            let parsedValue: string | number = value;
            const numMatch = value.match(/^(\d+(?:\.\d+)?)(k|K|m|M)?$/i);
            if (numMatch) {
              let num = parseFloat(numMatch[1]);
              const suffix = numMatch[2]?.toLowerCase();
              if (suffix === 'k') num *= 1000;
              else if (suffix === 'm') num *= 1000000;
              parsedValue = num;
            } else {
              const numValue = parseFloat(value);
              if (!isNaN(numValue)) {
                parsedValue = numValue;
              }
            }
            
            return { 
              type, 
              query: capturedQuery, 
              toolSlug: capturedQuery,
              field,
              value: parsedValue
            };
          }
        }
        
        return { type, query: capturedQuery, toolSlug: capturedQuery };
      }
    }
  }
  return { type: 'unknown', query };
}

