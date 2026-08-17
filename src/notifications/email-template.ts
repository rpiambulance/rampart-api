/**
 * Branded HTML wrapper for outgoing mail.
 *
 * Written as tables with inline styles on purpose: email clients strip
 * stylesheets, ignore most modern layout, and Outlook renders through Word.
 * Web fonts are unavailable, so the brand faces degrade to the closest common
 * ones rather than being loaded.
 */
const RED = '#e21f26';
const BLACK = '#221f1f';
const INK = '#2b2b2b';
const MUTED = '#6b6c70';
const RULE = '#e3e3e5';
const PAGE = '#f4f4f5';

const HEADING_FONT =
  "'Poppins', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const BODY_FONT =
  "'IBM Plex Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Turns the plain-text bodies the app already writes into HTML: blank lines
 * become paragraphs, single breaks are kept, bullet lines are indented, and
 * bare URLs become links. Callers keep writing plain text and get both parts.
 */
function bodyToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((block) => {
      const html = escapeHtml(block.trim())
        .replace(
          /(https?:\/\/[^\s<]+)/g,
          `<a href="$1" style="color:${RED};text-decoration:underline;">$1</a>`,
        )
        .replace(/\n/g, '<br />');
      const indented = block.trimStart().startsWith('•');
      return `<p style="margin:0 0 16px;${
        indented ? 'padding-left:12px;' : ''
      }font-family:${BODY_FONT};font-size:15px;line-height:1.55;color:${INK};">${html}</p>`;
    })
    .join('');
}

export interface EmailContent {
  subject: string;
  /** Plain text; also the source for the HTML body. */
  text: string;
}

/** Full HTML document for an outgoing message. */
export function renderEmail({ subject, text }: EmailContent): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:${PAGE};">
    <!-- Preheader: the snippet a client shows beside the subject. -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(
      text.replace(/\s+/g, ' ').slice(0, 120),
    )}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${RULE};border-radius:10px;overflow:hidden;">
            <tr>
              <td style="height:4px;background:${RED};font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:20px 28px 0;">
                <p style="margin:0;font-family:${HEADING_FONT};font-size:17px;font-weight:600;letter-spacing:-0.01em;color:${BLACK};">
                  RPI Ambulance
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 4px;">
                <h1 style="margin:0 0 16px;font-family:${HEADING_FONT};font-size:20px;font-weight:600;line-height:1.3;color:${BLACK};">
                  ${escapeHtml(subject)}
                </h1>
                ${bodyToHtml(text)}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 24px;">
                <hr style="border:none;border-top:1px solid ${RULE};margin:0 0 12px;" />
                <p style="margin:0;font-family:${BODY_FONT};font-size:12px;line-height:1.5;color:${MUTED};">
                  Sent by RPI Ambulance. Please don't reply to this message —
                  use the links above, or contact an officer.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
