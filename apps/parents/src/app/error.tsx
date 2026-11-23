"use client";

import { ErrorScreen } from "@rhk/ui/shell/status-pages";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorScreen app="Parents" reset={reset} digest={error.digest} />;
}
