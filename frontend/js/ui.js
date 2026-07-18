/**
 * UI module - handles DOM updates, notifications, and rendering.
 */
class GameUI {
    constructor() {
        this.chatMessages = document.getElementById("chat-messages");
        this.chatInput = document.getElementById("chat-input");
        this.sendBtn = document.getElementById("send-btn");
        this.xpBar = document.getElementById("xp-bar");
        this.xpText = document.getElementById("xp-text");
        this.levelName = document.getElementById("level-name");
        this.activeQuests = document.getElementById("active-quests");
        this.completedQuests = document.getElementById("completed-quests");
        this.achievements = document.getElementById("achievements");
        this.topicsExplored = document.getElementById("topics-explored");
        this.notifications = document.getElementById("notifications");
    }

    /**
     * Add a user message to the chat.
     */
    addUserMessage(text) {
        const messageEl = document.createElement("div");
        messageEl.className = "message user-message";
        messageEl.innerHTML = `
            <div class="message-avatar">🧑‍💻</div>
            <div class="message-content">
                <p><strong>You</strong></p>
                <p>${this.escapeHtml(text)}</p>
            </div>
        `;
        this.chatMessages.appendChild(messageEl);
        this.scrollToBottom();
    }

    /**
     * Add the wizard's response to the chat.
     */
    addWizardMessage(text, sources = []) {
        const messageEl = document.createElement("div");
        messageEl.className = "message wizard-message";

        // Convert markdown-like formatting to HTML
        const formattedText = this.formatMessage(text);

        let sourcesHtml = "";
        if (sources.length > 0) {
            sourcesHtml = `
                <div class="sources-section">
                    <h4>📜 Ancient Scrolls Referenced:</h4>
                    ${sources.map(s => `
                        <a class="source-link" href="${s.url || '#'}" target="_blank" rel="noopener">
                            📄 ${this.escapeHtml(s.title)}
                        </a>
                    `).join("")}
                </div>
            `;
        }

        messageEl.innerHTML = `
            <div class="message-avatar">🧙‍♂️</div>
            <div class="message-content">
                <p><strong>Cloudius the Eternal</strong></p>
                ${formattedText}
                ${sourcesHtml}
            </div>
        `;
        this.chatMessages.appendChild(messageEl);
        this.scrollToBottom();
    }

    /**
     * Show typing indicator while waiting for response.
     */
    showTyping() {
        const typingEl = document.createElement("div");
        typingEl.className = "message wizard-message";
        typingEl.id = "typing-indicator";
        typingEl.innerHTML = `
            <div class="message-avatar">🧙‍♂️</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        this.chatMessages.appendChild(typingEl);
        this.scrollToBottom();
    }

    /**
     * Remove typing indicator.
     */
    hideTyping() {
        const typing = document.getElementById("typing-indicator");
        if (typing) typing.remove();
    }

    /**
     * Update the player stats display.
     */
    updateStats(gameState) {
        const state = gameState.get();
        const progress = gameState.getLevelProgress();

        this.levelName.textContent = state.level_name;
        this.xpBar.style.width = `${progress}%`;
        this.xpText.textContent = `${state.xp} XP`;

        // Update topics
        if (state.topics_explored.length > 0) {
            this.topicsExplored.innerHTML = state.topics_explored
                .map(t => `<span class="topic-tag">${t}</span>`)
                .join("");
        }

        // Update active quests
        if (state.quests_active.length > 0) {
            this.activeQuests.innerHTML = state.quests_active
                .map(q => `
                    <div class="quest-item">
                        <div class="quest-name">${q}</div>
                    </div>
                `).join("");
        } else if (state.quests_completed.length === 0) {
            this.activeQuests.innerHTML = '<p class="empty-state">Begin your journey by asking about AWS services...</p>';
        } else {
            this.activeQuests.innerHTML = '<p class="empty-state">All quests complete! More coming soon...</p>';
        }

        // Update completed quests
        if (state.quests_completed.length > 0) {
            this.completedQuests.innerHTML = state.quests_completed
                .map(q => `
                    <div class="quest-item completed">
                        <div class="quest-name">✅ ${q}</div>
                    </div>
                `).join("");
        }

        // Update achievements
        if (state.achievements.length > 0) {
            this.achievements.innerHTML = state.achievements
                .map(a => `<span class="achievement-item">🏆 ${a}</span>`)
                .join("");
        }
    }

    /**
     * Show XP gain notifications.
     */
    showXPNotifications(xpEvents) {
        xpEvents.forEach((event, i) => {
            setTimeout(() => {
                this.showNotification(`+${event.amount} XP: ${event.reason}`, "xp");
            }, i * 400);
        });
    }

    /**
     * Show achievement notifications.
     */
    showAchievementNotifications(achievements) {
        achievements.forEach((achievement, i) => {
            setTimeout(() => {
                this.showNotification(`🏆 Achievement Unlocked: ${achievement}`, "achievement");
            }, (i + 1) * 600);
        });
    }

    /**
     * Show quest update notifications.
     */
    showQuestNotifications(questUpdates) {
        questUpdates.forEach((update, i) => {
            const prefix = update.progress === "completed" ? "✅ Quest Complete" : "📜 Quest Started";
            setTimeout(() => {
                this.showNotification(`${prefix}: ${update.quest_name}`, "quest");
            }, (i + 1) * 500);
        });
    }

    /**
     * Show a notification popup.
     */
    showNotification(text, type) {
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = text;
        this.notifications.appendChild(notification);

        // Remove after animation completes
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    /**
     * Toggle input enabled/disabled state.
     */
    setInputEnabled(enabled) {
        this.chatInput.disabled = !enabled;
        this.sendBtn.disabled = !enabled;
    }

    /**
     * Format message text with basic markdown support.
     */
    formatMessage(text) {
        return text
            .split("\n\n")
            .map(para => {
                // Bold
                let formatted = para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                // Italic
                formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
                // Inline code
                formatted = formatted.replace(/`(.*?)`/g, "<code>$1</code>");
                // Line breaks within paragraphs
                formatted = formatted.replace(/\n/g, "<br>");
                return `<p>${formatted}</p>`;
            })
            .join("");
    }

    /**
     * Escape HTML to prevent XSS.
     */
    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Scroll chat to bottom.
     */
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}
