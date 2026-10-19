/**
 * The largest file that may be attached to a certification.
 *
 * A scanned card from a phone is a few megabytes; a multi-page PDF from a
 * training provider can be a good deal more. The web app's server-action
 * body limit must be at least this, or uploads are refused before they ever
 * reach here — by Next.js, with a message that does not mention a size.
 */
export const MAX_UPLOAD_MB = 50;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;
