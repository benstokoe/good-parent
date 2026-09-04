const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // React Native Reusables' semantic tokens — driven by the CSS variables in
        // global.css, which carry our brand palette (not shadcn's defaults). The
        // `<alpha-value>` placeholder (rather than RNR's own plain hsl(var(--x))) is what
        // lets opacity modifiers like bg-primary/90 resolve correctly against these vars.
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        warm: {
          0: "#FFFFFF",
          50: "#FAF9F5",
          100: "#F0EEE6",
          150: "#EAE7DC",
          200: "#E5E4DF",
          300: "#CFCDC4",
          400: "#A8A69C",
          500: "#82807A",
          600: "#5C5A54",
          700: "#40403E",
          800: "#262625",
          900: "#191918",
        },
        clay: {
          50: "#FBF0EB",
          100: "#F5DDD2",
          200: "#E9B79E",
          300: "#DE9877",
          400: "#D97757",
          500: "#C4623F",
          600: "#A34A2C",
          700: "#7D3720",
        },
        kraft: "#D4A27F",
        "kraft-tint": "#F3E4D6",
        manilla: "#EBDBBC",
        "manilla-tint": "#F7EFDF",
        sky: "#6C8FB8",
        "sky-tint": "#E2EAF2",
        moss: "#7A8B5C",
        "moss-tint": "#E9EDE1",
        success: { DEFAULT: "#4E7C59", tint: "#E6EEE7" },
        warning: { DEFAULT: "#B5822B", tint: "#F7EBD5" },
        danger: { DEFAULT: "#B4453A", tint: "#F8E4E1" },
        info: { DEFAULT: "#4E6E9E", tint: "#E4EAF3" },
      },
      fontFamily: {
        display: ["Fraunces_600SemiBold"],
        sans: ["Inter_400Regular"],
        "sans-medium": ["Inter_500Medium"],
        "sans-semibold": ["Inter_600SemiBold"],
      },
      fontSize: {
        "display-xl": "64px",
        "display-lg": "48px",
        "display-md": "38px",
        "title-lg": "30px",
        "title-md": "24px",
        "title-sm": "20px",
        "body-lg": "17px",
        "body-md": "15px",
        "body-sm": "13px",
        caption: "12px",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        pill: "999px",
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
