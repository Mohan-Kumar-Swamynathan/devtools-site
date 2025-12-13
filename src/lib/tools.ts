export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  keywords: string[];
  category: Category;
  icon: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export const categories: Record<string, Category> = {
  json: {
    id: 'json',
    name: 'JSON Tools',
    icon: '{ }',
    description: 'Format, validate, convert and manipulate JSON data'
  },
  encoders: {
    id: 'encoders',
    name: 'Encoders & Decoders',
    icon: '🔐',
    description: 'Encode and decode various formats'
  },
  formatters: {
    id: 'formatters',
    name: 'Formatters',
    icon: '✨',
    description: 'Format and beautify code'
  },
  generators: {
    id: 'generators',
    name: 'Generators',
    icon: '⚡',
    description: 'Generate UUIDs, passwords, hashes and more'
  },
  converters: {
    id: 'converters',
    name: 'Converters',
    icon: '🔄',
    description: 'Convert between different formats'
  },
  validators: {
    id: 'validators',
    name: 'Validators & Testers',
    icon: '✅',
    description: 'Validate and test your data'
  },
  text: {
    id: 'text',
    name: 'Text Tools',
    icon: '📝',
    description: 'Text manipulation and utilities'
  },
  css: {
    id: 'css',
    name: 'CSS Tools',
    icon: '🎨',
    description: 'CSS generators and utilities'
  },
  misc: {
    id: 'misc',
    name: 'Misc Tools',
    icon: '🧰',
    description: 'Other useful developer tools'
  }
};

