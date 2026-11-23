"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** The current query string, read on the client only (empty on the server, so no Suspense is needed). */
export function useQuery() {
  const search = useSyncExternalStore(
    noop,
    () => window.location.search,
    () => "",
  );
  return new URLSearchParams(search);
}
