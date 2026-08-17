"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          background: "#0a0a0a",
          color: "#ededed",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          padding: "24px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 600,
              marginBottom: "12px",
              color: "#ededed",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.6,
              color: "#a1a1a1",
              marginBottom: "24px",
            }}
          >
            An unexpected error occurred. The team has been notified.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#0070f3",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Reload page
          </button>
        </div>
      </body>
    </html>
  );
}