export const tools: Tool[] = [
  // JSON Tools
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    slug: 'json-formatter',
    tagline: 'Format, validate & beautify JSON',
    description: 'Free online JSON formatter and validator. Beautify JSON data with proper indentation, syntax highlighting, and error detection.',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'format json online', 'json parser', 'pretty print json'],
    category: categories.json,
    icon: '{ }',
    isPopular: true
  },
  {
    id: 'json-to-yaml',
    name: 'JSON to YAML',
    slug: 'json-to-yaml',
    tagline: 'Convert JSON to YAML format',
    description: 'Convert JSON to YAML online. Free JSON to YAML converter with proper formatting.',
    keywords: ['json to yaml', 'json yaml converter', 'convert json to yaml'],
    category: categories.json,
    icon: '📄'
  },
  {
    id: 'json-to-csv',
    name: 'JSON to CSV',
    slug: 'json-to-csv',
    tagline: 'Convert JSON arrays to CSV',
    description: 'Convert JSON arrays to CSV format. Download as CSV file.',
    keywords: ['json to csv', 'json csv converter', 'convert json to csv'],
    category: categories.json,
    icon: '📊'
  },
  {
    id: 'json-to-xml',
    name: 'JSON to XML',
    slug: 'json-to-xml',
    tagline: 'Convert JSON to XML format',
    description: 'Convert JSON data to XML format with proper structure.',
    keywords: ['json to xml', 'json xml converter', 'convert json to xml'],
    category: categories.json,
    icon: '📰'
  },
  {
    id: 'json-to-typescript',
    name: 'JSON to TypeScript',
    slug: 'json-to-typescript',
    tagline: 'Generate TypeScript interfaces from JSON',
    description: 'Generate TypeScript interfaces and types from JSON data automatically.',
    keywords: ['json to typescript', 'json to ts interface', 'generate typescript types'],
    category: categories.json,
    icon: '📘',
    isNew: true
  },
  {
    id: 'json-path',
    name: 'JSON Path Finder',
    slug: 'json-path',
    tagline: 'Find and extract JSON paths',
    description: 'Find JSON paths and extract values using JSONPath expressions.',
    keywords: ['json path', 'jsonpath', 'json extractor', 'json query'],
    category: categories.json,
    icon: '🔍'
  },
  {
    id: 'json-diff',
    name: 'JSON Diff',
    slug: 'json-diff',
    tagline: 'Compare two JSON objects',
    description: 'Compare two JSON objects and highlight differences.',
    keywords: ['json diff', 'json compare', 'json difference'],
    category: categories.json,
    icon: '📊'
  },
  // Encoders & Decoders
  {
    id: 'base64',
    name: 'Base64 Encode/Decode',
    slug: 'base64',
    tagline: 'Encode or decode Base64 strings',
    description: 'Free Base64 encoder and decoder. Convert text to Base64 and decode Base64 strings online.',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 online', 'encode base64', 'decode base64'],
    category: categories.encoders,
    icon: '🔢',
    isPopular: true
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    slug: 'url-encoder',
    tagline: 'Encode or decode URL strings',
    description: 'URL encode and decode tool. Convert special characters for URLs and decode percent-encoded strings.',
    keywords: ['url encoder', 'url decoder', 'urlencode online', 'percent encoding', 'url escape'],
    category: categories.encoders,
    icon: '🔗',
    isPopular: true
  },
  {
    id: 'html-encoder',
    name: 'HTML Encoder/Decoder',
    slug: 'html-encoder',
    tagline: 'Encode or decode HTML entities',
    description: 'Convert special characters to HTML entities and decode HTML entities back to characters.',
    keywords: ['html encoder', 'html decoder', 'html entities', 'html escape'],
    category: categories.encoders,
    icon: '🏷️'
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    slug: 'jwt-decoder',
    tagline: 'Decode & inspect JWT tokens',
    description: 'Decode JSON Web Tokens instantly. View header, payload, check expiration, and debug JWT issues.',
    keywords: ['jwt decoder', 'jwt parser', 'decode jwt', 'jwt debugger', 'json web token'],
    category: categories.encoders,
    icon: '🔑',
    isPopular: true
  },
  {
    id: 'jwt-generator',
    name: 'JWT Generator',
    slug: 'jwt-generator',
    tagline: 'Generate JWT tokens',
    description: 'Generate JSON Web Tokens with custom header and payload.',
    keywords: ['jwt generator', 'create jwt', 'jwt maker'],
    category: categories.encoders,
    icon: '🎫'
  },
  {
    id: 'unicode-converter',
    name: 'Unicode Converter',
    slug: 'unicode-converter',
    tagline: 'Convert to/from Unicode',
    description: 'Convert text to Unicode escape sequences and decode Unicode back to text.',
    keywords: ['unicode converter', 'unicode encoder', 'unicode decoder'],
    category: categories.encoders,
    icon: '🔤'
  },
  {
    id: 'image-to-base64',
    name: 'Image to Base64',
    slug: 'image-to-base64',
    tagline: 'Convert images to Base64 strings',
    description: 'Convert images to Base64 encoded strings. Supports PNG, JPG, GIF, SVG formats.',
    keywords: ['image to base64', 'base64 image', 'convert image to base64', 'image encoder'],
    category: categories.encoders,
    icon: '🖼️'
  },
  {
    id: 'string-escape',
    name: 'String Escape/Unescape',
    slug: 'string-escape',
    tagline: 'Escape or unescape strings',
    description: 'Escape special characters in strings or unescape escaped strings.',
    keywords: ['string escape', 'escape string', 'unescape string'],
    category: categories.encoders,
    icon: '🔤'
  },
  // Formatters
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    slug: 'sql-formatter',
    tagline: 'Format & beautify SQL queries',
    description: 'Beautify and format SQL queries with proper indentation. Supports MySQL, PostgreSQL, SQL Server.',
    keywords: ['sql formatter', 'sql beautifier', 'format sql online', 'sql pretty print'],
    category: categories.formatters,
    icon: '🗃️',
    isPopular: true
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    slug: 'xml-formatter',
    tagline: 'Format & beautify XML',
    description: 'Format and beautify XML documents with proper indentation.',
    keywords: ['xml formatter', 'xml beautifier', 'format xml online', 'xml pretty print'],
    category: categories.formatters,
    icon: '📰'
  },
  {
    id: 'html-formatter',
    name: 'HTML Formatter',
    slug: 'html-formatter',
    tagline: 'Format & beautify HTML',
    description: 'Format and beautify HTML code with proper indentation.',
    keywords: ['html formatter', 'html beautifier', 'format html online'],
    category: categories.formatters,
    icon: '🌐'
  },
  {
    id: 'css-formatter',
    name: 'CSS Formatter/Minifier',
    slug: 'css-formatter',
    tagline: 'Format or minify CSS code',
    description: 'Beautify CSS code or minify it for production. CSS formatter and minifier tool.',
    keywords: ['css formatter', 'css minifier', 'css beautifier', 'minify css', 'format css'],
    category: categories.formatters,
    icon: '🎨'
  },
  {
    id: 'js-formatter',
    name: 'JavaScript Formatter',
    slug: 'js-formatter',
    tagline: 'Format or minify JavaScript',
    description: 'Beautify JavaScript code or minify it for production. JS formatter and minifier.',
    keywords: ['javascript formatter', 'js beautifier', 'js minifier', 'format javascript'],
    category: categories.formatters,
    icon: '📜'
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    slug: 'markdown-preview',
    tagline: 'Preview markdown in real-time',
    description: 'Live markdown editor with instant preview. Write and preview markdown simultaneously.',
    keywords: ['markdown editor', 'markdown preview', 'md editor online', 'markdown live preview'],
    category: categories.formatters,
    icon: '📝'
  },
  {
    id: 'yaml-formatter',
    name: 'YAML Formatter',
    slug: 'yaml-formatter',
    tagline: 'Format & beautify YAML',
    description: 'Format and beautify YAML files with proper indentation.',
    keywords: ['yaml formatter', 'yaml beautifier', 'format yaml'],
    category: categories.formatters,
    icon: '📋'
  },
  // Generators
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    slug: 'uuid-generator',
    tagline: 'Generate random UUIDs',
    description: 'Generate random UUID/GUID online. Create v4 UUIDs in bulk with one click.',
    keywords: ['uuid generator', 'guid generator', 'random uuid', 'uuid v4', 'generate uuid online'],
    category: categories.generators,
    icon: '🎲',
    isPopular: true
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    slug: 'password-generator',
    tagline: 'Generate secure passwords',
    description: 'Generate strong, secure passwords with customizable options for length and character types.',
    keywords: ['password generator', 'secure password', 'random password', 'strong password generator'],
    category: categories.generators,
    icon: '🔒',
    isPopular: true
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    slug: 'hash-generator',
    tagline: 'Generate MD5, SHA-1, SHA-256 hashes',
    description: 'Generate cryptographic hashes online. Support for MD5, SHA-1, SHA-256, and SHA-512 algorithms.',
    keywords: ['md5 generator', 'sha256 generator', 'hash generator online', 'sha1 hash', 'md5 hash'],
    category: categories.generators,
    icon: '#️⃣',
    isPopular: true
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    slug: 'lorem-ipsum',
    tagline: 'Generate placeholder text',
    description: 'Generate Lorem Ipsum placeholder text. Create paragraphs, sentences, or words for your designs.',
    keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text generator', 'lipsum'],
    category: categories.generators,
    icon: '📄'
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    slug: 'qr-generator',
    tagline: 'Generate QR codes instantly',
    description: 'Create QR codes for URLs, text, emails, phone numbers and more. Download as PNG.',
    keywords: ['qr generator', 'qr code maker', 'create qr code', 'qr code generator free'],
    category: categories.generators,
    icon: '📱',
    isPopular: true
  },
  {
    id: 'cron-builder',
    name: 'Cron Expression Builder',
    slug: 'cron-builder',
    tagline: 'Build cron expressions visually',
    description: 'Visual cron expression builder with human-readable explanations and next run times.',
    keywords: ['cron generator', 'cron builder', 'crontab generator', 'cron expression'],
    category: categories.generators,
    icon: '⏰',
    isPopular: true
  },
  {
    id: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    slug: 'meta-tag-generator',
    tagline: 'Generate SEO meta tags',
    description: 'Generate meta tags for SEO including Open Graph and Twitter cards.',
    keywords: ['meta tag generator', 'seo meta tags', 'og tags generator', 'social media tags'],
    category: categories.generators,
    icon: '🏷️'
  },
  {
    id: 'slug-generator',
    name: 'Slug Generator',
    slug: 'slug-generator',
    tagline: 'Generate URL-friendly slugs',
    description: 'Convert text to URL-friendly slugs. Perfect for blog posts and SEO.',
    keywords: ['slug generator', 'url slug', 'slug maker', 'permalink generator'],
    category: categories.generators,
    icon: '🔖'
  },
  {
    id: 'random-string',
    name: 'Random String Generator',
    slug: 'random-string',
    tagline: 'Generate random strings',
    description: 'Generate random strings with customizable length and character sets.',
    keywords: ['random string', 'string generator', 'random text'],
    category: categories.generators,
    icon: '🎲'
  },
  // Converters
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    slug: 'timestamp-converter',
    tagline: 'Convert Unix timestamps',
    description: 'Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds.',
    keywords: ['unix timestamp converter', 'epoch converter', 'timestamp to date', 'date to timestamp'],
    category: categories.converters,
    icon: '🕐',
    isPopular: true
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    slug: 'color-converter',
    tagline: 'Convert HEX, RGB, HSL colors',
    description: 'Convert between color formats: HEX, RGB, HSL, and more. Color picker included.',
    keywords: ['hex to rgb', 'color converter', 'rgb to hex', 'hsl converter', 'color picker'],
    category: categories.converters,
    icon: '🎨',
    isPopular: true
  },
  {
    id: 'number-base',
    name: 'Number Base Converter',
    slug: 'number-base',
    tagline: 'Convert between number bases',
    description: 'Convert between binary, decimal, hexadecimal, and octal number systems.',
    keywords: ['number converter', 'binary to decimal', 'hex to decimal', 'octal converter'],
    category: categories.converters,
    icon: '🔢'
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    slug: 'unit-converter',
    tagline: 'Convert units of measurement',
    description: 'Convert between units of length, weight, temperature, and more.',
    keywords: ['unit converter', 'measurement converter', 'length converter', 'weight converter'],
    category: categories.converters,
    icon: '📏'
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    slug: 'case-converter',
    tagline: 'Convert text case',
    description: 'Convert text between camelCase, snake_case, kebab-case, PascalCase and more.',
    keywords: ['case converter', 'camelcase', 'snake case', 'text case converter'],
    category: categories.converters,
    icon: 'Aa',
    isPopular: true
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    slug: 'csv-to-json',
    tagline: 'Convert CSV to JSON',
    description: 'Convert CSV data to JSON format. Upload CSV files or paste content.',
    keywords: ['csv to json', 'csv json converter', 'convert csv'],
    category: categories.converters,
    icon: '📊'
  },
  {
    id: 'yaml-to-json',
    name: 'YAML to JSON',
    slug: 'yaml-to-json',
    tagline: 'Convert YAML to JSON',
    description: 'Convert YAML to JSON format and vice versa.',
    keywords: ['yaml to json', 'json to yaml', 'yaml converter'],
    category: categories.converters,
    icon: '📋'
  },
  {
    id: 'xml-to-json',
    name: 'XML to JSON',
    slug: 'xml-to-json',
    tagline: 'Convert XML to JSON',
    description: 'Convert XML documents to JSON format.',
    keywords: ['xml to json', 'xml json converter', 'convert xml'],
    category: categories.converters,
    icon: '📰'
  },
  // Validators & Testers
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    slug: 'regex-tester',
    tagline: 'Test regular expressions',
    description: 'Test and debug regular expressions with real-time matching and highlighting.',
    keywords: ['regex tester', 'regex online', 'regular expression tester', 'regex debugger'],
    category: categories.validators,
    icon: '.*',
    isPopular: true
  },
  {
    id: 'diff-checker',
    name: 'Diff Checker',
    slug: 'diff-checker',
    tagline: 'Compare two texts',
    description: 'Compare two texts and highlight the differences. Side-by-side diff view.',
    keywords: ['diff checker', 'text compare', 'diff tool online', 'compare text'],
    category: categories.validators,
    icon: '📊',
    isPopular: true
  },
  {
    id: 'json-schema-validator',
    name: 'JSON Schema Validator',
    slug: 'json-schema-validator',
    tagline: 'Validate JSON against schema',
    description: 'Validate JSON data against JSON Schema. Find validation errors instantly.',
    keywords: ['json schema validator', 'validate json', 'json schema'],
    category: categories.validators,
    icon: '✅'
  },
  {
    id: 'email-validator',
    name: 'Email Validator',
    slug: 'email-validator',
    tagline: 'Validate email addresses',
    description: 'Validate email address format. Check if emails are properly formatted.',
    keywords: ['email validator', 'validate email', 'email checker'],
    category: categories.validators,
    icon: '📧'
  },
  {
    id: 'cron-tester',
    name: 'Cron Expression Tester',
    slug: 'cron-tester',
    tagline: 'Test cron expressions',
    description: 'Test and validate cron expressions. See next run times.',
    keywords: ['cron tester', 'cron validator', 'test cron'],
    category: categories.validators,
    icon: '⏰'
  },
  // Text Tools
  {
    id: 'text-counter',
    name: 'Text Counter',
    slug: 'text-counter',
    tagline: 'Count words, characters, lines',
    description: 'Count words, characters, sentences, paragraphs, and lines in your text.',
    keywords: ['word counter', 'character counter', 'text counter', 'word count'],
    category: categories.text,
    icon: '🔢',
    isPopular: true
  },
  {
    id: 'text-diff',
    name: 'Text Diff',
    slug: 'text-diff',
    tagline: 'Compare two text files',
    description: 'Compare two text files and see differences line by line.',
    keywords: ['text diff', 'text compare', 'file diff'],
    category: categories.text,
    icon: '📄'
  },
  {
    id: 'remove-duplicates',
    name: 'Remove Duplicate Lines',
    slug: 'remove-duplicates',
    tagline: 'Remove duplicate lines from text',
    description: 'Remove duplicate lines from text while preserving order.',
    keywords: ['remove duplicates', 'remove duplicate lines', 'unique lines'],
    category: categories.text,
    icon: '🗑️'
  },
  {
    id: 'sort-lines',
    name: 'Sort Lines',
    slug: 'sort-lines',
    tagline: 'Sort lines alphabetically',
    description: 'Sort lines alphabetically or numerically. Reverse order supported.',
    keywords: ['sort lines', 'sort text', 'alphabetize lines'],
    category: categories.text,
    icon: '📶'
  },
  {
    id: 'markdown-table',
    name: 'Markdown Table Generator',
    slug: 'markdown-table',
    tagline: 'Generate markdown tables',
    description: 'Create markdown tables visually. Export to markdown format.',
    keywords: ['markdown table', 'markdown table generator', 'create markdown table'],
    category: categories.text,
    icon: '📋'
  },
  {
    id: 'csv-to-markdown',
    name: 'CSV to Markdown Table',
    slug: 'csv-to-markdown',
    tagline: 'Convert CSV to markdown table',
    description: 'Convert CSV data to markdown table format.',
    keywords: ['csv to markdown', 'csv markdown converter'],
    category: categories.text,
    icon: '📊'
  },
  // CSS Tools
  {
    id: 'box-shadow',
    name: 'Box Shadow Generator',
    slug: 'box-shadow',
    tagline: 'Generate CSS box shadows',
    description: 'Visual CSS box shadow generator. Preview and copy CSS code.',
    keywords: ['box shadow generator', 'css shadow', 'shadow generator'],
    category: categories.css,
    icon: '🎭'
  },
  {
    id: 'border-radius',
    name: 'Border Radius Generator',
    slug: 'border-radius',
    tagline: 'Generate border-radius CSS',
    description: 'Visual border-radius generator. Create custom shapes with CSS.',
    keywords: ['border radius generator', 'css border radius', 'rounded corners'],
    category: categories.css,
    icon: '⬜'
  },
  {
    id: 'gradient-generator',
    name: 'Gradient Generator',
    slug: 'gradient-generator',
    tagline: 'Create CSS gradients',
    description: 'Create beautiful CSS gradients. Linear and radial gradients supported.',
    keywords: ['gradient generator', 'css gradient', 'color gradient'],
    category: categories.css,
    icon: '🌈'
  },
  {
    id: 'flexbox-playground',
    name: 'Flexbox Playground',
    slug: 'flexbox-playground',
    tagline: 'Learn flexbox interactively',
    description: 'Interactive flexbox playground. Learn CSS flexbox with visual examples.',
    keywords: ['flexbox playground', 'css flexbox', 'flexbox tutorial', 'learn flexbox'],
    category: categories.css,
    icon: '📦'
  },
  // Misc Tools
  {
    id: 'chmod-calculator',
    name: 'Chmod Calculator',
    slug: 'chmod-calculator',
    tagline: 'Calculate Unix permissions',
    description: 'Calculate Unix file permissions. Convert between symbolic and numeric notation.',
    keywords: ['chmod calculator', 'unix permissions', 'file permissions'],
    category: categories.misc,
    icon: '🔐'
  },
  {
    id: 'http-status-codes',
    name: 'HTTP Status Codes',
    slug: 'http-status-codes',
    tagline: 'HTTP status code reference',
    description: 'Complete HTTP status codes reference with descriptions and examples.',
    keywords: ['http status codes', 'status code reference', 'http codes'],
    category: categories.misc,
    icon: '📡'
  },
  {
    id: 'curl-converter',
    name: 'cURL Converter',
    slug: 'curl-converter',
    tagline: 'Convert cURL to code',
    description: 'Convert cURL commands to code in various programming languages.',
    keywords: ['curl converter', 'curl to code', 'curl to javascript', 'curl to python'],
    category: categories.misc,
    icon: '🔄'
  },
  {
    id: 'htaccess-generator',
    name: '.htaccess Generator',
    slug: 'htaccess-generator',
    tagline: 'Generate .htaccess rules',
    description: 'Generate .htaccess configuration rules for Apache servers.',
    keywords: ['htaccess generator', 'apache config', 'htaccess maker'],
    category: categories.misc,
    icon: '⚙️'
  }
];

// Helper functions
export const getToolBySlug = (slug: string): Tool | undefined => 
  tools.find(t => t.slug === slug);

export const getToolsByCategory = (categoryId: string): Tool[] => 
  tools.filter(t => t.category.id === categoryId);

export const getPopularTools = (): Tool[] => 
  tools.filter(t => t.isPopular);

export const getNewTools = (): Tool[] => 
  tools.filter(t => t.isNew);

export const searchTools = (query: string): Tool[] => {
  const q = query.toLowerCase();
  return tools.filter(t => 
    t.name.toLowerCase().includes(q) ||
    t.tagline.toLowerCase().includes(q) ||
    t.keywords.some(k => k.toLowerCase().includes(q))
  );
};


