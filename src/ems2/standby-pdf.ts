import PDFDocument from 'pdfkit';
import { AGENCY_TZ } from '../common/dates';

/**
 * The four exports, drawn rather than filled.
 *
 * The DOH blanks are 1988 fax scans with no form fields in them, so there is
 * nothing to fill: these redraw the forms field for field so a filed copy
 * reads the same as the paper one. The two internal reports are our own
 * layout and owe the state nothing.
 */

export type Doc = PDFKit.PDFDocument;

const PAGE = { size: 'LETTER' as const, margin: 48 };
const RULE = '#000000';

/**
 * Characters the built-in fonts cannot draw, and what to draw instead.
 *
 * These documents use the standard PDF fonts, which are WinAnsi: a
 * character outside it does not come out as a box, it silently truncates
 * the rest of the line. An arrow in a timeline entry took the whole
 * sentence with it. Anything typed by a crew goes through here too, because
 * a phone keyboard will produce an ellipsis or an emoji sooner or later.
 */
const SUBSTITUTES: Array<[RegExp, string]> = [
  [/[\u2018\u2019\u201b]/g, "'"],
  [/[\u201c\u201d]/g, '"'],
  [/\u2192/g, '->'],
  [/\u2190/g, '<-'],
  [/\u2026/g, '...'],
  [/[\u2022\u25cf]/g, '*'],
  [/\u00a0/g, ' '],
];

export function winAnsi(text: string): string {
  const swapped = SUBSTITUTES.reduce(
    (value, [pattern, with_]) => value.replace(pattern, with_),
    text,
  );
  // Whatever is left that WinAnsi has no room for. Dropped rather than
  // replaced with a box, which reads as damage on a filed form.
  // eslint-disable-next-line no-control-regex
  return swapped.replace(/[^\u0000-\u00ff\u20ac\u2013\u2014\u2020\u2021]/g, '');
}

/**
 * A document with its text sanitised on the way out.
 *
 * Wrapped once here rather than at the fifty-odd places these forms write a
 * string, because the one that gets forgotten is the one a crew types into.
 */
type TextFn = Doc['text'];

function prepare(doc: Doc): Doc {
  const original: TextFn = doc.text.bind(doc) as TextFn;
  const wrapped: TextFn = (text, ...rest) =>
    original(typeof text === 'string' ? winAnsi(text) : text, ...rest);
  doc.text = wrapped;
  return doc;
}

export function newDoc(title: string): Doc {
  return prepare(new PDFDocument({ ...PAGE, info: { Title: title } }));
}

/** Collects a document into a buffer, since these are served over HTTP. */
export function render(doc: Doc): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

/**
 * Times on a filed form are New York times, whatever the server thinks.
 *
 * A form read by a Health Department officer says the hour the event was
 * actually worked, so every date on these is rendered in the agency's zone
 * rather than the box's.
 */
function when(
  value: Date | string | null | undefined,
  shape: 'datetime' | 'date' | 'day' | 'time' = 'datetime',
): string {
  if (!value) return '';
  const d = new Date(value);
  const opts: Intl.DateTimeFormatOptions =
    shape === 'time'
      ? { hour: '2-digit', minute: '2-digit', hour12: false }
      : shape === 'day'
        ? { day: 'numeric', month: 'short' }
        : shape === 'date'
          ? { day: 'numeric', month: 'short', year: 'numeric' }
          : {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            };
  return new Intl.DateTimeFormat('en-GB', {
    ...opts,
    timeZone: AGENCY_TZ,
  }).format(d);
}

/** A labelled rule, the way the paper forms do it: line first, caption under. */
function ruledField(
  doc: Doc,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
) {
  doc
    .fontSize(10)
    .fillColor('#000')
    .text(value || ' ', x, y, { width, ellipsis: true });
  const lineY = y + 14;
  doc
    .moveTo(x, lineY)
    .lineTo(x + width, lineY)
    .strokeColor(RULE)
    .lineWidth(0.7)
    .stroke();
  doc
    .fontSize(7)
    .fillColor('#333')
    .text(label, x, lineY + 2, { width });
  doc.fillColor('#000');
}

