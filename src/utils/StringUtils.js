/**
 * Normalizes a string by removing diacritics, converting to lowercase, and trimming
 * @param {string} str - The string to normalize
 * @returns {string} - The normalized string
 */
export function normalizeStr(str) {
    return String(str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

/**
 * Checks if two strings match when normalized
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {boolean} - True if strings match when normalized
 */
export function normalizedEquals(str1, str2) {
    return normalizeStr(str1) === normalizeStr(str2);
}

/**
 * Checks if the first string contains the second when both are normalized
 * @param {string} haystack - String to search in
 * @param {string} needle - String to search for
 * @returns {boolean} - True if haystack contains needle when normalized
 */
export function normalizedIncludes(haystack, needle) {
    return normalizeStr(haystack).includes(normalizeStr(needle));
}

/**
 * Fuzzy matching for game object names
 * @param {string} userInput - What the user typed
 * @param {string} objectName - The actual object name
 * @returns {boolean} - True if they match closely enough
 */
export function fuzzyMatch(userInput, objectName) {
    const input = normalizeStr(userInput);
    const name = normalizeStr(objectName);
    return name.includes(input) || input.includes(name);
}
