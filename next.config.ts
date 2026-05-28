import type { NextConfig } from "next";

// ── Security Headers ──────────────────────────────────────────────────────────
// Applied to all routes. CSP allows Google Analytics, Google Fonts, Facebook Pixel.
const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only allow same-origin framing (protects against clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Enable XSS filter in older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Control referrer info sent with requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Enforce HTTPS for 1 year (HSTS)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Restrict browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  // Content Security Policy — allows all required external services
  {
    key: "Content-Security-Policy",
    value: [
      // Only load scripts from trusted sources
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "  *.googletagmanager.com *.google-analytics.com",
      "  connect.facebook.net *.facebook.com",
      "  *.vercel-scripts.com",
      ";",
      // Styles: self + Google Fonts
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com;",
      // Fonts: self + Google Fonts CDN
      "font-src 'self' fonts.gstatic.com data:;",
      // Images: self + data URIs + external CDNs
      "img-src 'self' data: blob: *.facebook.com *.facebook.net",
      "  *.google-analytics.com *.googletagmanager.com",
      "  *.moodilier.ro moodilier.ro",
      ";",
      // XHR/fetch: self + analytics endpoints
      "connect-src 'self'",
      "  *.google-analytics.com *.analytics.google.com *.googletagmanager.com",
      "  *.facebook.com *.facebook.net",
      "  vitals.vercel-insights.com",
      ";",
      // Allow iframes only from Google Maps
      "frame-src 'self' *.google.com;",
      // Only load objects from self
      "object-src 'none';",
      // Only allow same-origin base URLs
      "base-uri 'self';",
      // Form submissions: self only
      "form-action 'self';",
    ]
      .join(" ")
      .replace(/\s+/g, " ")
      .trim(),
  },
];

const nextConfig: NextConfig = {
  images: {
    // Optimization enabled: Vercel auto-converts to WebP/AVIF
    // Reduces image sizes by 25-50% automatically
    remotePatterns: [
      { protocol: "https", hostname: "moodilier.ro" },
      { protocol: "http",  hostname: "localhost" },
    ],
  },

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Allow admin API routes to be called cross-origin from Vercel dashboard
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://moodilier.ro" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PATCH,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
