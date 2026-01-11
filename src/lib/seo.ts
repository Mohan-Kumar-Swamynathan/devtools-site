import type { Tool } from './tools';

export const generateToolMeta = (tool: Tool) => {
  return {
    title: `${tool.name} | DevTools`,
    description: tool.description,
    keywords: tool.keywords.join(', '),
    canonical: `https://devtool.site/${tool.slug}/`,
    ogImage: `https://devtool.site/og-image.png`
  };
};

export const generateHomeMeta = () => {
  return {
    title: 'DevTools - Free Online Developer Tools',
    description: 'Free online developer tools - JSON formatter, Base64 encoder, JWT decoder, timestamp converter, and 50+ more tools. Fast, free, and private.',
    keywords: ['developer tools', 'online tools', 'json formatter', 'base64 encoder', 'jwt decoder', 'free tools'],
    canonical: 'https://devtool.site/',
    ogImage: 'https://devtool.site/og-image.png'
  };
};


