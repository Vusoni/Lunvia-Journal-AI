import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui, createTokens } from "tamagui";

// Create custom black & white color tokens
const customTokens = createTokens({
  color: {
    gray1: "#ffffff",
    gray2: "#ffffff",
    gray3: "#ffffff",
    gray4: "#ffffff",
    gray5: "#000000",
    gray6: "#000000",
    gray7: "#000000",
    gray8: "#000000",
    gray9: "#000000",
    gray10: "#000000",
    gray11: "#000000",
    gray12: "#000000",
  },
  radius: defaultConfig.tokens.radius,
  zIndex: defaultConfig.tokens.zIndex,
  space: defaultConfig.tokens.space,
  size: defaultConfig.tokens.size,
});

// Get a base theme to copy structure from
const baseTheme = defaultConfig.themes.light_blue;

const config = {
  ...defaultConfig,
  tokens: customTokens,
  themes: {
    ...defaultConfig.themes,
    // Same structure, only colors replaced
    purple: {
      ...baseTheme,
      background: "#ffffff",
      backgroundHover: "#000000",
      backgroundPress: "#000000",
      backgroundFocus: "#ffffff",

      color: "#000000",
      colorHover: "#ffffff",
      colorPress: "#ffffff",
      colorFocus: "#000000",

      borderColor: "#000000",
      borderColorHover: "#000000",
      borderColorPress: "#ffffff",
      borderColorFocus: "#000000",
    },
  },
};

export const tamaguiConfig = createTamagui(config);

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}