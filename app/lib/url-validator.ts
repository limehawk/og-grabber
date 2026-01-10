/**
 * URL validation utility to prevent SSRF attacks
 */

// Private IP ranges that should be blocked
const PRIVATE_IP_PATTERNS = [
  /^127\./,                          // Loopback
  /^10\./,                           // Private Class A
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // Private Class B
  /^192\.168\./,                     // Private Class C
  /^169\.254\./,                     // Link-local (including AWS metadata)
  /^0\./,                            // Current network
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./, // Shared address space
  /^198\.18\./,                      // Benchmark testing
  /^::1$/,                           // IPv6 loopback
  /^fc00:/i,                         // IPv6 private
  /^fe80:/i,                         // IPv6 link-local
];

// Hostnames that should be blocked
const BLOCKED_HOSTNAMES = [
  'localhost',
  'localhost.localdomain',
  '0.0.0.0',
  '[::1]',
  'metadata.google.internal',       // GCP metadata
  'metadata',                        // Generic cloud metadata
];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateUrl(urlString: string): ValidationResult {
  // Check if URL is provided
  if (!urlString || typeof urlString !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  // Only allow HTTP and HTTPS protocols
  if (!['http:', 'https:'].includes(url.protocol)) {
    return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
  }

  const hostname = url.hostname.toLowerCase();

  // Check blocked hostnames
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    return { valid: false, error: 'This hostname is not allowed' };
  }

  // Check if hostname is an IP address and validate it
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    // Validate each octet is 0-255
    const octets = ipv4Match.slice(1).map(Number);
    if (octets.some(o => o < 0 || o > 255)) {
      return { valid: false, error: 'Invalid IP address' };
    }
  }

  // Check against private IP patterns
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return { valid: false, error: 'Private IP addresses are not allowed' };
    }
  }

  // Block cloud metadata endpoints by IP
  if (hostname === '169.254.169.254') {
    return { valid: false, error: 'Cloud metadata endpoints are not allowed' };
  }

  return { valid: true };
}

/**
 * Sanitize filename for Content-Disposition header
 * Removes any characters that could be used for header injection
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'og-image';
  }

  // Remove any characters that could be used for header injection
  // Only allow alphanumeric, dash, underscore, and dot
  return filename
    .replace(/[^a-zA-Z0-9\-_.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100) || 'og-image';
}

/**
 * Decode HTML entities more comprehensively
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';

  // Named entities - using Unicode escapes for curly quotes
  const namedEntities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": "\"",
    "&apos;": "'",
    "&nbsp;": " ",
    "&copy;": "\u00A9",
    "&reg;": "\u00AE",
    "&trade;": "\u2122",
    "&mdash;": "\u2014",
    "&ndash;": "\u2013",
    "&hellip;": "\u2026",
    "&lsquo;": "\u2018",
    "&rsquo;": "\u2019",
    "&ldquo;": "\u201C",
    "&rdquo;": "\u201D",
  };

  let result = text;

  // Replace named entities
  for (const [entity, char] of Object.entries(namedEntities)) {
    result = result.replace(new RegExp(entity, 'gi'), char);
  }

  // Replace hex entities (&#x27; &#x2F; etc)
  result = result.replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
    const codePoint = parseInt(hex, 16);
    return codePoint > 0 && codePoint < 0x10FFFF ? String.fromCodePoint(codePoint) : '';
  });

  // Replace decimal entities (&#39; &#47; etc)
  result = result.replace(/&#(\d+);/g, (_, dec) => {
    const codePoint = parseInt(dec, 10);
    return codePoint > 0 && codePoint < 0x10FFFF ? String.fromCodePoint(codePoint) : '';
  });

  return result;
}

/**
 * Constants for fetch limits
 */
export const FETCH_TIMEOUT_MS = 10000; // 10 seconds
export const MAX_HTML_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB
