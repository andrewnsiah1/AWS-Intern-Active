/**
 * Chat module - handles communication with the backend API.
 */
class ChatService {
    constructor(gameState) {
        this.gameState = gameState;
        this.isLoading = false;
    }

    /**
     * Send a message to the wizard backend.
     * Returns the full response including game state updates.
     */
    async sendMessage(message) {
        if (this.isLoading) return null;
        this.isLoading = true;

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: message,
                    player_state: this.gameState.get(),
                }),
            });

            if (!response.ok) {
                if (response.status === 429) {
                    const errorData = await response.json();
                    return {
                        message: "🧙‍♂️ *The wizard raises a weary hand...* \"Patience, young one. Even ancient magic needs a moment to recharge. Take a breath and ask again shortly.\"",
                        sources: [],
                        player_state: this.gameState.get(),
                        xp_events: [],
                        quest_updates: [],
                        new_achievements: [],
                    };
                }
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            // Update local game state with server response
            if (data.player_state) {
                this.gameState.update(data.player_state);
            }

            return data;
        } catch (error) {
            console.error("Chat API error:", error);

            // Return a fallback response so the game still works
            // (useful for demo/offline mode)
            return this.getFallbackResponse(message);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Fallback response when the API is unavailable.
     * This lets the frontend work as a demo even without the backend.
     */
    getFallbackResponse(message) {
        const state = this.gameState.get();
        state.conversation_count += 1;
        state.xp += 10;

        // Simple level check
        for (let i = CONFIG.LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
            if (state.xp >= CONFIG.LEVEL_THRESHOLDS[i]) {
                state.level = i + 1;
                state.level_name = CONFIG.LEVEL_NAMES[i];
                break;
            }
        }

        this.gameState.update(state);

        return {
            message: `Ah, young ${state.level_name}... The mystical conduits to the Cloud Realm are currently sealed ` +
                `(the backend API is not connected). To unleash my full wisdom, ensure the API is deployed ` +
                `and the \`API_BASE_URL\` in \`js/config.js\` points to your API Gateway endpoint.\n\n` +
                `In the meantime, I sense you wish to know about: "${message}". ` +
                `Once the connection is restored, I shall draw upon the ancient AWS scrolls to answer fully!`,
            sources: [],
            player_state: state,
            xp_events: [{ reason: "Asked a question", amount: 10 }],
            quest_updates: [],
            new_achievements: state.conversation_count === 1 ? ["First Words"] : [],
        };
    }
}
