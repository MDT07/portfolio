import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/works/ecommerce",
        destination: "/works/norde",
        permanent: true,
      },
      {
        source: "/en/works/ecommerce",
        destination: "/en/works/norde",
        permanent: true,
      },
      {
        source: "/works/ai",
        destination: "/ai-works",
        permanent: true,
      },
      {
        source: "/en/works/ai",
        destination: "/en/ai-works",
        permanent: true,
      },
    ];
  },
};

const sentryEnabled = Boolean(
  process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
);

export default sentryEnabled
  ? withSentryConfig(nextConfig, {
      silent: true,
      sourcemaps: { disable: true },
      tunnelRoute: "/sentry-tunnel",
    })
  : nextConfig;
