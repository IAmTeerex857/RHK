import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rush Hour Kids Driver",
    short_name: "RHK Driver",
    description: "Your route, stops and children for today.",
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
