import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function unslugify(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => {
      // Special handling for common abbreviations
      if (word.toLowerCase() === 'ai') return 'AI';
      if (word.toLowerCase() === 'api') return 'API';
      if (word.toLowerCase() === 'ui') return 'UI';
      if (word.toLowerCase() === 'ux') return 'UX';
      if (word.toLowerCase() === 'ci') return 'CI';
      if (word.toLowerCase() === 'cd') return 'CD';
      if (word.toLowerCase() === 'sql') return 'SQL';
      if (word.toLowerCase() === 'nosql') return 'NoSQL';
      if (word.toLowerCase() === 'json') return 'JSON';
      if (word.toLowerCase() === 'xml') return 'XML';
      if (word.toLowerCase() === 'html') return 'HTML';
      if (word.toLowerCase() === 'css') return 'CSS';
      if (word.toLowerCase() === 'js') return 'JS';
      if (word.toLowerCase() === 'ts') return 'TS';
      // Capitalize first letter of regular words
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function getCategoryColor(color: string): { bg: string, text: string, border: string } {
  return {
    bg: `${color}20`,
    text: color,
    border: `${color}40`
  };
}
