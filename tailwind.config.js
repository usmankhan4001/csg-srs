/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Mantine provides the CSS reset; disable Tailwind's preflight so the two
  // don't fight. We still use Tailwind utility classes for layout.
  corePlugins: { preflight: false },
  // Tie Tailwind's `dark:` variant to Mantine's own toggle (data attribute)
  // instead of the OS `prefers-color-scheme`, so the two theming systems
  // never disagree.
  darkMode: ["selector", '[data-mantine-color-scheme="dark"]'],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        panel: "#f8fafc",
        // Keep in sync with the "olive" Mantine color (src/main.tsx) and
        // public/icon.svg — this is the app's brand accent everywhere.
        olive: {
          50: "#f6f7ec",
          100: "#e9edd2",
          200: "#d2d9a3",
          300: "#b7c374",
          400: "#9dac52",
          500: "#87953d",
          600: "#6b7a30",
          700: "#556025",
          800: "#40481c",
          900: "#2b3013",
          950: "#1a1e0c",
        },
      },
    },
  },
  plugins: [],
};
