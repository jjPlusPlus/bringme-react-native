module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  theme: {
    extend: {
      colors: {
        bmOrange: "#fe564f",
        bmBlue: "#2567ee",
        bmPeach: "#ffe8e6",
        bmTeal: "#324A58",
      },
      fontFamily: {
        lucky: "LuckiestGuy-Regular",
      },
    },
  },
  variants: {},
  plugins: [],
};
