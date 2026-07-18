/**
 * Configuration for the AWS Wizard Game.
 * 
 * UPDATE THIS: Set API_BASE_URL to your deployed API Gateway URL
 * after running `cdk deploy`.
 */
const CONFIG = {
    // Replace with your API Gateway URL after deployment
    // Example: "https://abc123.execute-api.us-east-1.amazonaws.com/prod"
    API_BASE_URL: "http://localhost:8000",

    // Local storage key for persisting game state
    STORAGE_KEY: "aws-wizard-game-state",

    // XP needed per level (for progress bar calculation)
    LEVEL_THRESHOLDS: [0, 100, 300, 600, 1000, 1500],
    LEVEL_NAMES: ["Apprentice", "Journeyman", "Adept", "Mage", "Archmage", "Grand Sorcerer"],
};
