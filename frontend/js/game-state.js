/**
 * Game state management - persists to localStorage.
 * All game state lives client-side; the backend is stateless.
 */
class GameState {
    constructor() {
        this.state = this.load();
    }

    getDefault() {
        return {
            xp: 0,
            level: 1,
            level_name: "Apprentice",
            quests_completed: [],
            quests_active: [],
            achievements: [],
            topics_explored: [],
            conversation_count: 0,
        };
    }

    load() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn("Failed to load game state:", e);
        }
        return this.getDefault();
    }

    save() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.state));
        } catch (e) {
            console.warn("Failed to save game state:", e);
        }
    }

    update(newState) {
        this.state = { ...this.state, ...newState };
        this.save();
    }

    reset() {
        this.state = this.getDefault();
        this.save();
        this.clearChatHistory();
    }

    get() {
        return this.state;
    }

    /**
     * Save a chat message to history.
     * Each message: { role: "user"|"wizard", text: string, sources: [] }
     */
    addChatMessage(role, text, sources = []) {
        try {
            const history = this.getChatHistory();
            history.push({ role, text, sources, timestamp: Date.now() });
            // Keep last 50 messages to avoid localStorage bloat
            const trimmed = history.slice(-50);
            localStorage.setItem(CONFIG.STORAGE_KEY + "-chat", JSON.stringify(trimmed));
        } catch (e) {
            console.warn("Failed to save chat history:", e);
        }
    }

    /**
     * Get saved chat history.
     */
    getChatHistory() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY + "-chat");
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn("Failed to load chat history:", e);
        }
        return [];
    }

    /**
     * Clear chat history.
     */
    clearChatHistory() {
        localStorage.removeItem(CONFIG.STORAGE_KEY + "-chat");
    }

    /**
     * Calculate progress toward next level as a percentage.
     */
    getLevelProgress() {
        const currentThreshold = CONFIG.LEVEL_THRESHOLDS[this.state.level - 1] || 0;
        const nextThreshold = CONFIG.LEVEL_THRESHOLDS[this.state.level] || CONFIG.LEVEL_THRESHOLDS[CONFIG.LEVEL_THRESHOLDS.length - 1];

        if (this.state.level >= CONFIG.LEVEL_THRESHOLDS.length) {
            return 100; // Max level
        }

        const progress = this.state.xp - currentThreshold;
        const needed = nextThreshold - currentThreshold;
        return Math.min(100, Math.round((progress / needed) * 100));
    }
}
