/**
 * Combines a date string (YYYY-MM-DD) and a time string (HH:MM) into a full ISO 8601 string.
 * Uses today's date if only time is provided.
 * @param {string} time - Time in HH:MM format
 * @param {string} [date] - Date in YYYY-MM-DD format (optional)
 * @returns {string|null} ISO string or null
 */
export const formatSupabaseDate = (time, date = null) => {
    if (!time) return null; // Or handle as "ASAP" if logic requires, but usually DB needs timestamp

    const d = date ? new Date(date) : new Date();
    const [hours, minutes] = time.split(':');

    d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return d.toISOString();
};
