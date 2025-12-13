interface Intent {
  type: 'greeting' | 'list_tools' | 'find_tool' | 'tool_help' | 'navigate' | 'how_to' | 'thanks' | 'bye' | 'unknown';
  query?: string;
  toolSlug?: string;
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
  }
];

export function matchIntent(query: string): Intent {
  for (const { type, patterns: regexList } of patterns) {
    for (const regex of regexList) {
      const match = query.match(regex);
      if (match) {
        // Extract query from capture groups
        const capturedQuery = match[match.length - 1]?.replace(/[?.!]/g, '').trim();
        return { type, query: capturedQuery, toolSlug: capturedQuery };
      }
    }
  }
  return { type: 'unknown', query };
}

