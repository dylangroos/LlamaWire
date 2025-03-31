const HISTORY_KEY = 'llamaWireTpsHistory';
const MAX_HISTORY_LENGTH = 100; // Limit the number of records stored

/**
 * Reads the TPS history from localStorage.
 * @returns {Array<object>} An array of history records, or an empty array if none found or error.
 */
export const getTpsHistory = () => {
    try {
        const historyJson = localStorage.getItem(HISTORY_KEY);
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error("Error reading TPS history from localStorage:", error);
        return []; // Return empty array on error
    }
};

/**
 * Saves a new TPS record to localStorage.
 * @param {object} newRecord - The record object to save (e.g., { query, model, tps, timestamp }).
 */
export const saveTpsRecord = (newRecord) => {
    if (!newRecord || typeof newRecord !== 'object') {
        console.error("Invalid record provided to saveTpsRecord");
        return;
    }
    try {
        const history = getTpsHistory();
        history.push(newRecord); // Add the new record

        // Optional: Limit the history size
        if (history.length > MAX_HISTORY_LENGTH) {
            history.splice(0, history.length - MAX_HISTORY_LENGTH); // Remove oldest entries
        }

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Error saving TPS record to localStorage:", error);
    }
}; 