/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Mantine provides the CSS reset; disable Tailwind's preflight so the two
  // don't fight. We still use Tailwind utility classes for layout.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        panel: "#f8fafc",
      },
    },
  },
  plugins: [],
};
