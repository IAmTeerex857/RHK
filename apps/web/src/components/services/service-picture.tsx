"use client";

import { servicePictures } from "./service-pictures";

/** The service's picture by slug (a client boundary, so the server page can pass a plain string). */
export function ServicePicture({ slug }: { slug: string }) {
  const Picture = servicePictures[slug];
  return Picture ? <Picture /> : null;
}
