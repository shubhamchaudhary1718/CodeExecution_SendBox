import { HistoryItem } from "@/types/Editor";

// Local storage key
const HISTORY_STORAGE_KEY = "code-editor-history";

/**
 * Save a history item to local storage
 */
export async function saveHistoryItem(item: HistoryItem): Promise<void> {
  try {
    const history = getHistoryItems();
    const updatedHistory = [item, ...history];
    
    // Keep only the last 50 items to avoid storage issues
    const trimmedHistory = updatedHistory.slice(0, 50);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory));
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error saving history item:", error);
    return Promise.reject(error);
  }
}

/**
 * Get all history items from local storage
 */
export function getHistoryItems(): HistoryItem[] {
  try {
    const historyJSON = localStorage.getItem(HISTORY_STORAGE_KEY);
    return historyJSON ? JSON.parse(historyJSON) : [];
  } catch (error) {
    console.error("Error getting history items:", error);
    return [];
  }
}

/**
 * Clear all history items from local storage
 */
export async function clearHistoryItems(): Promise<void> {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return Promise.resolve();
  } catch (error) {
    console.error("Error clearing history items:", error);
    return Promise.reject(error);
  }
}
