/**
 * Main entry point - wires everything together.
 */
(function () {
    "use strict";

    // Initialize modules
    const gameState = new GameState();
    const chatService = new ChatService(gameState);
    const ui = new GameUI();

    // Initial UI update
    ui.updateStats(gameState);

    // Handle form submission
    const chatForm = document.getElementById("chat-form");
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const message = ui.chatInput.value.trim();
        if (!message) return;

        // Show user message
        ui.addUserMessage(message);
        ui.chatInput.value = "";
        ui.setInputEnabled(false);
        ui.showTyping();

        // Send to backend
        const response = await chatService.sendMessage(message);

        // Hide typing and show response
        ui.hideTyping();

        if (response) {
            // Show wizard message
            ui.addWizardMessage(response.message, response.sources);

            // Show notifications
            if (response.xp_events && response.xp_events.length > 0) {
                ui.showXPNotifications(response.xp_events);
            }
            if (response.new_achievements && response.new_achievements.length > 0) {
                ui.showAchievementNotifications(response.new_achievements);
            }
            if (response.quest_updates && response.quest_updates.length > 0) {
                ui.showQuestNotifications(response.quest_updates);
            }

            // Update stats display
            ui.updateStats(gameState);
        }

        ui.setInputEnabled(true);
        ui.chatInput.focus();
    });

    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("sidebar");
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }

    // Focus input on load
    ui.chatInput.focus();

    // Keyboard shortcut: Escape to clear input
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            ui.chatInput.value = "";
            ui.chatInput.focus();
        }
    });
})();