function heading(
  doc: Doc,
  left: string,
  badge: string,
  sub?: string,
  rightEdge = 564,
) {
  doc.fontSize(11).font('Helvetica').text(left, PAGE.margin, PAGE.margin);
  if (sub) doc.fontSize(9).text(sub, PAGE.margin, PAGE.margin + 14);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(badge, PAGE.margin, PAGE.margin - 4, {
      align: 'right',
      width: rightEdge - PAGE.margin,
    });
  const y = PAGE.margin + 34;
  doc
    .moveTo(PAGE.margin, y)
    .lineTo(rightEdge, y)
    .lineWidth(3)
    .strokeColor(RULE)
    .stroke();
  doc.font('Helvetica');
  return y + 16;
}

export interface StandbyForForm {
  eventTitle: string;
  eventType: string;
  sponsorOperator: string | null;
  startedAt: Date | null;
  endedAt: Date | null;
  totalAttendance: number | null;
  totalEstimated: boolean;
  peakAttendance: number | null;
  peakEstimated: boolean;
  unusualOccurrences: string | null;
  completedByName: string | null;
  completedByTitle: string | null;
  completedByPhone: string | null;
  inCharge: string | null;
  venue: string | null;
}

export interface CountsForForm {
  minorInjury: number;
  majorInjury: number;
  minorIllness: number;
  majorIllness: number;
  deaths: number;
  totalTreated: number;
  intoxication: number;
  transports: number;
}

/**
 * DOH-2332, the Part 18 Public Function Event Report.
 *
 * Every number on it is derived from the encounter log rather than typed, so
 * a filed form cannot disagree with the records it came from — which is the
 * thing that matters when somebody asks about it a year later.
 */
