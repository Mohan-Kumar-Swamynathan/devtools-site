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
  video: {
    id: 'video',
    name: 'Video Tools',
    icon: '🎬',
    description: 'Video processing and manipulation tools'
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
  },
  pdf: {
    id: 'pdf',
    name: 'PDF Tools',
    icon: '📄',
    description: 'PDF manipulation, conversion, and analysis tools'
  },
  calculators: {
    id: 'calculators',
    name: 'Calculators',
    icon: '🧮',
    description: 'Financial, health, and utility calculators'
  },
  ai: {
    id: 'ai',
    name: 'AI Tools',
    icon: '🤖',
    description: 'Free browser-based AI tools powered by open source models'
  },
  social: {
    id: 'social',
    name: 'Social Media',
    icon: '📱',
    description: 'Tools for Instagram, Twitter, YouTube, and more'
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
    id: 'code-beautifier',
    name: 'Code Beautifier',
    slug: 'code-beautifier',
    tagline: 'Beautify code in multiple languages',
    description: 'Free multi-language code beautifier. Format JavaScript, TypeScript, JSON, HTML, CSS, SQL, and XML with customizable indentation.',
    keywords: ['code beautifier', 'format code', 'prettify code', 'code formatter online', 'beautify javascript', 'beautify css', 'beautify html'],
    category: categories.formatters,
    icon: '✨',
    isPopular: true,
    isNew: true
  },
  {
    id: 'string-utilities',
    name: 'String Utilities',
    slug: 'string-utilities',
    tagline: 'Manipulate and analyze text strings',
    description: 'String manipulation tools. Reverse, shuffle, sort, change case, trim, remove duplicates, and count characters, words, and lines.',
    keywords: ['string utilities', 'text manipulation', 'reverse string', 'shuffle text', 'sort lines', 'character counter', 'word counter', 'string tools'],
    category: categories.text,
    icon: '🔤',
    isPopular: true,
    isNew: true
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
    id: 'caption-spacer',
    name: 'Instagram Caption Spacer',
    slug: 'caption-spacer',
    tagline: 'Add line breaks to Instagram captions',
    description: 'Format Instagram captions with invisible line breaks. Prevent text processing from removing your spacing.',
    keywords: ['instagram caption spacer', 'instagram line breaks', 'caption formatter', 'instagram spaces'],
    category: categories.social,
    icon: '📝'
  },
  {
    id: 'tweet-to-image',
    name: 'Tweet to Image',
    slug: 'tweet-to-image',
    tagline: 'Convert tweets to images',
    description: 'Create beautiful images from tweets and social media posts for Instagram, LinkedIn, and more.',
    keywords: ['tweet to image', 'twitter screenshots', 'social media images', 'tweet generator'],
    category: categories.social,
    icon: '🐦'
  },
  {
    id: 'social-image-resizer',
    name: 'Social Media Image Resizer',
    slug: 'social-image-resizer',
    tagline: 'Resize images for social media',
    description: 'Resize and crop images for Instagram, Twitter, LinkedIn, Facebook, and YouTube.',
    keywords: ['image resizer', 'social media sizes', 'instagram crop', 'twitter header size'],
    category: categories.social,
    icon: '🖼️'
  },
  {
    id: 'instagram-fonts-generator',
    name: 'Instagram Fonts Generator',
    slug: 'instagram-fonts-generator',
    tagline: 'Generate Instagram fonts',
    description: 'Generate cool text fonts for Instagram bio and captions. Copy and paste unicode characters.',
    keywords: ['instagram fonts', 'bio fonts', 'ig fonts', 'font generator'],
    category: categories.social,
    icon: 'Aa'
  },
  {
    id: 'youtube-thumbnail-downloader',
    name: 'YouTube Thumbnail Downloader',
    slug: 'youtube-thumbnail-downloader',
    tagline: 'Download YouTube thumbnails',
    description: 'Download HD thumbnails from any YouTube video in multiple resolutions.',
    keywords: ['youtube thumbnail', 'thumbnail downloader', 'youtube image'],
    category: categories.social,
    icon: '▶️'
  },
  {
    id: 'hashtag-generator',
    name: 'Hashtag Generator',
    slug: 'hashtag-generator',
    tagline: 'Generate hashtags for social media',
    description: 'Generate popular hashtags for Instagram and TikTok to boost your reach.',
    keywords: ['hashtag generator', 'instagram hashtags', 'tiktok hashtags'],
    category: categories.social,
    icon: '#️⃣'
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
    id: 'seo-analyzer',
    name: 'SEO Analyzer',
    slug: 'seo-analyzer',
    tagline: 'Analyze and improve your SEO',
    description: 'Free SEO analyzer tool. Check meta tags, structured data, Open Graph, Twitter Cards, and get actionable SEO recommendations to improve your search rankings.',
    keywords: ['seo analyzer', 'seo checker', 'meta tags analyzer', 'seo audit tool', 'open graph checker', 'structured data validator', 'seo score'],
    category: categories.web,
    icon: '🔍',
    isPopular: true,
    isNew: true
  },
  {
    id: 'utm-builder',
    name: 'UTM Builder',
    slug: 'utm-builder',
    tagline: 'Build Google Analytics URLs',
    description: 'Easily build campaign URLs with UTM parameters for Google Analytics tracking.',
    keywords: ['utm builder', 'campaign url builder', 'google analytics url', 'tracking url'],
    category: categories.web,
    icon: '🔗'
  },
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
  // Security Tools
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
    id: 'aspect-ratio-calculator',
    name: 'Aspect Ratio Calculator',
    slug: 'aspect-ratio-calculator',
    tagline: 'Calculate image & video aspect ratios',
    description: 'Calculate aspect ratios and dimensions for images and videos. Resize calculator for designers and developers.',
    keywords: ['aspect ratio calculator', 'screen resolution', 'image resize', 'video ratio', '16:9 calculator'],
    category: categories.image,
    icon: '📐',
    isPopular: true
  },
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
  },
  // Image Manipulation Tools
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    slug: 'image-cropper',
    tagline: 'Crop images with interactive selection',
    description: 'Crop images with an interactive selection tool. Choose aspect ratios or free-form cropping. All processing happens in your browser.',
    keywords: ['image cropper', 'crop image', 'image crop tool', 'photo cropper', 'crop photo'],
    category: categories.image,
    icon: '✂️',
    isNew: true,
    isPopular: true
  },
  {
    id: 'image-rotator',
    name: 'Image Rotator & Flipper',
    slug: 'image-rotator',
    tagline: 'Rotate and flip images',
    description: 'Rotate images 90°, 180°, 270° or flip them horizontally/vertically. Batch process multiple images.',
    keywords: ['image rotator', 'rotate image', 'flip image', 'image flip', 'rotate photo'],
    category: categories.image,
    icon: '🔄',
    isNew: true,
    isPopular: true
  },
  {
    id: 'image-filters',
    name: 'Image Filters',
    slug: 'image-filters',
    tagline: 'Apply filters and effects to images',
    description: 'Apply various filters and effects to images including brightness, contrast, saturation, grayscale, sepia, blur, and more.',
    keywords: ['image filters', 'photo filters', 'image effects', 'photo editor', 'image brightness', 'image contrast'],
    category: categories.image,
    icon: '🎨',
    isNew: true,
    isPopular: true
  },
  {
    id: 'image-watermarker',
    name: 'Image Watermarker',
    slug: 'image-watermarker',
    tagline: 'Add watermarks to images',
    description: 'Add text or image watermarks to your images. Control position, opacity, size, and style. Protect your images with custom watermarks.',
    keywords: ['image watermark', 'watermark tool', 'add watermark', 'photo watermark', 'image watermarker'],
    category: categories.image,
    icon: '💧',
    isNew: true
  },
  {
    id: 'image-merger',
    name: 'Image Merger',
    slug: 'image-merger',
    tagline: 'Merge multiple images together',
    description: 'Merge multiple images into one. Choose from horizontal, vertical, or grid layouts. Perfect for creating collages.',
    keywords: ['image merger', 'merge images', 'combine images', 'image collage', 'merge photos'],
    category: categories.image,
    icon: '🖼️',
    isNew: true
  },
  {
    id: 'gif-frame-extractor',
    name: 'GIF Frame Extractor',
    slug: 'gif-frame-extractor',
    tagline: 'Extract frames from GIF images',
    description: 'Extract individual frames from animated GIFs. Preview and download all frames or select specific ones.',
    keywords: ['gif frame extractor', 'extract gif frames', 'gif to images', 'gif frames', 'split gif'],
    category: categories.image,
    icon: '🎞️',
    isNew: true
  },
  {
    id: 'gif-creator',
    name: 'GIF Creator',
    slug: 'gif-creator',
    tagline: 'Create GIFs from images',
    description: 'Create animated GIFs from multiple images. Set frame delay, preview, and download your GIF.',
    keywords: ['gif creator', 'create gif', 'image to gif', 'gif maker', 'animated gif'],
    category: categories.image,
    icon: '🎬',
    isNew: true,
    isPopular: true
  },
  {
    id: 'image-to-ascii',
    name: 'Image to ASCII Art',
    slug: 'image-to-ascii',
    tagline: 'Convert images to ASCII art',
    description: 'Convert images to ASCII art text. Adjust character density and choose between color or grayscale output.',
    keywords: ['image to ascii', 'ascii art', 'ascii converter', 'text art', 'ascii generator'],
    category: categories.image,
    icon: '🎭',
    isNew: true
  },
  // Video Tools
  {
    id: 'video-frame-extractor',
    name: 'Video Frame Extractor',
    slug: 'video-frame-extractor',
    tagline: 'Extract frames from videos',
    description: 'Extract frames from videos at specific times. Get screenshots or extract multiple frames at intervals.',
    keywords: ['video frame extractor', 'extract video frames', 'video screenshot', 'video frames', 'video to images'],
    category: categories.video,
    icon: '📸',
    isNew: true,
    isPopular: true
  },
  {
    id: 'video-to-gif',
    name: 'Video to GIF',
    slug: 'video-to-gif',
    tagline: 'Convert video segments to GIF',
    description: 'Convert video segments to animated GIFs. Select time range, set frame rate, and create GIFs from videos.',
    keywords: ['video to gif', 'convert video to gif', 'video gif converter', 'mp4 to gif', 'video to animated gif'],
    category: categories.video,
    icon: '🎥',
    isNew: true,
    isPopular: true
  },
  {
    id: 'video-metadata-extractor',
    name: 'Video Metadata Extractor',
    slug: 'video-metadata-extractor',
    tagline: 'Extract metadata from videos',
    description: 'Extract detailed metadata from video files including duration, dimensions, file size, codec information, and more.',
    keywords: ['video metadata', 'video info', 'video properties', 'video details', 'video codec'],
    category: categories.video,
    icon: '📊',
    isNew: true
  },
  {
    id: 'video-thumbnail-generator',
    name: 'Video Thumbnail Generator',
    slug: 'video-thumbnail-generator',
    tagline: 'Generate thumbnails from videos',
    description: 'Generate thumbnails from videos at specific times. Create single thumbnails or multiple thumbnails in a grid layout.',
    keywords: ['video thumbnail', 'thumbnail generator', 'video thumbnail maker', 'video preview', 'video screenshot'],
    category: categories.video,
    icon: '🖼️',
    isNew: true
  },
  // Additional CSS Tools
  {
    id: 'css-animation-generator',
    name: 'CSS Animation Generator',
    slug: 'css-animation-generator',
    tagline: 'Generate CSS keyframe animations',
    description: 'Create CSS keyframe animations with visual timeline. Generate @keyframes rules with ease-in, ease-out, and custom timing functions.',
    keywords: ['css animation', 'keyframes generator', 'css animation maker', 'animation generator', 'keyframes'],
    category: categories.css,
    icon: '🎬',
    isNew: true,
    isPopular: true
  },
  {
    id: 'text-shadow-generator',
    name: 'Text Shadow Generator',
    slug: 'text-shadow-generator',
    tagline: 'Generate CSS text shadows',
    description: 'Visual CSS text shadow generator. Create multiple text shadows with color, blur, and offset controls.',
    keywords: ['text shadow generator', 'css text shadow', 'text shadow', 'text effect'],
    category: categories.css,
    icon: '✨',
    isNew: true,
    isPopular: true
  },
  {
    id: 'css-transform-generator',
    name: 'CSS Transform Generator',
    slug: 'css-transform-generator',
    tagline: 'Generate CSS transforms',
    description: 'Visual CSS transform generator. Create rotate, scale, translate, and skew transforms with interactive preview.',
    keywords: ['css transform', 'transform generator', 'css rotate', 'css scale', 'transform tool'],
    category: categories.css,
    icon: '🔄',
    isNew: true,
    isPopular: true
  },
  {
    id: 'css-grid-playground',
    name: 'CSS Grid Playground',
    slug: 'css-grid-playground',
    tagline: 'Learn CSS Grid interactively',
    description: 'Interactive CSS Grid playground. Learn CSS Grid with visual examples and real-time preview.',
    keywords: ['css grid', 'grid playground', 'css grid tutorial', 'learn grid', 'grid generator'],
    category: categories.css,
    icon: '📐',
    isNew: true,
    isPopular: true
  },
  // Data Generators
  {
    id: 'fake-data-generator',
    name: 'Fake Data Generator',
    slug: 'fake-data-generator',
    tagline: 'Generate fake test data',
    description: 'Generate fake JSON data, names, emails, addresses, phone numbers, and more for testing purposes.',
    keywords: ['fake data', 'test data generator', 'mock data', 'fake json', 'data generator'],
    category: categories.generators,
    icon: '🎲',
    isNew: true,
    isPopular: true
  },
  // Network & Web Tools
  {
    id: 'user-agent-parser',
    name: 'User Agent Parser',
    slug: 'user-agent-parser',
    tagline: 'Parse user agent strings',
    description: 'Parse and display browser, device, and OS information from user agent strings.',
    keywords: ['user agent parser', 'browser detector', 'user agent analyzer', 'device info'],
    category: categories.web,
    icon: '🔍',
    isNew: true,
    isPopular: true
  },
  {
    id: 'http-headers-parser',
    name: 'HTTP Headers Parser',
    slug: 'http-headers-parser',
    tagline: 'Parse HTTP headers',
    description: 'Parse and format HTTP request and response headers. View headers in a readable format.',
    keywords: ['http headers', 'headers parser', 'http parser', 'request headers', 'response headers'],
    category: categories.network,
    icon: '📋',
    isNew: true
  },
  // Security Tools
  {
    id: 'password-strength-checker',
    name: 'Password Strength Checker',
    slug: 'password-strength-checker',
    tagline: 'Check password strength',
    description: 'Check password strength with visual feedback. Analyze password complexity and security.',
    keywords: ['password strength', 'password checker', 'password analyzer', 'password security'],
    category: categories.security,
    icon: '🔐',
    isNew: true,
    isPopular: true
  },
  // Image Tools
  {
    id: 'svg-to-png',
    name: 'SVG to PNG/JPEG',
    slug: 'svg-to-png',
    tagline: 'Convert SVG to raster formats',
    description: 'Convert SVG images to PNG or JPEG format. Adjust quality and dimensions.',
    keywords: ['svg to png', 'svg to jpeg', 'svg converter', 'convert svg'],
    category: categories.image,
    icon: '🖼️',
    isNew: true
  },
  // File Tools
  {
    id: 'csv-viewer',
    name: 'CSV Viewer/Editor',
    slug: 'csv-viewer',
    tagline: 'View and edit CSV files',
    description: 'View, edit, and format CSV files. Sort, filter, and export CSV data.',
    keywords: ['csv viewer', 'csv editor', 'csv viewer online', 'csv reader', 'csv tool'],
    category: categories.file,
    icon: '📊',
    isNew: true,
    isPopular: true
  },
  // Code Tools
  {
    id: 'code-comment-remover',
    name: 'Code Comment Remover',
    slug: 'code-comment-remover',
    tagline: 'Remove comments from code',
    description: 'Remove comments from code files. Supports JavaScript, CSS, HTML, Python, and more.',
    keywords: ['comment remover', 'remove comments', 'code cleaner', 'strip comments'],
    category: categories.code,
    icon: '🧹',
    isNew: true
  },
  {
    id: 'multi-language-formatter',
    name: 'Multi-language Code Formatter',
    slug: 'multi-language-formatter',
    tagline: 'Format code in multiple languages',
    description: 'Format code in Python, Go, Rust, PHP, Java, and more. Beautify and indent code automatically.',
    keywords: ['code formatter', 'python formatter', 'go formatter', 'rust formatter', 'php formatter'],
    category: categories.formatters,
    icon: '💻',
    isNew: true
  },
  // Additional Developer Tools
  {
    id: 'viewport-tester',
    name: 'Viewport/Responsive Design Tester',
    slug: 'viewport-tester',
    tagline: 'Test responsive designs',
    description: 'Test your website at different viewport sizes. Simulate mobile, tablet, and desktop screens.',
    keywords: ['viewport tester', 'responsive tester', 'screen size tester', 'mobile tester', 'device simulator'],
    category: categories.web,
    icon: '📱',
    isNew: true,
    isPopular: true
  },
  {
    id: 'clip-path-generator',
    name: 'Clip Path Generator',
    slug: 'clip-path-generator',
    tagline: 'Generate CSS clip-path',
    description: 'Visual CSS clip-path generator. Create custom shapes with interactive polygon editor.',
    keywords: ['clip path', 'css clip path', 'clip path generator', 'css shapes'],
    category: categories.css,
    icon: '✂️',
    isNew: true,
    isPopular: true
  },
  {
    id: 'backdrop-filter-generator',
    name: 'Backdrop Filter Generator',
    slug: 'backdrop-filter-generator',
    tagline: 'Generate CSS backdrop filters',
    description: 'Create CSS backdrop-filter effects. Blur, brightness, contrast, and more with visual preview.',
    keywords: ['backdrop filter', 'css backdrop filter', 'glass morphism', 'frosted glass'],
    category: categories.css,
    icon: '🔮',
    isNew: true
  },
  {
    id: 'text-to-slug',
    name: 'Text to Slug Converter',
    slug: 'text-to-slug',
    tagline: 'Convert text to URL-friendly slugs',
    description: 'Convert any text to URL-friendly slugs. Remove special characters, lowercase, and replace spaces.',
    keywords: ['text to slug', 'slug converter', 'url slug', 'seo friendly url'],
    category: categories.text,
    icon: '🔗',
    isNew: true
  },
  {
    id: 'image-metadata-viewer',
    name: 'Image Metadata Viewer',
    slug: 'image-metadata-viewer',
    tagline: 'View EXIF and image metadata',
    description: 'View detailed EXIF data and metadata from images. See camera settings, location, and more.',
    keywords: ['image metadata', 'exif viewer', 'image info', 'photo metadata'],
    category: categories.image,
    icon: '📸',
    isNew: true
  },
  {
    id: 'text-statistics',
    name: 'Text Statistics Analyzer',
    slug: 'text-statistics',
    tagline: 'Analyze text statistics',
    description: 'Get detailed text statistics including word count, character count, reading time, and more.',
    keywords: ['text statistics', 'word counter', 'character counter', 'reading time', 'text analyzer'],
    category: categories.text,
    icon: '📊',
    isNew: true,
    isPopular: true
  },
  {
    id: 'json-path-builder',
    name: 'JSON Path Builder',
    slug: 'json-path-builder',
    tagline: 'Visual JSON path builder',
    description: 'Build and test JSON paths visually. Explore JSON structures and generate path expressions.',
    keywords: ['json path', 'jsonpath builder', 'json explorer', 'json path generator'],
    category: categories.json,
    icon: '🗺️',
    isNew: true
  },
  {
    id: 'api-mock-builder',
    name: 'API Mock Response Builder',
    slug: 'api-mock-builder',
    tagline: 'Build mock API responses',
    description: 'Build mock API responses for testing. Create realistic JSON responses with customizable data.',
    keywords: ['api mock', 'mock api', 'api builder', 'mock response', 'api testing'],
    category: categories.network,
    icon: '🔌',
    isNew: true,
    isPopular: true
  },
  {
    id: 'password-strength',
    name: 'Password Strength Checker',
    slug: 'password-strength',
    tagline: 'Test password strength',
    description: 'Check how strong your password is and get tips for improvement.',
    keywords: ['password strength', 'password security', 'password checker', 'security test'],
    category: categories.security,
    icon: '💪'
  },
  {
    id: 'html-minifier',
    name: 'HTML Minifier',
    slug: 'html-minifier',
    tagline: 'Minify HTML code',
    description: 'Minify HTML code by removing whitespace, comments, and unnecessary characters.',
    keywords: ['html minifier', 'minify html', 'html compressor', 'html optimizer'],
    category: categories.formatters,
    icon: '🗜️',
    isNew: true
  },
  {
    id: 'javascript-minifier',
    name: 'JavaScript Minifier',
    slug: 'javascript-minifier',
    tagline: 'Minify JavaScript code',
    description: 'Minify JavaScript code to reduce file size. Remove whitespace and optimize code.',
    keywords: ['javascript minifier', 'js minifier', 'minify js', 'js compressor'],
    category: categories.formatters,
    icon: '🗜️',
    isNew: true
  },
  {
    id: 'browser-compatibility',
    name: 'Browser Compatibility Checker',
    slug: 'browser-compatibility',
    tagline: 'Check CSS/JS browser support',
    description: 'Check browser compatibility for CSS properties and JavaScript features.',
    keywords: ['browser compatibility', 'caniuse', 'browser support', 'css support', 'js support'],
    category: categories.web,
    icon: '🌐',
    isNew: true
  },
  {
    id: 'webhook-tester',
    name: 'Webhook Payload Tester',
    slug: 'webhook-tester',
    tagline: 'Test webhook payloads',
    description: 'Test and validate webhook payloads. Simulate webhook requests and view responses.',
    keywords: ['webhook tester', 'webhook payload', 'webhook simulator', 'api webhook'],
    category: categories.network,
    icon: '🔔',
    isNew: true
  },
  {
    id: 'css-variable-generator',
    name: 'CSS Variable Generator',
    slug: 'css-variable-generator',
    tagline: 'Generate CSS custom properties',
    description: 'Generate CSS custom properties (variables) with color palettes and design tokens.',
    keywords: ['css variables', 'css custom properties', 'css vars', 'design tokens'],
    category: categories.css,
    icon: '🎨',
    isNew: true
  },
  {
    id: 'font-pairing-generator',
    name: 'Font Pairing Generator',
    slug: 'font-pairing-generator',
    tagline: 'Generate font pairings',
    description: 'Generate beautiful font pairings for your designs. Get suggestions for heading and body fonts.',
    keywords: ['font pairing', 'typography', 'font combinations', 'font suggestions'],
    category: categories.css,
    icon: '🔤',
    isNew: true
  },
  // Additional Popular Tools
  {
    id: 'mime-type-lookup',
    name: 'MIME Type Lookup',
    slug: 'mime-type-lookup',
    tagline: 'Lookup MIME types',
    description: 'Lookup MIME types for file extensions. Find the correct Content-Type for any file extension.',
    keywords: ['mime type', 'content type', 'file mime type', 'mime type lookup'],
    category: categories.web,
    icon: '📋',
    isNew: true,
    isPopular: true
  },
  {
    id: 'file-extension-lookup',
    name: 'File Extension Lookup',
    slug: 'file-extension-lookup',
    tagline: 'Lookup file extensions',
    description: 'Lookup file extensions and their descriptions. Find what file type a extension belongs to.',
    keywords: ['file extension', 'file type', 'extension lookup', 'file extension finder'],
    category: categories.misc,
    icon: '📁',
    isNew: true,
    isPopular: true
  },
  {
    id: 'emoji-picker',
    name: 'Emoji Picker',
    slug: 'emoji-picker',
    tagline: 'Copy emojis easily',
    description: 'Browse and copy emojis easily. Search emojis by name or category.',
    keywords: ['emoji picker', 'emoji copy', 'emoji finder', 'emoji search'],
    category: categories.text,
    icon: '😀',
    isNew: true,
    isPopular: true
  },
  {
    id: 'dns-lookup',
    name: 'DNS Lookup',
    slug: 'dns-lookup',
    tagline: 'Check DNS records',
    description: 'Perform Dns lookups to check A, AAAA, MX, NS, CNAME, TXT, and SOA records.',
    keywords: ['dns lookup', 'dns checker', 'mx record', 'soa record', 'dns propagation'],
    category: categories.network,
    icon: '🌐'
  },
  {
    id: 'unicode-lookup',
    name: 'Unicode Lookup',
    slug: 'unicode-lookup',
    tagline: 'Lookup Unicode characters',
    description: 'Lookup Unicode characters by name, code point, or search. Find emoji, symbols, and special characters.',
    keywords: ['unicode lookup', 'unicode character', 'unicode finder', 'character lookup'],
    category: categories.text,
    icon: '🔤',
    isNew: true
  },
  {
    id: 'html-entity-decoder',
    name: 'HTML Entity Decoder',
    slug: 'html-entity-decoder',
    tagline: 'Decode HTML entities',
    description: 'Decode HTML entities to their actual characters. Convert &amp; to &, &lt; to <, etc.',
    keywords: ['html entity decoder', 'decode html entities', 'html decode', 'entity decoder'],
    category: categories.encoders,
    icon: '🔓',
    isNew: true,
    isPopular: true
  },
  {
    id: 'color-palette-generator',
    name: 'Color Palette Generator',
    slug: 'color-palette-generator',
    tagline: 'Generate color palettes',
    description: 'Generate beautiful color palettes for your designs. Create harmonious color schemes.',
    keywords: ['color palette', 'color scheme', 'palette generator', 'color combinations'],
    category: categories.css,
    icon: '🎨',
    isNew: true,
    isPopular: true
  },
  {
    id: 'word-frequency-counter',
    name: 'Word Frequency Counter',
    slug: 'word-frequency-counter',
    tagline: 'Count word frequencies',
    description: 'Count word frequencies in text. Analyze which words appear most often.',
    keywords: ['word frequency', 'word counter', 'frequency analysis', 'word count'],
    category: categories.text,
    icon: '📊',
    isNew: true
  },
  {
    id: 'line-counter',
    name: 'Line Counter',
    slug: 'line-counter',
    tagline: 'Count lines in text',
    description: 'Count lines, words, and characters in text. Get detailed statistics about your text.',
    keywords: ['line counter', 'line count', 'text statistics', 'code line counter'],
    category: categories.text,
    icon: '📏',
    isNew: true
  },
  // PDF Tools
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    slug: 'pdf-merger',
    tagline: 'Merge multiple PDFs',
    description: 'Merge multiple PDF files into one. Combine PDFs in any order you want.',
    keywords: ['pdf merger', 'merge pdf', 'combine pdf', 'pdf combine', 'join pdf'],
    category: categories.pdf,
    icon: '📄',
    isNew: true,
    isPopular: true
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    slug: 'pdf-splitter',
    tagline: 'Split PDF into multiple files',
    description: 'Split PDF files into multiple smaller PDFs. Extract specific pages or split by page ranges.',
    keywords: ['pdf splitter', 'split pdf', 'extract pdf pages', 'pdf extractor'],
    category: categories.pdf,
    icon: '✂️',
    isNew: true,
    isPopular: true
  },
  {
    id: 'pdf-metadata-extractor',
    name: 'PDF Metadata Extractor',
    slug: 'pdf-metadata-extractor',
    tagline: 'Extract PDF metadata',
    description: 'Extract metadata from PDF files. View title, author, creation date, and more.',
    keywords: ['pdf metadata', 'pdf info', 'pdf properties', 'pdf extractor'],
    category: categories.pdf,
    icon: '📋',
    isNew: true
  },
  {
    id: 'pdf-to-images',
    name: 'PDF to Images',
    slug: 'pdf-to-images',
    tagline: 'Convert PDF pages to images',
    description: 'Convert PDF pages to PNG or JPEG images. Extract all pages or specific pages.',
    keywords: ['pdf to image', 'pdf to png', 'pdf to jpeg', 'pdf converter'],
    category: categories.pdf,
    icon: '🖼️',
    isNew: true,
    isPopular: true
  },
  {
    id: 'pdf-page-rotator',
    name: 'PDF Page Rotator',
    slug: 'pdf-page-rotator',
    tagline: 'Rotate PDF pages',
    description: 'Rotate pages in PDF files. Rotate all pages or specific pages by 90, 180, or 270 degrees.',
    keywords: ['pdf rotate', 'rotate pdf pages', 'pdf page rotation'],
    category: categories.pdf,
    icon: '🔄',
    isNew: true
  },
  {
    id: 'pdf-page-deleter',
    name: 'PDF Page Deleter',
    slug: 'pdf-page-deleter',
    tagline: 'Delete pages from PDF',
    description: 'Remove pages from PDF files. Delete specific pages or page ranges.',
    keywords: ['pdf delete pages', 'remove pdf pages', 'pdf page remover'],
    category: categories.pdf,
    icon: '🗑️',
    isNew: true
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text',
    slug: 'pdf-to-text',
    tagline: 'Extract text from PDF',
    description: 'Extract text content from PDF files. Copy or download extracted text.',
    keywords: ['pdf to text', 'extract text from pdf', 'pdf text extractor', 'pdf reader'],
    category: categories.pdf,
    icon: '📝',
    isNew: true,
    isPopular: true
  },
  {
    id: 'pdf-compressor',
    name: 'PDF Compressor',
    slug: 'pdf-compressor',
    tagline: 'Compress PDF files',
    description: 'Compress PDF files to reduce file size. Optimize PDFs for web or email.',
    keywords: ['pdf compressor', 'compress pdf', 'pdf optimizer', 'reduce pdf size'],
    category: categories.pdf,
    icon: '🗜️',
    isNew: true,
    isPopular: true
  },
  // Financial Calculators
  {
    id: 'tip-calculator',
    name: 'Tip Calculator',
    slug: 'tip-calculator',
    tagline: 'Calculate restaurant tips',
    description: 'Calculate restaurant tips with percentage and split bill functionality. Perfect for dining out.',
    keywords: ['tip calculator', 'restaurant tip', 'bill splitter', 'tip calculator online'],
    category: categories.calculators,
    icon: '💰',
    isNew: true,
    isPopular: true
  },
  {
    id: 'loan-calculator',
    name: 'Loan/EMI Calculator',
    slug: 'loan-calculator',
    tagline: 'Calculate loan EMI',
    description: 'Calculate monthly EMI, interest, and total amount for loans. View amortization schedule.',
    keywords: ['loan calculator', 'emi calculator', 'loan emi', 'mortgage calculator', 'loan payment'],
    category: categories.calculators,
    icon: '💳',
    isNew: true,
    isPopular: true
  },
  {
    id: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    slug: 'mortgage-calculator',
    tagline: 'Calculate mortgage payments',
    description: 'Calculate monthly mortgage payments with principal, interest, taxes, and insurance.',
    keywords: ['mortgage calculator', 'home loan calculator', 'mortgage payment', 'house loan'],
    category: categories.calculators,
    icon: '🏠',
    isNew: true,
    isPopular: true
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    tagline: 'Calculate compound interest',
    description: 'Calculate compound interest over time. See how your investments grow with compounding.',
    keywords: ['compound interest', 'interest calculator', 'investment calculator', 'compound interest calculator'],
    category: categories.calculators,
    icon: '📈',
    isNew: true,
    isPopular: true
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    tagline: 'Calculate percentages',
    description: 'Calculate percentages, discounts, markups, and percentage changes. Multiple calculation modes.',
    keywords: ['percentage calculator', 'discount calculator', 'percentage increase', 'percentage decrease'],
    category: categories.calculators,
    icon: '📊',
    isNew: true,
    isPopular: true
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    slug: 'bmi-calculator',
    tagline: 'Calculate Body Mass Index',
    description: 'Calculate Body Mass Index (BMI) with health categories. Track your health metrics.',
    keywords: ['bmi calculator', 'body mass index', 'bmi calculator online', 'health calculator'],
    category: categories.calculators,
    icon: '⚖️',
    isNew: true,
    isPopular: true
  },
  // Productivity Tools
  {
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    slug: 'pomodoro-timer',
    tagline: 'Focus timer with breaks',
    description: '25-minute focus timer with breaks. Boost productivity with the Pomodoro Technique.',
    keywords: ['pomodoro timer', 'focus timer', 'productivity timer', 'pomodoro technique'],
    category: categories.misc,
    icon: '🍅',
    isNew: true,
    isPopular: true
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch',
    slug: 'stopwatch',
    tagline: 'Simple stopwatch with laps',
    description: 'Simple stopwatch with lap times. Track time accurately for any activity.',
    keywords: ['stopwatch', 'timer', 'lap timer', 'stopwatch online'],
    category: categories.misc,
    icon: '⏱️',
    isNew: true,
    isPopular: true
  },
  // Color Converters
  {
    id: 'hex-to-rgb',
    name: 'Hex to RGB Converter',
    slug: 'hex-to-rgb',
    tagline: 'Convert hex to RGB',
    description: 'Convert hex color codes to RGB values. Get RGB, RGBA, and HSL values.',
    keywords: ['hex to rgb', 'color converter', 'hex color', 'rgb converter'],
    category: categories.css,
    icon: '🎨',
    isNew: true
  },
  {
    id: 'rgb-to-hex',
    name: 'RGB to Hex Converter',
    slug: 'rgb-to-hex',
    tagline: 'Convert RGB to hex',
    description: 'Convert RGB color values to hex codes. Input RGB and get hex color code.',
    keywords: ['rgb to hex', 'color converter', 'rgb color', 'hex converter'],
    category: categories.css,
    icon: '🎨',
    isNew: true
  },
  {
    id: 'hsl-to-rgb',
    name: 'HSL to RGB Converter',
    slug: 'hsl-to-rgb',
    tagline: 'Convert HSL to RGB',
    description: 'Convert HSL color values to RGB and vice versa. Complete color conversion tool.',
    keywords: ['hsl to rgb', 'rgb to hsl', 'color converter', 'hsl converter'],
    category: categories.css,
    icon: '🌈',
    isNew: true
  },
  // Utility Tools
  {
    id: 'binary-to-text',
    name: 'Binary to Text',
    slug: 'binary-to-text',
    tagline: 'Decode binary to text',
    description: 'Convert binary code to text. Decode binary strings to readable text.',
    keywords: ['binary to text', 'binary decoder', 'decode binary', 'binary converter'],
    category: categories.encoders,
    icon: '🔢',
    isNew: true
  },
  {
    id: 'base64-to-image',
    name: 'Base64 to Image',
    slug: 'base64-to-image',
    tagline: 'Decode base64 to image',
    description: 'Convert base64 encoded strings to images. Decode and download base64 images.',
    keywords: ['base64 to image', 'base64 decoder', 'decode base64 image', 'base64 image converter'],
    category: categories.encoders,
    icon: '🖼️',
    isNew: true
  },
  {
    id: 'json-to-table',
    name: 'JSON to Table',
    slug: 'json-to-table',
    tagline: 'Visual JSON table viewer',
    description: 'Convert JSON data to a sortable and filterable table. Visual JSON data viewer.',
    keywords: ['json to table', 'json viewer', 'json table', 'json data viewer'],
    category: categories.json,
    icon: '📋',
    isNew: true,
    isPopular: true
  },
  {
    id: 'sql-query-builder',
    name: 'SQL Query Builder',
    slug: 'sql-query-builder',
    tagline: 'Visual SQL query builder',
    description: 'Build SQL queries visually. Select tables, columns, and conditions to generate SQL.',
    keywords: ['sql query builder', 'sql generator', 'visual sql', 'sql builder online'],
    category: categories.misc,
    icon: '🗄️',
    isNew: true,
    isPopular: true
  },
  {
    id: 'barcode-generator',
    name: 'Barcode Generator',
    slug: 'barcode-generator',
    tagline: 'Generate barcodes',
    description: 'Generate barcodes in multiple formats (Code128, EAN, UPC). Download as image.',
    keywords: ['barcode generator', 'barcode maker', 'generate barcode', 'barcode creator'],
    category: categories.generators,
    icon: '📊',
    isNew: true,
    isPopular: true
  },
  {
    id: 'responsive-design-tester',
    name: 'Responsive Design Tester',
    slug: 'responsive-design-tester',
    tagline: 'Test website on different devices',
    description: 'Preview how your website looks on different devices and screen sizes. Test responsive design with mobile, tablet, and desktop views.',
    keywords: ['responsive design', 'viewport tester', 'mobile view', 'tablet view', 'device preview', 'screen size tester'],
    category: categories.web,
    icon: '📱',
    isNew: true,
    isPopular: true
  },
  // AI Tools
  {
    id: 'text-summarizer',
    name: 'AI Text Summarizer',
    slug: 'text-summarizer',
    tagline: 'Summarize text with AI',
    description: 'Free AI-powered text summarizer. Extract key points and create concise summaries from long articles, documents, or text. Powered by Transformers.js.',
    keywords: ['text summarizer', 'ai summarizer', 'summarize text', 'text summary', 'ai summary', 'article summarizer'],
    category: categories.ai,
    icon: '📝',
    isNew: true,
    isPopular: true
  },
  {
    id: 'sentiment-analyzer',
    name: 'Sentiment Analyzer',
    slug: 'sentiment-analyzer',
    tagline: 'Analyze text sentiment with AI',
    description: 'Free AI sentiment analysis tool. Detect positive, negative, or neutral sentiment in text. Perfect for analyzing reviews, comments, or social media posts.',
    keywords: ['sentiment analysis', 'sentiment analyzer', 'text sentiment', 'emotion detection', 'ai sentiment', 'sentiment detector'],
    category: categories.ai,
    icon: '😊',
    isNew: true,
    isPopular: true
  },
  {
    id: 'language-detector',
    name: 'Language Detector',
    slug: 'language-detector',
    tagline: 'Detect text language with AI',
    description: 'Free AI language detection tool. Automatically identify the language of any text. Supports 100+ languages with high accuracy.',
    keywords: ['language detector', 'language identification', 'detect language', 'language recognition', 'ai language detector'],
    category: categories.ai,
    icon: '🌍',
    isNew: true
  },
  {
    id: 'text-paraphrase',
    name: 'Text Paraphrase Tool',
    slug: 'text-paraphrase',
    tagline: 'Paraphrase text with AI',
    description: 'Free AI text paraphrasing tool. Rewrite sentences and paragraphs while maintaining meaning. Perfect for content creation and avoiding plagiarism.',
    keywords: ['paraphrase', 'text rewriter', 'ai rewriter', 'paraphrase tool', 'rewrite text', 'text spinner'],
    category: categories.ai,
    icon: '🔄',
    isNew: true,
    isPopular: true
  },
  {
    id: 'named-entity-recognition',
    name: 'Named Entity Recognition',
    slug: 'named-entity-recognition',
    tagline: 'Extract entities from text',
    description: 'Free AI-powered named entity recognition. Extract people, organizations, locations, dates, and more from text automatically.',
    keywords: ['named entity recognition', 'ner', 'entity extraction', 'text entities', 'ai ner', 'entity recognition'],
    category: categories.ai,
    icon: '🏷️',
    isNew: true
  },
  {
    id: 'text-similarity',
    name: 'Text Similarity Checker',
    slug: 'text-similarity',
    tagline: 'Compare text similarity with AI',
    description: 'Free AI text similarity checker. Compare two texts and calculate similarity score. Detect plagiarism, find duplicate content, or measure text similarity.',
    keywords: ['text similarity', 'similarity checker', 'text compare', 'plagiarism checker', 'duplicate text', 'ai similarity'],
    category: categories.ai,
    icon: '🔍',
    isNew: true
  },
  {
    id: 'code-explainer',
    name: 'AI Code Explainer',
    slug: 'code-explainer',
    tagline: 'Explain code with AI',
    description: 'Free AI code explanation tool. Get detailed explanations of code snippets in plain English. Understand complex code quickly.',
    keywords: ['code explainer', 'explain code', 'ai code explanation', 'code documentation', 'code comments', 'ai code helper'],
    category: categories.ai,
    icon: '💻',
    isNew: true,
    isPopular: true
  },
  {
    id: 'keyword-extractor',
    name: 'AI Keyword Extractor',
    slug: 'keyword-extractor',
    tagline: 'Extract keywords from text',
    description: 'Free AI keyword extraction tool. Automatically extract important keywords and phrases from text. Perfect for SEO, content analysis, and research.',
    keywords: ['keyword extractor', 'extract keywords', 'ai keywords', 'keyword extraction', 'text keywords', 'seo keywords'],
    category: categories.ai,
    icon: '🔑',
    isNew: true
  },
  {
    id: 'text-classifier',
    name: 'Text Classifier',
    slug: 'text-classifier',
    tagline: 'Classify text with AI',
    description: 'Free AI text classification tool. Automatically categorize text into predefined categories. Perfect for content moderation, spam detection, and organization.',
    keywords: ['text classifier', 'text classification', 'categorize text', 'ai classifier', 'text categorization', 'content classification'],
    category: categories.ai,
    icon: '📂',
    isNew: true
  },
  {
    id: 'code-reviewer',
    name: 'AI Code Reviewer',
    slug: 'code-reviewer',
    tagline: 'Review code with AI',
    description: 'Free AI code review tool. Get suggestions for code improvements, bug detection, and best practices. Powered by open source AI models.',
    keywords: ['code review', 'ai code review', 'code reviewer', 'code analysis', 'code suggestions', 'ai code helper'],
    category: categories.ai,
    icon: '👁️',
    isNew: true,
    isPopular: true
  },
  {
    id: 'text-translator',
    name: 'AI Text Translator',
    slug: 'text-translator',
    tagline: 'Translate text with AI',
    description: 'Free AI-powered text translation tool. Translate text between multiple languages using browser-based AI models. No API keys required.',
    keywords: ['text translator', 'ai translator', 'translate text', 'language translator', 'ai translation', 'multilingual'],
    category: categories.ai,
    icon: '🌐',
    isNew: true,
    isPopular: true
  },
  {
    id: 'text-generator',
    name: 'AI Text Generator',
    slug: 'text-generator',
    tagline: 'Generate text with AI',
    description: 'Free AI text generator. Create content, write articles, generate ideas, and more using open source language models running in your browser.',
    keywords: ['text generator', 'ai generator', 'content generator', 'ai writing', 'text creation', 'ai content'],
    category: categories.ai,
    icon: '✍️',
    isNew: true
  },
  // Additional Useful Tools
  {
    id: 'api-key-generator',
    name: 'API Key Generator',
    slug: 'api-key-generator',
    tagline: 'Generate secure API keys',
    description: 'Generate cryptographically secure API keys for your applications. Multiple formats and lengths supported.',
    keywords: ['api key generator', 'generate api key', 'secure key generator', 'api token'],
    category: categories.generators,
    icon: '🔐',
    isNew: true
  },
  {
    id: 'color-shades-generator',
    name: 'Color Shades Generator',
    slug: 'color-shades-generator',
    tagline: 'Generate color shades and tints',
    description: 'Generate color shades, tints, and variations from a base color. Perfect for creating color palettes.',
    keywords: ['color shades', 'color generator', 'color palette', 'shades generator'],
    category: categories.css,
    icon: '🎨',
    isNew: true
  },
  {
    id: 'css-clip-path-generator',
    name: 'CSS Clip Path Generator',
    slug: 'css-clip-path-generator',
    tagline: 'Generate CSS clip-path values',
    description: 'Visual CSS clip-path generator. Create custom shapes and export CSS code.',
    keywords: ['css clip path', 'clip path generator', 'css shapes', 'clip-path'],
    category: categories.css,
    icon: '✂️',
    isNew: true
  },
  {
    id: 'json-schema-generator',
    name: 'JSON Schema Generator',
    slug: 'json-schema-generator',
    tagline: 'Generate JSON Schema from JSON',
    description: 'Automatically generate JSON Schema from JSON data. Validate JSON structure and generate schemas.',
    keywords: ['json schema', 'schema generator', 'json validation', 'json schema generator'],
    category: categories.json,
    icon: '📋',
    isNew: true
  },
  {
    id: 'sql-query-formatter',
    name: 'SQL Query Formatter',
    slug: 'sql-query-formatter',
    tagline: 'Format and beautify SQL queries',
    description: 'Format SQL queries with proper indentation and syntax highlighting. Supports multiple SQL dialects.',
    keywords: ['sql formatter', 'sql beautifier', 'format sql', 'sql prettifier'],
    category: categories.formatters,
    icon: '🗄️',
    isNew: true
  },
  {
    id: 'regex-replacer',
    name: 'Regex Replacer',
    slug: 'regex-replacer',
    tagline: 'Find and replace with regex',
    description: 'Find and replace text using regular expressions. Test regex patterns and see results in real-time.',
    keywords: ['regex replace', 'regex replacer', 'find replace regex', 'regex substitution'],
    category: categories.text,
    icon: '🔄',
    isNew: true
  },
  {
    id: 'json-compare',
    name: 'JSON Compare',
    slug: 'json-compare',
    tagline: 'Compare and merge JSON objects',
    description: 'Compare two JSON objects side-by-side, find differences, and merge changes.',
    keywords: ['json compare', 'json merge', 'compare json', 'json diff tool'],
    category: categories.json,
    icon: '⚖️',
    isNew: true
  },
  {
    id: 'api-documentation-generator',
    name: 'API Documentation Generator',
    slug: 'api-documentation-generator',
    tagline: 'Generate API docs from endpoints',
    description: 'Generate API documentation in Markdown format. Includes endpoints, parameters, and examples.',
    keywords: ['api docs', 'api documentation', 'generate api docs', 'api markdown'],
    category: categories.documentation,
    icon: '📖',
    isNew: true
  },
  {
    id: 'env-file-validator',
    name: '.env File Validator',
    slug: 'env-file-validator',
    tagline: 'Validate environment variable files',
    description: 'Validate .env files for syntax errors, duplicate keys, and best practices.',
    keywords: ['env validator', 'validate env file', 'environment variables', 'env checker'],
    category: categories.validators,
    icon: '✅',
    isNew: true
  },
  {
    id: 'http-request-builder',
    name: 'HTTP Request Builder',
    slug: 'http-request-builder',
    tagline: 'Build and test HTTP requests',
    description: 'Build HTTP requests visually. Test APIs with custom headers, body, and methods.',
    keywords: ['http request', 'api tester', 'http builder', 'rest client'],
    category: categories.network,
    icon: '🌐',
    isNew: true
  },
  {
    id: 'webhook-builder',
    name: 'Webhook Builder',
    slug: 'webhook-builder',
    tagline: 'Build and test webhooks',
    description: 'Create and test webhook payloads. Simulate webhook calls and validate responses.',
    keywords: ['webhook builder', 'webhook tester', 'webhook simulator', 'webhook creator'],
    category: categories.network,
    icon: '🪝',
    isNew: true
  },
  {
    id: 'css-animation-generator',
    name: 'CSS Animation Generator',
    slug: 'css-animation-generator',
    tagline: 'Generate CSS animations visually',
    description: 'Create CSS animations with a visual editor. Export keyframe animations and transitions.',
    keywords: ['css animation', 'animation generator', 'keyframes generator', 'css keyframes'],
    category: categories.css,
    icon: '🎬',
    isNew: true
  },
  {
    id: 'json-to-graphql',
    name: 'JSON to GraphQL',
    slug: 'json-to-graphql',
    tagline: 'Convert JSON to GraphQL schema',
    description: 'Convert JSON data to GraphQL schema and queries. Generate type definitions automatically.',
    keywords: ['json to graphql', 'graphql schema', 'graphql generator', 'json graphql'],
    category: categories.converters,
    icon: '🔄',
    isNew: true
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Editor',
    slug: 'markdown-editor',
    tagline: 'Live markdown editor with preview',
    description: 'Full-featured markdown editor with live preview, syntax highlighting, and export options.',
    keywords: ['markdown editor', 'md editor', 'markdown preview', 'markdown writer'],
    category: categories.text,
    icon: '✏️',
    isNew: true
  },
  {
    id: 'code-formatter',
    name: 'Multi-Language Code Formatter',
    slug: 'code-formatter',
    tagline: 'Format code in multiple languages',
    description: 'Format and beautify code in JavaScript, Python, Java, C++, and more. One tool for all languages.',
    keywords: ['code formatter', 'code beautifier', 'format code', 'prettify code'],
    category: categories.formatters,
    icon: '✨',
    isNew: true
  },
  {
    id: 'base64-image-converter',
    name: 'Base64 Image Converter',
    slug: 'base64-image-converter',
    tagline: 'Convert images to/from Base64',
    description: 'Convert images to Base64 strings and decode Base64 back to images. Supports all image formats.',
    keywords: ['base64 image', 'image base64', 'base64 converter', 'image encoder'],
    category: categories.converters,
    icon: '🖼️',
    isNew: true
  },
  {
    id: 'flow-builder',
    name: 'Flow Builder',
    slug: 'flow-builder',
    tagline: 'Visual flowchart builder - Canva-level ease, Linear-level precision',
    description: 'Create beautiful flowcharts and process diagrams with ease. Visual canvas editor with automatic layout, built-in validation, and Mermaid compatibility. Works entirely in your browser - no backend, no login required.',
    keywords: ['flowchart', 'diagram', 'flow builder', 'process diagram', 'mermaid', 'flowchart maker', 'diagram tool', 'visual flow'],
    category: categories.misc,
    icon: '📊',
    isNew: true,
    isPopular: true
  },
  {
    id: 'device-mockup-generator',
    name: 'Device Mockup Generator',
    slug: 'device-mockup-generator',
    tagline: 'Create device mockups',
    description: 'Create beautiful device mockups for your screenshots. Browser windows, iPhone frames, and more.',
    keywords: ['device mockup', 'browser frame', 'iphone mockup', 'screenshot wrapper'],
    category: categories.image,
    icon: '📱',
    isNew: true,
    isPopular: true
  },
  {
    id: 'social-media-image-resizer',
    name: 'Social Media Image Resizer',
    slug: 'social-media-image-resizer',
    tagline: 'Resize for social media',
    description: 'Resize and crop images for Instagram, Twitter, LinkedIn, and more.',
    keywords: ['social media resizer', 'image cropper', 'instagram post size', 'twitter header size'],
    category: categories.image,
    icon: '🖼️',
    isNew: true,
    isPopular: true
  },
  {
    id: 'wifi-qr-code-generator',
    name: 'WiFi QR Code Generator',
    slug: 'wifi-qr-code-generator',
    tagline: 'Share WiFi via QR Code',
    description: 'Generate a QR code to share your WiFi network credentials. Supports WPA/WPA2, WEP, and Open networks.',
    keywords: ['wifi qr code', 'wifi sharing', 'qr code generator', 'wifi password share'],
    category: categories.misc,
    icon: '📶',
    isNew: true,
    isPopular: true
  },
  {
    id: 'jwt-debugger',
    name: 'JWT Debugger',
    slug: 'jwt-debugger',
    tagline: 'Decode & Inspect JWTs',
    description: 'Decode and verify JSON Web Tokens (JWT). Inspect header, payload and signature.',
    keywords: ['jwt', 'json web token', 'decode jwt', 'jwt debugger', 'token inspector'],
    category: categories.web,
    icon: '🔒',
    isNew: true,
    isPopular: true
  },
  {
    id: 'keyboard-event-viewer',
    name: 'Keyboard Event Viewer',
    slug: 'keyboard-event-viewer',
    tagline: 'Visualize Keyboard Events',
    description: 'Real-time visualization of JavaScript keyboard events, key codes, and modifiers.',
    keywords: ['keyboard event', 'keycode', 'javascript key event', 'key event viewer'],
    category: categories.web,
    icon: '⌨️',
    isNew: true,
    isPopular: true
  },
  {
    id: 'cron-expression-generator',
    name: 'Cron Generator',
    slug: 'cron-expression-generator',
    tagline: 'Visual Cron Editor',
    description: 'Generate and explain cron schedule expressions. Include visual breakdown of minute, hour, day, month, and week fields.',
    keywords: ['cron', 'cron generator', 'cron scheduler', 'crontab', 'schedule editor'],
    category: categories.misc,
    icon: '⏰',
    isNew: true,
    isPopular: true
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    slug: 'regex-tester',
    tagline: 'Test Regular Expressions',
    description: 'Test and debug regular expressions in real-time. See matches, groups, and flags instantly.',
    keywords: ['regex', 'regular expression', 'regex tester', 'pattern matching', 'regex debugger'],
    category: categories.web,
    icon: '🔍',
    isNew: true,
    isPopular: true
  },
  {
    id: 'css-unit-converter',
    name: 'CSS Unit Converter',
    slug: 'css-unit-converter',
    tagline: 'Convert CSS Units',
    description: 'Convert between CSS units: px, rem, em, %, vw, vh, and pt. Essential for responsive design.',
    keywords: ['css units', 'px to rem', 'rem to px', 'css converter', 'responsive design'],
    category: categories.web,
    icon: '📐',
    isNew: true,
    isPopular: true
  },
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


