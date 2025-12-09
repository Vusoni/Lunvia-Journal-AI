/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

// Monochrome tints for a primarily black/white UI
const tintColorLight = "#000000";
const tintColorDark = "#ffffff";

export const Colors = {
  light: {
    text: "#111111",
    background: "#ffffff",
    tint: tintColorLight,
    icon: "#333333",
    tabIconDefault: "#4a4a4a",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#f5f5f5",
    background: "#000000",
    tint: tintColorDark,
    icon: "#c0c0c0",
    tabIconDefault: "#888888",
    tabIconSelected: tintColorDark,
  },
};

/**
 * App-wide color palette for consistent theming
 */
export const AppColors = {
  // Primary brand color
  primary: "#000000",
  primaryLight: "#1a1a1a",
  primaryDark: "#050505",

  // Grays
  gray50: "#f8f8f8",
  gray100: "#f0f0f0",
  gray200: "#e0e0e0",
  gray300: "#cfcfcf",
  gray400: "#b0b0b0",
  gray500: "#909090",
  gray600: "#707070",
  gray700: "#505050",
  gray800: "#303030",
  gray900: "#111111",

  // UI colors
  white: "#ffffff",
  black: "#000000",

  // Status colors
  error: "#2e2e2e",
  success: "#3a3a3a",
  warning: "#4a4a4a",
  info: "#5a5a5a",

  // Mood colors (matching mood constants)
  moodVerySad: "#2e2e2e",
  moodSad: "#3a3a3a",
  moodNeutral: "#6b6b6b",
  moodHappy: "#3a3a3a",
  moodVeryHappy: "#2e2e2e",

  // Special colors
  flameOrange: "#444444",
  trophyGold: "#555555",
} as const;

/**
 * Consistent spacing scale for padding, margins, and gaps
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

/**
 * Border radius scale for consistent rounding
 */
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999, // Fully rounded (circles)
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
