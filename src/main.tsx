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

// A restrained slate + muted-teal pairing instead of the stock indigo/violet
// "AI product" palette — cooler, lower-saturation, meant to read as an
// editorial documentation tool rather than a chatbot skin.
const theme = createTheme({
  primaryColor: "slate",
  colors: {
    slate: [
      "#f4f6f8",
      "#e6eaee",
      "#ccd3db",
      "#aab6c3",
      "#8695a8",
      "#66768c",
      "#4f5e74",
      "#3d4a5c",
      "#2d3745",
      "#1c232d",
    ],
    teal: [
      "#eef6f5",
      "#d3e9e6",
      "#a8d3cc",
      "#79bcb1",
      "#54a89a",
      "#3c9384",
      "#2f7e70", // accent shade (links, active chips)
      "#25655a",
      "#1c4d45",
      "#123531",
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
