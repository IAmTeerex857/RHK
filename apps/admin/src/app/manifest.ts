import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rush Hour Kids Office",
    short_name: "RHK Office",
    description: "Run the day: live vans, families, routes, bills and messages.",
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
