import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./index.css";

// Register the service worker (no-op in dev; active in the production build).
registerSW({ immediate: true });

const FONT =
  'Outfit, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// A muted olive-green brand color instead of the stock indigo/violet "AI
// product" palette — earthy, lower-saturation, meant to read as an editorial
// documentation tool rather than a chatbot skin. Keep this in sync with the
// "olive" Tailwind color (tailwind.config.js) and public/icon.svg.
const theme = createTheme({
  primaryColor: "olive",
  colors: {
    olive: [
      "#f6f7ec",
      "#e9edd2",
      "#d2d9a3",
      "#b7c374",
      "#9dac52",
      "#87953d",
      "#6b7a30", // primary interactive shade (light mode)
      "#556025",
      "#40481c",
      "#2b3013",
    ],
  },
  primaryShade: { light: 6, dark: 4 },
  fontFamily: FONT,
  defaultRadius: "md",
  headings: { fontWeight: "700", fontFamily: FONT },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="bottom-center" />
      <App />
    </MantineProvider>
  </React.StrictMode>
);
