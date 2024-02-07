import colors from "tailwindcss/colors";

const tintColorLight = colors.blue[500];
// const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    // tabIconDefault: colors.zinc[200],
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    // tabIconDefault: colors.zinc[200],
    tabIconSelected: tintColorDark,
  },
};
