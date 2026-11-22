import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rush Hour Kids",
    short_name: "Rush Hour Kids",
    description: "Live rides, schedules, bills and messages for your family.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f3f1",
    theme_color: "#f3f3f1",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