export function doh2332(standby: StandbyForForm, counts: CountsForForm): Doc {
  const doc = newDoc(`DOH-2332 — ${standby.eventTitle}`);
  let y = heading(
    doc,
    'NEW YORK STATE DEPARTMENT OF HEALTH',
    'Part 18',
    'Emergency Medical Services',
  );
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('Public Function Event Report', PAGE.margin, y - 30, {
      align: 'right',
    });
  doc.font('Helvetica');

  doc
    .fontSize(7.5)
    .text(
      'INSTRUCTIONS: This report is to be completed by the operator of any event permitted under the ' +
        'authority of New York State Sanitary Code, Part-18, and forwarded to the Emergency Medical ' +
        'Services representatives at a Health Department Regional Office no more than five days ' +
        'following the event.',
      PAGE.margin,
      y + 4,
      { width: 516 },
    );
  y += 42;

  doc.moveTo(PAGE.margin, y).lineTo(564, y).lineWidth(1.5).stroke();
  y += 8;

  ruledField(doc, 'Name of Event', standby.eventTitle, PAGE.margin, y, 260);
  ruledField(
    doc,
    'Type of Event',
    standby.eventType,
    PAGE.margin + 276,
    y,
    240,
  );
  y += 36;

  const dates =
    standby.startedAt && standby.endedAt
      ? `${when(standby.startedAt, 'date')} – ${when(standby.endedAt, 'date')}`
      : when(standby.startedAt, 'date');
  const est = (n: number | null, estimated: boolean) =>
    n === null ? '' : `${n}${estimated ? ' (estimated)' : ''}`;
  ruledField(doc, 'Date(s) of Operation', dates, PAGE.margin, y, 160);
  ruledField(
    doc,
    'Total Event Attendance',
    est(standby.totalAttendance, standby.totalEstimated),
    PAGE.margin + 176,
    y,
    170,
  );
  ruledField(
    doc,
    'Actual Peak Attendance',
    est(standby.peakAttendance, standby.peakEstimated),
    PAGE.margin + 362,
    y,
    154,
  );
  y += 40;

  doc.moveTo(PAGE.margin, y).lineTo(564, y).lineWidth(1.5).stroke();
  y += 10;

  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('Medical Incidents', PAGE.margin, y);
  doc.text('No. of Patients Treated', PAGE.margin + 330, y, {
    width: 186,
    align: 'right',
  });
  doc.font('Helvetica');
  y += 18;

  const row = (label: string, value: number, bold = false) => {
    doc.fontSize(9.5).font(bold ? 'Helvetica-Bold' : 'Helvetica');
    doc.text(label, PAGE.margin + 18, y, { width: 320 });
    doc.text(String(value), PAGE.margin + 350, y, {
      width: 120,
      align: 'center',
    });
    doc
      .moveTo(PAGE.margin + 350, y + 12)
      .lineTo(PAGE.margin + 470, y + 12)
      .lineWidth(0.7)
      .stroke();
    y += 19;
    doc.font('Helvetica');
  };

  row('Minor Injury(s)  (cuts, scrapes, etc.)', counts.minorInjury);
  row('Major Injury(s)  (fractures, head injury, etc.)', counts.majorInjury);
  row(
    'Minor Illness(es)  (sick, weak, heat, intoxication, etc.)',
    counts.minorIllness,
  );
  row(
    'Major Illness(es)  (cardiac, allergic reaction, etc.)',
    counts.majorIllness,
  );
  row('Deaths', counts.deaths);
  row('TOTAL PATIENTS TREATED - all causes', counts.totalTreated, true);

  doc
    .fontSize(9)
    .text(
      'Identify from the total number of patients treated during the event the number who showed ' +
        'signs or symptoms of any form of intoxication or substance abuse.',
      PAGE.margin + 18,
      y,
      { width: 320 },
    );
  doc
    .fontSize(9.5)
    .text(String(counts.intoxication), PAGE.margin + 350, y + 8, {
      width: 120,
      align: 'center',
    });
  doc
    .moveTo(PAGE.margin + 350, y + 20)
    .lineTo(PAGE.margin + 470, y + 20)
    .stroke();
  y += 38;

  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('Ambulance Transports', PAGE.margin, y);
  doc.font('Helvetica');
  y += 15;
  row(
    'Total patients transported from the site to local hospitals',
    counts.transports,
  );
  y += 2;

  doc.moveTo(PAGE.margin, y).lineTo(564, y).lineWidth(1.5).stroke();
  y += 10;
  doc
    .fontSize(9.5)
    .font('Helvetica-Bold')
    .text('Unusual Occurrences/Comments', PAGE.margin, y, { continued: true })
    .font('Helvetica')
    .text('  (MCI, extreme weather conditions, etc.)');
  y += 16;
  doc.fontSize(9).text(standby.unusualOccurrences ?? '', PAGE.margin, y, {
    width: 516,
    height: 54,
  });
  y += 46;
  for (let line = 0; line < 2; line++) {
    doc.moveTo(PAGE.margin, y).lineTo(564, y).lineWidth(0.7).stroke();
    y += 15;
  }

  y += 4;
  doc.moveTo(PAGE.margin, y).lineTo(564, y).lineWidth(1.5).stroke();
  y += 8;
  doc.fontSize(9.5).text('Completed by:', PAGE.margin, y);
  y += 14;
  ruledField(
    doc,
    'Print Name',
    standby.completedByName ?? '',
    PAGE.margin,
    y,
    300,
  );
  ruledField(
    doc,
    'Telephone Number',
    standby.completedByPhone ?? '',
    PAGE.margin + 320,
    y,
    196,
  );
  y += 36;
  ruledField(doc, 'Title', standby.completedByTitle ?? '', PAGE.margin, y, 300);
  ruledField(doc, 'Date', when(new Date(), 'date'), PAGE.margin + 320, y, 196);
  y += 36;
  ruledField(doc, 'Signature', '', PAGE.margin, y, 300);

  // Placed after the content rather than at a fixed height, so a long
  // comment cannot push it onto a second page.
  doc.fontSize(7).text('DOH 2332  (6/88)', PAGE.margin, y + 30);
  return doc;
}

