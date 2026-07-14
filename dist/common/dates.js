"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGENCY_TZ = void 0;
exports.nyNow = nyNow;
exports.weekdayOf = weekdayOf;
exports.addDays = addDays;
exports.startOfWeek = startOfWeek;
exports.parseHm = parseHm;
exports.toDbDate = toDbDate;
exports.fromDbDate = fromDbDate;
exports.isBeforeDeadline = isBeforeDeadline;
exports.ageInYears = ageInYears;
exports.AGENCY_TZ = 'America/New_York';
function nyNow(now = new Date()) {
    const fmt = new Intl.DateTimeFormat('en-CA', {
        timeZone: exports.AGENCY_TZ,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
    const dateStr = `${parts.year}-${parts.month}-${parts.day}`;
    const hour = Number(parts.hour) % 24;
    return {
        dateStr,
        weekday: weekdayOf(dateStr),
        minutes: hour * 60 + Number(parts.minute),
    };
}
function weekdayOf(dateStr) {
    return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
}
function addDays(dateStr, days) {
    const d = new Date(`${dateStr}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
}
function startOfWeek(dateStr) {
    return addDays(dateStr, -weekdayOf(dateStr));
}
function parseHm(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}
function toDbDate(dateStr) {
    return new Date(`${dateStr}T00:00:00Z`);
}
function fromDbDate(date) {
    return date.toISOString().slice(0, 10);
}
function isBeforeDeadline(now, dateStr, daysBefore, time) {
    const deadlineDate = addDays(dateStr, -daysBefore);
    if (now.dateStr < deadlineDate)
        return true;
    if (now.dateStr > deadlineDate)
        return false;
    return now.minutes <= parseHm(time);
}
function ageInYears(dob, onDate) {
    const birth = fromDbDate(dob);
    const [by, bm, bd] = birth.split('-').map(Number);
    const [y, m, d] = onDate.split('-').map(Number);
    let age = y - by;
    if (m < bm || (m === bm && d < bd))
        age -= 1;
    return age;
}
//# sourceMappingURL=dates.js.map