// AWC's JSON schemas for CWA/MIS/TCF aren't fully confirmed against a live
// response, so pick whichever plausible "raw text" field is present rather
// than hard-coding one name that might be wrong.
const RAW_TEXT_KEYS = ['rawText', 'raw', 'text', 'rawCWA', 'rawMIS', 'rawTCF', 'discussion'];

export const pickRawText = (item: Record<string, unknown>): string => {
    for (const key of RAW_TEXT_KEYS) {
        const value = item[key];
        if (typeof value === 'string' && value.trim()) {
            return value;
        }
    }
    return JSON.stringify(item, null, 2);
};

// Reference-data schemas (airport/navaid/fix) aren't confirmed against a
// live response either, so render every field generically instead of
// hard-coding field names that might not match.
export const formatFieldValue = (value: unknown): string => {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
};

export const fieldEntries = (item: Record<string, unknown>): [string, unknown][] =>
    Object.entries(item).filter(([, value]) => value !== null && value !== undefined && value !== '');