export interface IncidentRow {
  sequence: number;
  at: Date;
  initials: string | null;
  prid: string | null;
  runNumber: string | null;
  countyRunNumber: string | null;
  chiefComplaint: string | null;
  category: string;
  treatment: string | null;
  disposition: string;
  transported: boolean;
  comments: string | null;
  /** Set when this was not a patient encounter after all. */
  voidedAs?: 'UNFOUNDED' | 'CREATED_IN_ERROR' | null;
  voidNote?: string | null;
}

const CATEGORY_LABEL: Record<string, string> = {
  MINOR_INJURY: 'Minor injury',
  MAJOR_INJURY: 'Major injury',
  MINOR_ILLNESS: 'Minor illness',
  MAJOR_ILLNESS: 'Major illness',
};

const DISPOSITION_LABEL: Record<string, string> = {
  RMA: 'RMA',
  TRANSPORTED: 'Transported',
  TURNOVER: 'Turnover',
  TREATED_RELEASED: 'Treated & released',
  NO_PATIENT_FOUND: 'No patient found',
  DECEASED: 'Deceased',
};

/** What a voided row says instead of a patient. */
const VOID_LABEL: Record<string, string> = {
  UNFOUNDED: 'Unfounded — no patient found',
  CREATED_IN_ERROR: 'Created in error',
};

export function categoryLabel(key: string): string {
  return CATEGORY_LABEL[key] ?? key;
}

export function dispositionLabel(key: string): string {
  return DISPOSITION_LABEL[key] ?? key;
}

/**
 * DOH-2342, the Part 18 Public Function Medical Incident Log.
 *
 * The "Patient Name & PCR Serial Number" column carries initials and the
 * PRID, which is what this system holds. No name is stored anywhere to put
 * in it, which is the point.
 */
