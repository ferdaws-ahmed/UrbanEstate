// Centralized Theme Configuration
// Edit this file to change colors across the entire app!

export const themeColors = {
  light: {
    background: "#ffffff",
    card: "#ffffff",
    cardHover: "#f1f5f9",
    primary: "#099880",
    secondary: "#cddfa0",
    accent: "#cddfa0",
    textMain: "#0f172a",
    textMuted: "#64748b",
    border: "#e2e8f0",
  },
  dark: {
    background: "#0f172a", // Dark slate background - professional and easy on eyes
    card: "#1e293b", // Darker slate for cards
    cardHover: "#334155", // Lighter slate for card hover
    primary: "#099880", // Keep teal as primary accent
    secondary: "#cddfa0",
    accent: "#cddfa0",
    textMain: "#f8fafc",
    textMuted: "#94a3b8", // Softer muted text
    border: "rgba(255, 255, 255, 0.1)", // Subtle border
  },
};

// Helper to get color from config
export const getColor = (theme, key) => {
  return themeColors[theme][key] || themeColors.light[key];
};
