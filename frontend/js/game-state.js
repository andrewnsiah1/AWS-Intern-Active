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
    }

    get() {
        return this.state;
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