export function doh2342(standby: StandbyForForm, rows: IncidentRow[]): Doc {
  // Landscape: ten columns do not fit across an upright letter page, and the
  // paper form is wide for exactly that reason.
  const doc = prepare(
    new PDFDocument({
      size: 'LETTER',
      layout: 'landscape',
      margin: PAGE.margin,
      info: { Title: `DOH-2342 — ${standby.eventTitle}` },
    }),
  );
  const right = 792 - PAGE.margin;
  // Landscape letter is 612 tall. The heading and the header fields take
  // about 172 of it and the footer wants 20, which leaves room for these.
  const rowHeight = 24;
  const perPage = 14;
  const pages = Math.max(1, Math.ceil(rows.length / perPage));

  // Widths add up to the printable width of a landscape letter page.
  const cols = [
    { key: 'incident', label: 'Incident\nNumber', width: 64 },
    { key: 'date', label: 'Date', width: 50 },
    { key: 'time', label: 'Time', width: 36 },
    { key: 'patient', label: 'Patient Name &\nPCR Serial Number', width: 96 },
    { key: 'complaint', label: 'Chief Complaint', width: 96 },
    { key: 'category', label: 'Injury/\nIllness', width: 56 },
    { key: 'treatment', label: 'Treatment', width: 96 },
    { key: 'disposition', label: 'Disposition', width: 72 },
    { key: 'amb', label: 'Any Amb.\nTransport', width: 48 },
    { key: 'comments', label: 'Comments', width: 82 },
  ];

  for (let page = 0; page < pages; page++) {
    if (page) doc.addPage();
    let y = heading(
      doc,
      'NEW YORK STATE DEPARTMENT OF HEALTH',
      'Part 18',
      'Emergency Medical Services',
      right,
    );
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Public Function Medical Incident Log', PAGE.margin, y - 28, {
        align: 'right',
        width: right - PAGE.margin,
      });
    doc.font('Helvetica');

    ruledField(
      doc,
      'Sponsor/Operator',
      standby.sponsorOperator ?? '',
      PAGE.margin,
      y + 4,
      210,
    );
    ruledField(
      doc,
      'Event Name',
      standby.eventTitle,
      PAGE.margin + 226,
      y + 4,
      240,
    );
    ruledField(
      doc,
      'EMT Supervisor',
      standby.inCharge ?? '',
      PAGE.margin + 482,
      y + 4,
      162,
    );
    doc
      .fontSize(8)
      .text(`Page ${page + 1} of ${pages}`, right - 80, y + 40, { width: 80 });
    y += 56;

    // Header band.
    let x = PAGE.margin;
    doc.fontSize(6.5).font('Helvetica-Bold');
    for (const col of cols) {
      doc.text(col.label, x + 2, y + 2, { width: col.width - 4 });
      x += col.width;
    }
    doc.font('Helvetica');
    const headerBottom = y + 18;
    doc
      .moveTo(PAGE.margin, headerBottom)
      .lineTo(right, headerBottom)
      .lineWidth(1)
      .stroke();
    y = headerBottom;

    const slice = rows.slice(page * perPage, (page + 1) * perPage);
    for (let i = 0; i < perPage; i++) {
      const row = slice[i];
      x = PAGE.margin;
      if (row) {
        const values: Record<string, string> = {
          incident: row.runNumber ?? String(row.sequence),
          date: when(row.at, 'day'),
          time: when(row.at, 'time'),
          // Initials and the PRID: what this system holds, and no more.
          patient: [row.initials, row.prid].filter(Boolean).join(' / '),
          complaint: row.chiefComplaint ?? '',
          category: categoryLabel(row.category),
          treatment: row.treatment ?? '',
          disposition: dispositionLabel(row.disposition),
          amb: row.transported ? 'Yes' : 'No',
          comments: [
            row.comments,
            row.countyRunNumber ? `County ${row.countyRunNumber}` : null,
          ]
            .filter(Boolean)
            .join(' — '),
        };
        doc.fontSize(6.5);
        for (const col of cols) {
          doc.text(values[col.key] ?? '', x + 2, y + 3, {
            width: col.width - 4,
            height: rowHeight - 4,
            ellipsis: true,
          });
          x += col.width;
        }
      }
      const bottom = y + rowHeight;
      doc
        .moveTo(PAGE.margin, bottom)
        .lineTo(right, bottom)
        .lineWidth(0.4)
        .stroke();
      y = bottom;
    }

    // Column rules, drawn after the rows so they run the full height.
    x = PAGE.margin;
    for (const col of cols) {
      doc
        .moveTo(x, headerBottom - 18)
        .lineTo(x, y)
        .lineWidth(0.4)
        .stroke();
      x += col.width;
    }
    doc
      .moveTo(x, headerBottom - 18)
      .lineTo(x, y)
      .stroke();

    doc.fontSize(7).text('DOH - 2342 (7/88)', PAGE.margin, y + 10);
  }
  return doc;
}

// ------------------------------------------------- our own two reports

export interface EventReportData {
  standby: StandbyForForm;
  counts: CountsForForm;
  personnel: Array<{
    name: string;
    role: string;
    units: string[];
    left: boolean;
  }>;
  units: Array<{
    name: string;
    crew: string[];
    location: string | null;
  }>;
  incidents: IncidentRow[];
  timeline: Array<{ at: Date; kind: string; detail: string }>;
  /** Without the nitty gritty: summary only, no per-encounter detail. */
  detailed: boolean;
}

const ROLE_LABEL: Record<string, string> = {
  EES_IC: 'EES in charge',
  EES: 'Event supervisor',
  CREW: 'Crew',
  SUPPORT: 'Support',
};

