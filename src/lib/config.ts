/**
 * Central app configuration — single source of truth for values that must stay
 * consistent across every page (upload limits, supported formats, accuracy claim).
 *
 * Changing a value here updates it everywhere it is displayed or enforced.
 */

/** Maximum upload size per file, in megabytes. */
export const MAX_FILE_SIZE_MB = 50;

/** Maximum upload size per file, in bytes (used for validation). */
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/** Supported upload formats, in display order. */
export const ALLOWED_FORMATS = ['PDF', 'PNG', 'JPG', 'WEBP'] as const;

/** Human-readable list of supported formats, e.g. "PDF, PNG, JPG, WEBP". */
export const ALLOWED_FORMATS_LABEL = ALLOWED_FORMATS.join(', ');

/** File extensions accepted by the file input's `accept` attribute. */
export const ALLOWED_EXTENSIONS = '.png,.jpg,.jpeg,.pdf,.webp';

/**
 * Single, consistent accuracy claim shown across the site. Defined once so the
 * homepage and "How It Works" can never contradict each other.
 */
export const ACCURACY_CLAIM = '99%';
