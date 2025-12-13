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
  },
  web: {
    id: 'web',
    name: 'Web Tools',
    icon: '🌐',
    description: 'URL parsing, query strings, and web utilities'
  },
  network: {
    id: 'network',
    name: 'Network & API',
    icon: '📡',
    description: 'Network tools, API testing, and HTTP utilities'
  },
  security: {
    id: 'security',
    name: 'Security Tools',
    icon: '🔒',
    description: 'Security, cryptography, and validation tools'
  },
  image: {
    id: 'image',
    name: 'Image Tools',
    icon: '🖼️',
    description: 'Image manipulation and analysis tools'
  },
  time: {
    id: 'time',
    name: 'Time & Date',
    icon: '🕐',
    description: 'Time zone conversion, date calculations, and formatting'
  },
  file: {
    id: 'file',
    name: 'File Tools',
    icon: '📁',
    description: 'File system utilities and path manipulation'
  },
  code: {
    id: 'code',
    name: 'Code Analysis',
    icon: '💻',
    description: 'Code analysis, complexity, and quality tools'
  },
  documentation: {
    id: 'documentation',
    name: 'Documentation',
    icon: '📚',
    description: 'Documentation generators and formatters'
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
  },
  // Web Tools
  {
    id: 'url-parser',
    name: 'URL Parser',
    slug: 'url-parser',
    tagline: 'Parse URLs into components',
    description: 'Parse URLs into protocol, hostname, port, pathname, query parameters, and hash components.',
    keywords: ['url parser', 'parse url', 'url components', 'url breakdown'],
    category: categories.web,
    icon: '🔗',
    isPopular: true
  },
  {
    id: 'query-string-parser',
    name: 'Query String Parser',
    slug: 'query-string-parser',
    tagline: 'Parse and build query strings',
    description: 'Parse query strings to JSON or build query strings from JSON objects.',
    keywords: ['query string parser', 'url params', 'query params', 'parse query string'],
    category: categories.web,
    icon: '🔍'
  },
  {
    id: 'http-headers-parser',
    name: 'HTTP Headers Parser',
    slug: 'http-headers-parser',
    tagline: 'Parse HTTP headers',
    description: 'Parse raw HTTP headers into structured JSON format.',
    keywords: ['http headers parser', 'parse headers', 'http headers'],
    category: categories.web,
    icon: '📋'
  },
  // Additional Validators
  {
    id: 'ip-address-validator',
    name: 'IP Address Validator',
    slug: 'ip-address-validator',
    tagline: 'Validate IPv4 and IPv6 addresses',
    description: 'Validate IP addresses. Supports both IPv4 and IPv6 formats.',
    keywords: ['ip validator', 'ipv4 validator', 'ipv6 validator', 'validate ip address'],
    category: categories.validators,
    icon: '🌐'
  },
  {
    id: 'uuid-validator',
    name: 'UUID Validator',
    slug: 'uuid-validator',
    tagline: 'Validate UUID format',
    description: 'Validate UUID format and detect version (v1-v5).',
    keywords: ['uuid validator', 'validate uuid', 'uuid checker', 'guid validator'],
    category: categories.validators,
    icon: '🆔'
  },
  {
    id: 'credit-card-validator',
    name: 'Credit Card Validator',
    slug: 'credit-card-validator',
    tagline: 'Validate credit card numbers',
    description: 'Validate credit card numbers using Luhn algorithm. Detects card type (Visa, Mastercard, etc.).',
    keywords: ['credit card validator', 'luhn algorithm', 'card number validator'],
    category: categories.validators,
    icon: '💳'
  },
  {
    id: 'jwt-validator',
    name: 'JWT Validator',
    slug: 'jwt-validator',
    tagline: 'Validate JWT tokens',
    description: 'Validate JWT token structure, decode header and payload, check expiration.',
    keywords: ['jwt validator', 'validate jwt', 'jwt checker', 'token validator'],
    category: categories.validators,
    icon: '🎫'
  },
  // Additional Generators
  {
    id: 'gitignore-generator',
    name: '.gitignore Generator',
    slug: 'gitignore-generator',
    tagline: 'Generate .gitignore files',
    description: 'Generate .gitignore files by selecting technologies. Supports Node.js, Python, Java, PHP, Go, Rust, Ruby, and more.',
    keywords: ['gitignore generator', 'generate gitignore', 'gitignore maker'],
    category: categories.generators,
    icon: '📝',
    isPopular: true
  },
  {
    id: 'robots-txt-generator',
    name: 'robots.txt Generator',
    slug: 'robots-txt-generator',
    tagline: 'Generate robots.txt files',
    description: 'Generate robots.txt files with custom rules for search engine crawlers.',
    keywords: ['robots.txt generator', 'generate robots.txt', 'seo robots'],
    category: categories.generators,
    icon: '🤖'
  },
  {
    id: 'sitemap-generator',
    name: 'Sitemap Generator',
    slug: 'sitemap-generator',
    tagline: 'Generate XML sitemaps',
    description: 'Generate XML sitemaps from a list of URLs. Perfect for SEO.',
    keywords: ['sitemap generator', 'xml sitemap', 'generate sitemap', 'seo sitemap'],
    category: categories.generators,
    icon: '🗺️'
  },
  {
    id: 'dockerfile-generator',
    name: 'Dockerfile Generator',
    slug: 'dockerfile-generator',
    tagline: 'Generate Dockerfiles',
    description: 'Generate Dockerfiles with common configurations for Node.js, Python, Go, Rust, PHP, and more.',
    keywords: ['dockerfile generator', 'docker generator', 'generate dockerfile'],
    category: categories.generators,
    icon: '🐳'
  },
  {
    id: 'readme-generator',
    name: 'README Generator',
    slug: 'readme-generator',
    tagline: 'Generate README files',
    description: 'Generate README.md files with standard sections and formatting.',
    keywords: ['readme generator', 'generate readme', 'readme maker'],
    category: categories.generators,
    icon: '📖'
  },
  // Text & Encoding Tools
  {
    id: 'text-to-binary',
    name: 'Text to Binary',
    slug: 'text-to-binary',
    tagline: 'Convert text to binary and vice versa',
    description: 'Convert text to binary representation and binary back to text.',
    keywords: ['text to binary', 'binary converter', 'text binary', 'binary to text'],
    category: categories.encoders,
    icon: '🔢'
  },
  {
    id: 'ascii-art-generator',
    name: 'ASCII Art Generator',
    slug: 'ascii-art-generator',
    tagline: 'Generate ASCII art from text',
    description: 'Convert text to ASCII art with different font styles.',
    keywords: ['ascii art generator', 'text to ascii', 'ascii art'],
    category: categories.text,
    icon: '🎨'
  },
  {
    id: 'json-minifier',
    name: 'JSON Minifier',
    slug: 'json-minifier',
    tagline: 'Minify JSON code',
    description: 'Remove all whitespace from JSON to create a minified version.',
    keywords: ['json minifier', 'minify json', 'compress json'],
    category: categories.json,
    icon: '📦'
  },
  {
    id: 'base64-image-decoder',
    name: 'Base64 Image Decoder',
    slug: 'base64-image-decoder',
    tagline: 'Decode base64 to images',
    description: 'Decode base64 encoded strings back to downloadable images.',
    keywords: ['base64 image decoder', 'decode base64 image', 'base64 to image'],
    category: categories.encoders,
    icon: '🖼️'
  },
  // Data & Format Tools
  {
    id: 'csv-validator',
    name: 'CSV Validator',
    slug: 'csv-validator',
    tagline: 'Validate CSV structure',
    description: 'Validate CSV structure and detect issues like missing columns, duplicate headers, and formatting errors.',
    keywords: ['csv validator', 'validate csv', 'csv checker'],
    category: categories.validators,
    icon: '📊'
  },
  {
    id: 'xml-validator',
    name: 'XML Validator',
    slug: 'xml-validator',
    tagline: 'Validate XML syntax',
    description: 'Validate XML syntax and structure. Check for well-formed XML documents.',
    keywords: ['xml validator', 'validate xml', 'xml checker'],
    category: categories.validators,
    icon: '📰'
  },
  {
    id: 'yaml-validator',
    name: 'YAML Validator',
    slug: 'yaml-validator',
    tagline: 'Validate YAML syntax',
    description: 'Validate YAML syntax and structure. Check for properly formatted YAML files.',
    keywords: ['yaml validator', 'validate yaml', 'yaml checker'],
    category: categories.validators,
    icon: '📋'
  },
  {
    id: 'json-escape',
    name: 'JSON Escape/Unescape',
    slug: 'json-escape',
    tagline: 'Escape or unescape JSON strings',
    description: 'Escape special characters in JSON strings or unescape escaped JSON strings.',
    keywords: ['json escape', 'json unescape', 'escape json'],
    category: categories.json,
    icon: '🔤'
  },
  {
    id: 'jsonl-converter',
    name: 'JSONL Converter',
    slug: 'jsonl-converter',
    tagline: 'Convert JSON Lines to JSON array',
    description: 'Convert JSON Lines (JSONL) format to JSON array and vice versa.',
    keywords: ['jsonl converter', 'json lines', 'jsonl to json'],
    category: categories.json,
    icon: '📄'
  },
  {
    id: 'toml-formatter',
    name: 'TOML Formatter',
    slug: 'toml-formatter',
    tagline: 'Format TOML files',
    description: 'Format and beautify TOML configuration files.',
    keywords: ['toml formatter', 'format toml', 'toml beautifier'],
    category: categories.formatters,
    icon: '⚙️'
  },
  // Code Analysis Tools
  {
    id: 'code-line-counter',
    name: 'Code Line Counter',
    slug: 'code-line-counter',
    tagline: 'Count lines, functions, classes in code',
    description: 'Count total lines, code lines, blank lines, comments, functions, and classes in your code.',
    keywords: ['line counter', 'code counter', 'count lines', 'code statistics'],
    category: categories.code,
    icon: '📊'
  },
  {
    id: 'code-complexity-calculator',
    name: 'Code Complexity Calculator',
    slug: 'code-complexity-calculator',
    tagline: 'Calculate cyclomatic complexity',
    description: 'Calculate cyclomatic complexity of code. Identify decision points and loops.',
    keywords: ['complexity calculator', 'cyclomatic complexity', 'code complexity'],
    category: categories.code,
    icon: '🧮'
  },
  {
    id: 'dependency-parser',
    name: 'Dependency Parser',
    slug: 'dependency-parser',
    tagline: 'Parse package dependencies',
    description: 'Parse dependencies from package.json, requirements.txt, pom.xml, Cargo.toml, and more.',
    keywords: ['dependency parser', 'parse dependencies', 'package parser'],
    category: categories.code,
    icon: '📦'
  },
  {
    id: 'license-identifier',
    name: 'License Identifier',
    slug: 'license-identifier',
    tagline: 'Identify software licenses',
    description: 'Identify software licenses from license text. Supports MIT, Apache, GPL, BSD, and more.',
    keywords: ['license identifier', 'identify license', 'license detector'],
    category: categories.code,
    icon: '📄'
  },
  {
    id: 'code-comment-remover',
    name: 'Code Comment Remover',
    slug: 'code-comment-remover',
    tagline: 'Remove comments from code',
    description: 'Remove comments from code in JavaScript, Python, Java, CSS, and HTML.',
    keywords: ['comment remover', 'remove comments', 'strip comments'],
    category: categories.code,
    icon: '🗑️'
  },
  {
    id: 'code-indentation-fixer',
    name: 'Code Indentation Fixer',
    slug: 'code-indentation-fixer',
    tagline: 'Fix inconsistent indentation',
    description: 'Fix inconsistent indentation in code. Supports spaces and tabs.',
    keywords: ['indentation fixer', 'fix indentation', 'format indentation'],
    category: categories.code,
    icon: '🔧'
  },
  // Network & API Tools
  {
    id: 'http-status-code-lookup',
    name: 'HTTP Status Code Lookup',
    slug: 'http-status-code-lookup',
    tagline: 'Lookup HTTP status codes',
    description: 'Lookup HTTP status codes by number. Get name, description, and category.',
    keywords: ['http status lookup', 'status code lookup', 'http code'],
    category: categories.network,
    icon: '🔍'
  },
  {
    id: 'api-response-formatter',
    name: 'API Response Formatter',
    slug: 'api-response-formatter',
    tagline: 'Format API responses',
    description: 'Format API responses in JSON or XML format with proper indentation.',
    keywords: ['api formatter', 'response formatter', 'format api response'],
    category: categories.network,
    icon: '📡'
  },
  {
    id: 'webhook-tester',
    name: 'Webhook Tester',
    slug: 'webhook-tester',
    tagline: 'Test webhook endpoints',
    description: 'Test webhook endpoints with custom HTTP methods, headers, and body. See response details.',
    keywords: ['webhook tester', 'test webhook', 'webhook debugger'],
    category: categories.network,
    icon: '🔗'
  },
  {
    id: 'cors-checker',
    name: 'CORS Checker',
    slug: 'cors-checker',
    tagline: 'Check CORS headers',
    description: 'Check if a URL has CORS enabled and view CORS headers.',
    keywords: ['cors checker', 'check cors', 'cors headers'],
    category: categories.network,
    icon: '🌐'
  },
  {
    id: 'user-agent-parser',
    name: 'User-Agent Parser',
    slug: 'user-agent-parser',
    tagline: 'Parse user-agent strings',
    description: 'Parse user-agent strings to extract browser, OS, device type, and version information.',
    keywords: ['user agent parser', 'parse user agent', 'ua parser'],
    category: categories.network,
    icon: '🔍'
  },
  // Security Tools
  {
    id: 'password-strength-checker',
    name: 'Password Strength Checker',
    slug: 'password-strength-checker',
    tagline: 'Check password strength',
    description: 'Check password strength and get suggestions for improvement. Analyzes length, character types, and complexity.',
    keywords: ['password strength', 'password checker', 'password validator'],
    category: categories.security,
    icon: '🔒',
    isPopular: true
  },
  {
    id: 'hmac-generator',
    name: 'HMAC Generator',
    slug: 'hmac-generator',
    tagline: 'Generate HMAC signatures',
    description: 'Generate HMAC (Hash-based Message Authentication Code) signatures using SHA-1, SHA-256, or SHA-512.',
    keywords: ['hmac generator', 'hmac signature', 'generate hmac'],
    category: categories.security,
    icon: '🔐'
  },
  {
    id: 'rsa-key-generator',
    name: 'RSA Key Generator',
    slug: 'rsa-key-generator',
    tagline: 'Generate RSA key pairs',
    description: 'Generate RSA public and private key pairs. Keys are generated in JWK format.',
    keywords: ['rsa generator', 'rsa keys', 'generate rsa', 'key pair generator'],
    category: categories.security,
    icon: '🔑'
  },
  {
    id: 'checksum-calculator',
    name: 'Checksum Calculator',
    slug: 'checksum-calculator',
    tagline: 'Calculate checksums',
    description: 'Calculate SHA-1, SHA-256, and SHA-512 checksums for text data.',
    keywords: ['checksum calculator', 'sha checksum', 'calculate checksum'],
    category: categories.security,
    icon: '#️⃣'
  },
  {
    id: 'xss-sanitizer',
    name: 'XSS Sanitizer',
    slug: 'xss-sanitizer',
    tagline: 'Sanitize HTML to prevent XSS',
    description: 'Sanitize HTML content to prevent XSS attacks. Remove or escape dangerous HTML tags and attributes.',
    keywords: ['xss sanitizer', 'html sanitizer', 'xss prevention'],
    category: categories.security,
    icon: '🛡️'
  },
  // Image Tools
  {
    id: 'image-metadata-extractor',
    name: 'Image Metadata Extractor',
    slug: 'image-metadata-extractor',
    tagline: 'Extract EXIF/metadata from images',
    description: 'Extract metadata from images including dimensions, file size, type, and modification date.',
    keywords: ['image metadata', 'exif extractor', 'image info'],
    category: categories.image,
    icon: '📷'
  },
  {
    id: 'color-palette-extractor',
    name: 'Color Palette Extractor',
    slug: 'color-palette-extractor',
    tagline: 'Extract color palette from images',
    description: 'Extract dominant colors from images to create a color palette.',
    keywords: ['color palette', 'extract colors', 'image colors'],
    category: categories.image,
    icon: '🎨'
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer',
    tagline: 'Resize images',
    description: 'Resize images to custom dimensions. Supports maintaining aspect ratio.',
    keywords: ['image resizer', 'resize image', 'image resize'],
    category: categories.image,
    icon: '📐'
  },
  {
    id: 'svg-optimizer',
    name: 'SVG Optimizer',
    slug: 'svg-optimizer',
    tagline: 'Optimize SVG code',
    description: 'Optimize SVG code by removing unnecessary whitespace, comments, and attributes.',
    keywords: ['svg optimizer', 'optimize svg', 'svg minifier'],
    category: categories.image,
    icon: '⚡'
  },
  // Time & Date Tools
  {
    id: 'time-zone-converter',
    name: 'Time Zone Converter',
    slug: 'time-zone-converter',
    tagline: 'Convert between time zones',
    description: 'Convert dates and times between different time zones. Supports major world time zones.',
    keywords: ['time zone converter', 'convert timezone', 'timezone converter'],
    category: categories.time,
    icon: '🌍'
  },
  {
    id: 'date-calculator',
    name: 'Date Calculator',
    slug: 'date-calculator',
    tagline: 'Add/subtract days, weeks, months',
    description: 'Add or subtract days, weeks, months, or years from a date.',
    keywords: ['date calculator', 'add days', 'subtract days', 'date math'],
    category: categories.time,
    icon: '📅'
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    slug: 'age-calculator',
    tagline: 'Calculate age from birthdate',
    description: 'Calculate age in years, months, and days from a birthdate.',
    keywords: ['age calculator', 'calculate age', 'birthdate calculator'],
    category: categories.time,
    icon: '🎂'
  },
  {
    id: 'business-days-calculator',
    name: 'Business Days Calculator',
    slug: 'business-days-calculator',
    tagline: 'Calculate business days between dates',
    description: 'Calculate the number of business days (excluding weekends) between two dates.',
    keywords: ['business days', 'working days', 'calculate business days'],
    category: categories.time,
    icon: '💼'
  },
  {
    id: 'iso-8601-formatter',
    name: 'ISO 8601 Formatter',
    slug: 'iso-8601-formatter',
    tagline: 'Format dates in ISO 8601',
    description: 'Format dates in ISO 8601 format or parse ISO 8601 strings.',
    keywords: ['iso 8601', 'iso date', 'format iso date'],
    category: categories.time,
    icon: '📆'
  },
  // String Manipulation Tools
  {
    id: 'text-reverser',
    name: 'Text Reverser',
    slug: 'text-reverser',
    tagline: 'Reverse text/strings',
    description: 'Reverse text character by character. Simple text reversal tool.',
    keywords: ['text reverser', 'reverse text', 'text reverse'],
    category: categories.text,
    icon: '↩️'
  },
  {
    id: 'text-inverter',
    name: 'Text Inverter',
    slug: 'text-inverter',
    tagline: 'Invert case (uppercase ↔ lowercase)',
    description: 'Invert text case - convert uppercase to lowercase and vice versa.',
    keywords: ['text inverter', 'invert case', 'case inverter'],
    category: categories.text,
    icon: '🔄'
  },
  {
    id: 'text-rotator',
    name: 'Text Rotator',
    slug: 'text-rotator',
    tagline: 'Rotate text (ROT13, ROT47)',
    description: 'Apply ROT13 or ROT47 cipher to text. Simple encryption/decryption.',
    keywords: ['text rotator', 'rot13', 'rot47', 'caesar cipher'],
    category: categories.text,
    icon: '🔀'
  },
  {
    id: 'text-shuffler',
    name: 'Text Shuffler',
    slug: 'text-shuffler',
    tagline: 'Shuffle characters/words',
    description: 'Randomly shuffle characters, words, or lines in text.',
    keywords: ['text shuffler', 'shuffle text', 'randomize text'],
    category: categories.text,
    icon: '🎲'
  },
  {
    id: 'text-replacer',
    name: 'Text Replacer',
    slug: 'text-replacer',
    tagline: 'Find and replace with regex',
    description: 'Find and replace text with support for regular expressions.',
    keywords: ['text replacer', 'find replace', 'regex replace'],
    category: categories.text,
    icon: '🔍'
  },
  {
    id: 'text-extractor',
    name: 'Text Extractor',
    slug: 'text-extractor',
    tagline: 'Extract specific patterns',
    description: 'Extract specific patterns from text using regular expressions or simple search.',
    keywords: ['text extractor', 'extract patterns', 'regex extract'],
    category: categories.text,
    icon: '📤'
  },
  // File & System Tools
  {
    id: 'file-size-converter',
    name: 'File Size Converter',
    slug: 'file-size-converter',
    tagline: 'Convert between KB, MB, GB, TB',
    description: 'Convert file sizes between bytes, KB, MB, GB, and TB.',
    keywords: ['file size converter', 'size converter', 'bytes converter'],
    category: categories.file,
    icon: '📏'
  },
  {
    id: 'path-normalizer',
    name: 'Path Normalizer',
    slug: 'path-normalizer',
    tagline: 'Normalize file paths',
    description: 'Normalize file paths for Windows or Unix/Linux systems.',
    keywords: ['path normalizer', 'normalize path', 'file path'],
    category: categories.file,
    icon: '📂'
  },
  {
    id: 'filename-sanitizer',
    name: 'Filename Sanitizer',
    slug: 'filename-sanitizer',
    tagline: 'Sanitize filenames',
    description: 'Sanitize filenames for different operating systems. Remove invalid characters.',
    keywords: ['filename sanitizer', 'sanitize filename', 'clean filename'],
    category: categories.file,
    icon: '🧹'
  },
  {
    id: 'file-extension-lookup',
    name: 'File Extension Lookup',
    slug: 'file-extension-lookup',
    tagline: 'Lookup file extensions',
    description: 'Lookup file extensions and their types, descriptions, and MIME types.',
    keywords: ['file extension', 'extension lookup', 'mime type'],
    category: categories.file,
    icon: '🔍'
  },
  // Developer Productivity Tools
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    slug: 'regex-tester',
    tagline: 'Test regular expressions',
    description: 'Test regular expressions with live matching. Supports flags and real-time results.',
    keywords: ['regex tester', 'regular expression tester', 'regex test'],
    category: categories.code,
    icon: '🔍',
    isPopular: true
  },
  {
    id: 'regex-cheat-sheet',
    name: 'Regex Cheat Sheet',
    slug: 'regex-cheat-sheet',
    tagline: 'Regular expression reference',
    description: 'Quick reference for regular expression patterns, quantifiers, and flags.',
    keywords: ['regex cheat sheet', 'regex reference', 'regular expression guide'],
    category: categories.code,
    icon: '📚'
  },
  {
    id: 'code-snippet-generator',
    name: 'Code Snippet Generator',
    slug: 'code-snippet-generator',
    tagline: 'Generate code snippets',
    description: 'Generate common code snippets for JavaScript, Python, HTML, and CSS.',
    keywords: ['code snippet generator', 'snippet generator', 'code templates'],
    category: categories.code,
    icon: '💻'
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    slug: 'color-picker',
    tagline: 'Pick colors and get formats',
    description: 'Pick colors and get them in multiple formats: HEX, RGB, RGBA, HSL, HSLA.',
    keywords: ['color picker', 'color converter', 'hex to rgb'],
    category: categories.css,
    icon: '🎨'
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    slug: 'base64-encoder',
    tagline: 'Encode/decode Base64',
    description: 'Encode text to Base64 or decode Base64 to text. Fast and secure.',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 encode decode'],
    category: categories.encoders,
    icon: '🔐',
    isPopular: true
  },
  // Specialized Converters
  {
    id: 'json-to-typescript',
    name: 'JSON to TypeScript',
    slug: 'json-to-typescript',
    tagline: 'Convert JSON to TypeScript interface',
    description: 'Convert JSON objects to TypeScript interface definitions automatically.',
    keywords: ['json to typescript', 'json to interface', 'typescript generator'],
    category: categories.json,
    icon: '📘'
  },
  {
    id: 'markdown-to-html',
    name: 'Markdown to HTML',
    slug: 'markdown-to-html',
    tagline: 'Convert Markdown to HTML',
    description: 'Convert Markdown text to HTML format. Supports all Markdown features.',
    keywords: ['markdown to html', 'md to html', 'markdown converter'],
    category: categories.converters,
    icon: '📝'
  },
  {
    id: 'html-to-markdown',
    name: 'HTML to Markdown',
    slug: 'html-to-markdown',
    tagline: 'Convert HTML to Markdown',
    description: 'Convert HTML to Markdown format. Preserves structure and formatting.',
    keywords: ['html to markdown', 'html to md', 'html converter'],
    category: categories.converters,
    icon: '📄'
  },
  {
    id: 'csv-to-markdown',
    name: 'CSV to Markdown Table',
    slug: 'csv-to-markdown',
    tagline: 'Convert CSV to Markdown table',
    description: 'Convert CSV data to Markdown table format. Perfect for documentation.',
    keywords: ['csv to markdown', 'csv to table', 'markdown table'],
    category: categories.converters,
    icon: '📊'
  },
  // Testing & Debugging Tools
  {
    id: 'json-linter',
    name: 'JSON Linter',
    slug: 'json-linter',
    tagline: 'Lint and format JSON',
    description: 'Lint JSON code for errors, format it, and detect common issues like duplicate keys.',
    keywords: ['json linter', 'lint json', 'json validator', 'json formatter'],
    category: categories.json,
    icon: '🔍'
  },
  {
    id: 'api-tester',
    name: 'API Tester',
    slug: 'api-tester',
    tagline: 'Test REST APIs',
    description: 'Test REST APIs with different HTTP methods. View responses, headers, and timing information.',
    keywords: ['api tester', 'rest api tester', 'http client', 'api debugger'],
    category: categories.network,
    icon: '🧪',
    isPopular: true
  },
  {
    id: 'error-decoder',
    name: 'Error Decoder',
    slug: 'error-decoder',
    tagline: 'Decode and analyze errors',
    description: 'Decode error messages and stack traces. Extract useful information from error logs.',
    keywords: ['error decoder', 'error analyzer', 'stack trace parser'],
    category: categories.code,
    icon: '🐛'
  },
  {
    id: 'performance-monitor',
    name: 'Performance Monitor',
    slug: 'performance-monitor',
    tagline: 'Monitor browser performance',
    description: 'Monitor browser performance metrics including memory usage, navigation timing, and resource loading.',
    keywords: ['performance monitor', 'browser performance', 'performance metrics'],
    category: categories.code,
    icon: '⚡'
  },
  // Documentation Tools
  {
    id: 'api-documentation-generator',
    name: 'API Documentation Generator',
    slug: 'api-documentation-generator',
    tagline: 'Generate API docs',
    description: 'Generate API documentation in Markdown format. Includes endpoints, parameters, and examples.',
    keywords: ['api docs generator', 'api documentation', 'generate api docs'],
    category: categories.documentation,
    icon: '📚'
  },
  {
    id: 'changelog-generator',
    name: 'Changelog Generator',
    slug: 'changelog-generator',
    tagline: 'Generate changelogs',
    description: 'Generate CHANGELOG.md files following Keep a Changelog format. Organize changes by type.',
    keywords: ['changelog generator', 'generate changelog', 'changelog maker'],
    category: categories.documentation,
    icon: '📝'
  },
  {
    id: 'code-comment-generator',
    name: 'Code Comment Generator',
    slug: 'code-comment-generator',
    tagline: 'Generate code comments',
    description: 'Generate code comments in JSDoc, inline, or block style for multiple languages.',
    keywords: ['comment generator', 'code comments', 'jsdoc generator'],
    category: categories.documentation,
    icon: '💬'
  },
  {
    id: 'contributing-guide-generator',
    name: 'Contributing Guide Generator',
    slug: 'contributing-guide-generator',
    tagline: 'Generate CONTRIBUTING.md',
    description: 'Generate CONTRIBUTING.md files with setup instructions, code style guidelines, and testing requirements.',
    keywords: ['contributing guide', 'generate contributing', 'contributing.md'],
    category: categories.documentation,
    icon: '🤝'
  },
  // Audio & Voice Tools
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    slug: 'text-to-speech',
    tagline: 'Convert text to speech',
    description: 'Convert text to speech using browser-native Web Speech API. Adjust voice, rate, pitch, and volume.',
    keywords: ['text to speech', 'tts', 'speech synthesis', 'voice generator'],
    category: categories.misc,
    icon: '🔊',
    isPopular: true
  },
  {
    id: 'speech-to-text',
    name: 'Speech to Text',
    slug: 'speech-to-text',
    tagline: 'Convert speech to text',
    description: 'Convert speech to text using browser-native Web Speech API. Real-time transcription.',
    keywords: ['speech to text', 'stt', 'voice recognition', 'transcription'],
    category: categories.misc,
    icon: '🎤',
    isPopular: true
  },
  // Additional Easy Tools
  {
    id: 'morse-code-converter',
    name: 'Morse Code Converter',
    slug: 'morse-code-converter',
    tagline: 'Convert text to/from Morse code',
    description: 'Convert text to Morse code and decode Morse code back to text.',
    keywords: ['morse code', 'morse code converter', 'morse code decoder'],
    category: categories.encoders,
    icon: '📡'
  },
  {
    id: 'roman-numeral-converter',
    name: 'Roman Numeral Converter',
    slug: 'roman-numeral-converter',
    tagline: 'Convert numbers to/from Roman numerals',
    description: 'Convert Arabic numbers to Roman numerals and vice versa. Supports 1-3999.',
    keywords: ['roman numeral', 'roman number', 'roman converter'],
    category: categories.converters,
    icon: '🔢'
  },
  {
    id: 'word-frequency-counter',
    name: 'Word Frequency Counter',
    slug: 'word-frequency-counter',
    tagline: 'Count word frequency in text',
    description: 'Count how often each word appears in text. Sorted by frequency with customizable options.',
    keywords: ['word frequency', 'word count', 'frequency analysis'],
    category: categories.text,
    icon: '📊'
  },
  {
    id: 'palindrome-checker',
    name: 'Palindrome Checker',
    slug: 'palindrome-checker',
    tagline: 'Check if text is a palindrome',
    description: 'Check if text is a palindrome (reads the same forwards and backwards).',
    keywords: ['palindrome checker', 'palindrome', 'check palindrome'],
    category: categories.text,
    icon: '🔄'
  },
  {
    id: 'anagram-generator',
    name: 'Anagram Generator',
    slug: 'anagram-generator',
    tagline: 'Generate anagrams from words',
    description: 'Generate anagrams (rearrangements of letters) from a word.',
    keywords: ['anagram generator', 'anagram', 'word scramble'],
    category: categories.text,
    icon: '🔀'
  },
  {
    id: 'epoch-converter',
    name: 'Epoch Converter',
    slug: 'epoch-converter',
    tagline: 'Convert Unix timestamps',
    description: 'Convert Unix epoch timestamps (seconds or milliseconds) to human-readable dates and vice versa.',
    keywords: ['epoch converter', 'unix timestamp', 'timestamp converter'],
    category: categories.time,
    icon: '⏰',
    isPopular: true
  },
  {
    id: 'html-entity-encoder',
    name: 'HTML Entity Encoder/Decoder',
    slug: 'html-entity-encoder',
    tagline: 'Encode/decode HTML entities',
    description: 'Encode special characters to HTML entities or decode HTML entities back to text.',
    keywords: ['html entity', 'html encode', 'html decode', 'entity encoder'],
    category: categories.encoders,
    icon: '🔤'
  },
  {
    id: 'percent-encoder',
    name: 'Percent Encoder/Decoder',
    slug: 'percent-encoder',
    tagline: 'Encode/decode percent encoding',
    description: 'Encode text to percent-encoded format (URL encoding) or decode percent-encoded strings.',
    keywords: ['percent encode', 'url encode', 'percent decode', 'url decode'],
    category: categories.encoders,
    icon: '🔗'
  },
  // New Tools
  {
    id: 'graphql-formatter',
    name: 'GraphQL Formatter',
    slug: 'graphql-formatter',
    tagline: 'Format & beautify GraphQL queries',
    description: 'Format and beautify GraphQL queries and mutations with proper indentation. Also minify GraphQL.',
    keywords: ['graphql formatter', 'graphql beautifier', 'format graphql', 'graphql minifier'],
    category: categories.formatters,
    icon: '🔷',
    isNew: true
  },
  {
    id: 'env-file-generator',
    name: '.env File Generator',
    slug: 'env-file-generator',
    tagline: 'Generate .env files',
    description: 'Generate .env files with environment variables. Add, edit, and organize variables with comments.',
    keywords: ['env generator', 'environment variables', 'generate env', 'env file maker'],
    category: categories.generators,
    icon: '🔐',
    isNew: true,
    isPopular: true
  },
  {
    id: 'git-commit-message-generator',
    name: 'Git Commit Message Generator',
    slug: 'git-commit-message-generator',
    tagline: 'Generate conventional commit messages',
    description: 'Generate Git commit messages following Conventional Commits specification. Supports types, scopes, and breaking changes.',
    keywords: ['git commit generator', 'conventional commits', 'commit message', 'git commit'],
    category: categories.generators,
    icon: '📝',
    isNew: true,
    isPopular: true
  },
  {
    id: 'color-contrast-checker',
    name: 'Color Contrast Checker',
    slug: 'color-contrast-checker',
    tagline: 'Check WCAG color contrast',
    description: 'Check color contrast ratios for accessibility compliance. Verify WCAG AA and AAA standards for text readability.',
    keywords: ['color contrast', 'accessibility checker', 'wcag contrast', 'color accessibility'],
    category: categories.validators,
    icon: '🎨',
    isNew: true,
    isPopular: true
  },
  {
    id: 'markdown-to-html',
    name: 'Markdown to HTML',
    slug: 'markdown-to-html',
    tagline: 'Convert Markdown to HTML',
    description: 'Convert Markdown text to HTML format. Preview rendered HTML and get clean HTML output.',
    keywords: ['markdown to html', 'md to html', 'markdown converter', 'convert markdown'],
    category: categories.converters,
    icon: '📄',
    isNew: true
  },
  {
    id: 'css-specificity-calculator',
    name: 'CSS Specificity Calculator',
    slug: 'css-specificity-calculator',
    tagline: 'Calculate CSS selector specificity',
    description: 'Calculate CSS selector specificity scores. Understand which styles will be applied when selectors conflict.',
    keywords: ['css specificity', 'specificity calculator', 'css selector', 'css priority'],
    category: categories.css,
    icon: '🎯',
    isNew: true
  },
  // New Popular Tools
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    tagline: 'Compress images to reduce file size',
    description: 'Compress PNG, JPG, and WebP images to reduce file size while maintaining quality. Adjust quality and dimensions.',
    keywords: ['image compressor', 'compress image', 'image optimizer', 'reduce image size', 'jpg compressor', 'png compressor'],
    category: categories.image,
    icon: '🗜️',
    isNew: true,
    isPopular: true
  },
  {
    id: 'image-format-converter',
    name: 'Image Format Converter',
    slug: 'image-format-converter',
    tagline: 'Convert between image formats',
    description: 'Convert images between PNG, JPG, WebP, and BMP formats. Adjust quality settings for optimal results.',
    keywords: ['image converter', 'png to jpg', 'jpg to png', 'webp converter', 'image format converter', 'convert image'],
    category: categories.converters,
    icon: '🖼️',
    isNew: true,
    isPopular: true
  },
  {
    id: 'code-minifier',
    name: 'Code Minifier',
    slug: 'code-minifier',
    tagline: 'Minify HTML, CSS, and JavaScript',
    description: 'Minify HTML, CSS, and JavaScript code by removing whitespace, comments, and unnecessary characters.',
    keywords: ['code minifier', 'html minifier', 'css minifier', 'js minifier', 'javascript minifier', 'minify code'],
    category: categories.formatters,
    icon: '📦',
    isNew: true,
    isPopular: true
  },
  {
    id: 'url-shortener',
    name: 'URL Shortener',
    slug: 'url-shortener',
    tagline: 'Shorten URLs instantly',
    description: 'Create short URLs from long links. Client-side shortening with hash-based generation.',
    keywords: ['url shortener', 'shorten url', 'url shortener free', 'link shortener', 'tiny url'],
    category: categories.web,
    icon: '🔗',
    isNew: true,
    isPopular: true
  },
  {
    id: 'favicon-generator',
    name: 'Favicon Generator',
    slug: 'favicon-generator',
    tagline: 'Generate favicons in all sizes',
    description: 'Generate favicons in multiple sizes (16x16, 32x32, 180x180, etc.) from a single image. Perfect for websites and PWAs.',
    keywords: ['favicon generator', 'generate favicon', 'favicon maker', 'icon generator', 'apple touch icon'],
    category: categories.generators,
    icon: '⭐',
    isNew: true,
    isPopular: true
  },
  {
    id: 'qr-code-reader',
    name: 'QR Code Reader',
    slug: 'qr-code-reader',
    tagline: 'Decode QR codes from images',
    description: 'Scan and decode QR codes from images or using your camera. Extract text, URLs, and other data from QR codes.',
    keywords: ['qr code reader', 'qr code scanner', 'qr decoder', 'scan qr code', 'qr code decoder'],
    category: categories.generators,
    icon: '📷',
    isNew: true,
    isPopular: true
  },
  {
    id: 'regex-pattern-generator',
    name: 'Regex Pattern Generator',
    slug: 'regex-pattern-generator',
    tagline: 'Generate and test regex patterns',
    description: 'Generate regular expression patterns with common templates. Test patterns against text and see matches in real-time.',
    keywords: ['regex generator', 'regex builder', 'regular expression generator', 'regex pattern', 'regex maker'],
    category: categories.validators,
    icon: '.*',
    isNew: true,
    isPopular: true
  },
  {
    id: 'ip-address-lookup',
    name: 'IP Address Lookup',
    slug: 'ip-address-lookup',
    tagline: 'Lookup IP address information',
    description: 'Get detailed information about any IP address including location, ISP, organization, and geolocation data.',
    keywords: ['ip lookup', 'ip address lookup', 'ip geolocation', 'ip info', 'ip address finder', 'ip location'],
    category: categories.network,
    icon: '🌍',
    isNew: true,
    isPopular: true
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