function sectionTitle(doc: Doc, text: string, y: number): number {
  doc
    .fontSize(11)
    .font('Helvetica-Bold')
    .fillColor('#000')
    .text(text, PAGE.margin, y);
  doc.font('Helvetica');
  const line = y + 15;
  doc
    .moveTo(PAGE.margin, line)
    .lineTo(564, line)
    .lineWidth(0.8)
    .strokeColor('#888')
    .stroke();
  doc.strokeColor(RULE);
  return line + 8;
}

/** Keeps a section from being orphaned at the bottom of a page. */
function room(doc: Doc, y: number, needed: number): number {
  if (y + needed < 720) return y;
  doc.addPage();
  return PAGE.margin;
}

/**
 * The event report.
 *
 * Two shapes from one function: with the detail, and without. The summary is
 * what goes to somebody who wants to know how the event went; the detailed
 * one carries the encounters and the timeline and should be handled like the
 * patient record it effectively is.
 */
export function eventReport(data: EventReportData): Doc {
  const { standby, counts } = data;
  const doc = newDoc(`${standby.eventTitle} — event report`);
  let y = heading(
    doc,
    'RPI Ambulance',
    'Event Report',
    'Event medical standby',
  );

  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text(standby.eventTitle, PAGE.margin, y);
  doc.font('Helvetica').fontSize(9).fillColor('#444');
  doc.text(
    [
      standby.venue,
      standby.eventType,
      standby.startedAt
        ? `${when(standby.startedAt)} – ${when(standby.endedAt) || 'ongoing'}`
        : null,
    ]
      .filter(Boolean)
      .join('  ·  '),
    PAGE.margin,
    y + 18,
  );
  doc.fillColor('#000');
  y += 44;

  y = sectionTitle(doc, 'Attendance and outcome', y);
  const stat = (label: string, value: string, col: number) => {
    const x = PAGE.margin + col * 129;
    doc.fontSize(16).font('Helvetica-Bold').text(value, x, y, { width: 120 });
    doc
      .fontSize(7.5)
      .font('Helvetica')
      .fillColor('#555')
      .text(label, x, y + 20, { width: 120 });
    doc.fillColor('#000');
  };
  const att = (n: number | null, e: boolean) =>
    n === null ? '—' : `${n}${e ? '*' : ''}`;
  stat(
    'Total attendance',
    att(standby.totalAttendance, standby.totalEstimated),
    0,
  );
  stat(
    'Peak attendance',
    att(standby.peakAttendance, standby.peakEstimated),
    1,
  );
  stat('Patients treated', String(counts.totalTreated), 2);
  stat('Transported', String(counts.transports), 3);
  y += 38;
  if (standby.totalEstimated || standby.peakEstimated) {
    doc.fontSize(7).fillColor('#666').text('* estimated', PAGE.margin, y);
    doc.fillColor('#000');
    y += 12;
  }

  const bucket = (label: string, n: number, col: number) => {
    const x = PAGE.margin + col * 129;
    doc
      .fontSize(13)
      .font('Helvetica-Bold')
      .text(String(n), x, y, { width: 120 });
    doc
      .fontSize(7.5)
      .font('Helvetica')
      .fillColor('#555')
      .text(label, x, y + 17, { width: 120 });
    doc.fillColor('#000');
  };
  bucket('Minor injury', counts.minorInjury, 0);
  bucket('Major injury', counts.majorInjury, 1);
  bucket('Minor illness', counts.minorIllness, 2);
  bucket('Major illness', counts.majorIllness, 3);
  y += 34;
  bucket('Deaths', counts.deaths, 0);
  bucket('Intoxication signs', counts.intoxication, 1);
  y += 40;

  y = room(doc, y, 80);
  y = sectionTitle(doc, 'Units', y);
  doc.fontSize(8.5);
  for (const unit of data.units) {
    y = room(doc, y, 16);
    doc.font('Helvetica-Bold').text(unit.name, PAGE.margin, y, { width: 100 });
    doc
      .font('Helvetica')
      .fillColor('#000')
      .text(unit.crew.join(', ') || '—', PAGE.margin + 106, y, { width: 310 });
    doc
      .fillColor('#444')
      .text(unit.location ?? '', PAGE.margin + 420, y, { width: 96 });
    doc.fillColor('#000');
    y += 14;
  }
  y += 10;

  y = room(doc, y, 80);
  y = sectionTitle(doc, 'Personnel', y);
  doc.fontSize(8.5);
  for (const person of data.personnel) {
    y = room(doc, y, 14);
    doc.text(
      person.name + (person.left ? ' (left early)' : ''),
      PAGE.margin,
      y,
      { width: 180 },
    );
    doc
      .fillColor('#444')
      .text(ROLE_LABEL[person.role] ?? person.role, PAGE.margin + 186, y, {
        width: 110,
      });
    doc
      .fillColor('#000')
      .text(person.units.join(', '), PAGE.margin + 300, y, { width: 216 });
    y += 13;
  }
  y += 10;

  if (standby.unusualOccurrences) {
    y = room(doc, y, 60);
    y = sectionTitle(doc, 'Unusual occurrences', y);
    doc
      .fontSize(9)
      .text(standby.unusualOccurrences, PAGE.margin, y, { width: 516 });
    y = doc.y + 12;
  }

  if (data.detailed) {
    y = room(doc, y, 90);
    y = sectionTitle(doc, 'Patient encounters', y);
    doc
      .fontSize(7)
      .fillColor('#666')
      .text(
        'Contains patient care information. Handle accordingly.',
        PAGE.margin,
        y,
      );
    doc.fillColor('#000');
    y += 14;
    doc.fontSize(8.5);
    for (const row of data.incidents) {
      y = room(doc, y, 44);
      doc
        .font('Helvetica-Bold')
        .text(
          `#${row.sequence}  ${row.runNumber ?? 'no run number'}`,
          PAGE.margin,
          y,
        );
      doc
        .font('Helvetica')
        .fillColor('#444')
        .text(when(row.at), PAGE.margin + 380, y, {
          width: 136,
          align: 'right',
        });
      doc.fillColor('#000');
      y += 13;
      doc.text(
        row.voidedAs
          ? [VOID_LABEL[row.voidedAs] ?? 'Voided', row.voidNote]
              .filter(Boolean)
              .join('  ·  ')
          : [
              row.initials ? `Patient ${row.initials}` : null,
              categoryLabel(row.category),
              row.chiefComplaint,
              dispositionLabel(row.disposition),
              row.prid ? `PRID ${row.prid}` : null,
              row.countyRunNumber ? `County ${row.countyRunNumber}` : null,
            ]
              .filter(Boolean)
              .join('  ·  '),
        PAGE.margin,
        y,
        { width: 516 },
      );
      y = doc.y + 4;
      if (row.treatment) {
        doc
          .fillColor('#333')
          .text(row.treatment, PAGE.margin, y, { width: 516 });
        doc.fillColor('#000');
        y = doc.y + 4;
      }
      y += 6;
    }

    y = room(doc, y, 80);
    y = sectionTitle(doc, 'Timeline', y);
    doc.fontSize(8);
    for (const entry of data.timeline) {
      y = room(doc, y, 12);
      doc
        .fillColor('#666')
        .text(when(entry.at, 'time'), PAGE.margin, y, { width: 40 });
      doc
        .fillColor('#000')
        .text(entry.detail, PAGE.margin + 46, y, { width: 470 });
      y += 11;
    }
  }

  return doc;
}

