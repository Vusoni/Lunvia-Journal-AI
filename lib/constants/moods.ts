// Mood Options for white backgrounds (dark-to-light grayscale)
export const MOOD_OPTIONS = [
  {
    icon: "sentiment-very-dissatisfied",
    label: "Sad",
    value: "Sad",
    color: "#0f0f0f", // darkest
  },
  {
    icon: "sentiment-dissatisfied",
    label: "Overwhelm",
    value: "Overwhelm",
    color: "#1f1f1f",
  },
  {
    icon: "sentiment-neutral",
    label: "Neutral",
    value: "neutral",
    color: "#555555",
  },
  {
    icon: "sentiment-satisfied",
    label: "Good",
    value: "Good",
    color: "#888888",
  },
  {
    icon: "sentiment-very-satisfied",
    label: "Awesome",
    value: "Awesome",
    color: "#bfbfbf", // lightest
  },
] as const;

// For black backgrounds, use lighter grays (uncomment and swap MOOD_OPTIONS if needed)
// export const MOOD_OPTIONS = [
//   { icon: "sentiment-very-dissatisfied", label: "Sad", value: "Sad", color: "#e0e0e0" },
//   { icon: "sentiment-dissatisfied", label: "Overwhelm", value: "Overwhelm", color: "#cfcfcf" },
//   { icon: "sentiment-neutral", label: "Neutral", value: "neutral", color: "#a8a8a8" },
//   { icon: "sentiment-satisfied", label: "Good", value: "Good", color: "#8a8a8a" },
//   { icon: "sentiment-very-satisfied", label: "Awesome", value: "Awesome", color: "#6f6f6f" },
// ] as const;

// Create a lookup map for quick mood config access by value
export const MOOD_CONFIG = MOOD_OPTIONS.reduce(
  (acc, mood) => {
    acc[mood.value] = mood;
    return acc;
  },
  {} as Record<string, (typeof MOOD_OPTIONS)[number]>
);

export const getMoodConfig = (moodValue: string) => {
  return MOOD_CONFIG[moodValue] || MOOD_CONFIG.neutral;
};