export interface EncounterReportData {
  standby: StandbyForForm;
  row: IncidentRow;
  unit: string | null;
  location: string | null;
  hospital: string | null;
  turnoverAgency: string | null;
  narrative: string | null;
  ageLabel: string | null;
  died: boolean;
  intoxicationSigns: boolean;
  firstAidOnly: boolean;
  openedAt: Date;
  closedAt: Date | null;
  writtenBy: string | null;
}

/** One encounter, in full. */
export function encounterReport(data: EncounterReportData): Doc {
  const { row } = data;
  const doc = newDoc(`Encounter #${row.sequence} — ${data.standby.eventTitle}`);
  let y = heading(
    doc,
    'RPI Ambulance',
    'Patient Encounter',
    data.standby.eventTitle,
  );

  doc
    .fontSize(7)
    .fillColor('#666')
    .text(
      'Contains patient care information. Handle accordingly.',
      PAGE.margin,
      y,
    );
  doc.fillColor('#000');
  y += 16;

  const pair = (label: string, value: string, col: number, rowY: number) => {
    const x = PAGE.margin + col * 172;
    doc.fontSize(7.5).fillColor('#555').text(label, x, rowY, { width: 164 });
    doc
      .fontSize(10)
      .fillColor('#000')
      .text(value || '—', x, rowY + 10, { width: 164 });
  };

  // Said at the top, because everything under it is about a patient this
  // encounter turned out not to have.
  if (row.voidedAs) {
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .text(VOID_LABEL[row.voidedAs] ?? 'Voided', PAGE.margin, y);
    doc.font('Helvetica');
    if (row.voidNote) {
      doc
        .fontSize(9)
        .fillColor('#444')
        .text(row.voidNote, PAGE.margin, y + 14);
      doc.fillColor('#000');
      y += 14;
    }
    y += 22;
  }

  y = sectionTitle(doc, 'Encounter', y);
  pair('Incident number', row.runNumber ?? `#${row.sequence}`, 0, y);
  pair('Opened', when(data.openedAt), 1, y);
  pair('Closed', data.closedAt ? when(data.closedAt) : 'still open', 2, y);
  y += 34;
  pair('Unit', data.unit ?? '—', 0, y);
  pair('Location', data.location ?? '—', 1, y);
  pair('Written up by', data.writtenBy ?? '—', 2, y);
  y += 40;

  y = sectionTitle(doc, 'Patient', y);
  pair('Initials', row.initials ?? '—', 0, y);
  pair('Age', data.ageLabel ?? '—', 1, y);
  pair('PRID', row.prid ?? '—', 2, y);
  y += 34;
  doc
    .fontSize(7.5)
    .fillColor('#666')
    .text(
      'No other identifying information is held by this system.',
      PAGE.margin,
      y,
    );
  doc.fillColor('#000');
  y += 22;

  y = sectionTitle(doc, 'Assessment', y);
  pair('Category', categoryLabel(row.category), 0, y);
  pair('Chief complaint', row.chiefComplaint ?? '—', 1, y);
  pair(
    'Flags',
    [
      data.died ? 'Death' : null,
      data.intoxicationSigns ? 'Intoxication signs' : null,
      data.firstAidOnly ? 'First aid only' : null,
    ]
      .filter(Boolean)
      .join(', ') || '—',
    2,
    y,
  );
  y += 40;

  y = sectionTitle(doc, 'Disposition', y);
  pair('Disposition', dispositionLabel(row.disposition), 0, y);
  pair('Destination', data.hospital ?? data.turnoverAgency ?? '—', 1, y);
  pair('County run number', row.countyRunNumber ?? '—', 2, y);
  y += 40;

  if (row.treatment) {
    y = sectionTitle(doc, 'Treatment', y);
    doc.fontSize(9.5).text(row.treatment, PAGE.margin, y, { width: 516 });
    y = doc.y + 14;
  }
  if (data.narrative) {
    y = room(doc, y, 60);
    y = sectionTitle(doc, 'Narrative', y);
    doc.fontSize(9.5).text(data.narrative, PAGE.margin, y, { width: 516 });
  }

  return doc;
}
