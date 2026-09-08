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
      "script-src 'self' 'unsafe-inline'",
      "  *.googletagmanager.com *.google-analytics.com",
      "  connect.facebook.net *.facebook.com",
      "  *.vercel-scripts.com",
      ";",
      "default-src 'self';",
      "frame-ancestors 'self';",
      // Styles: self + Google Fonts
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com;",
      // Fonts: self + Google Fonts CDN
      "font-src 'self' fonts.gstatic.com data:;",
      // Images: self + data URIs + external CDNs
      "img-src 'self' data: blob: *.facebook.com *.facebook.net",
      "  *.google-analytics.com *.googletagmanager.com",
      "  *.moodilier.ro moodilier.ro",
      "  *.supabase.co",
      ";",
      // XHR/fetch: self + analytics + Supabase
      "connect-src 'self'",
      "  *.google-analytics.com *.analytics.google.com *.googletagmanager.com",
      "  *.facebook.com *.facebook.net",
      "  vitals.vercel-insights.com",
      "  *.supabase.co",
      ";",
      // Video / audio from self + Supabase Storage
      "media-src 'self' blob: *.supabase.co;",
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
  // Hide Next.js "N / Rendering" activity pill — it feels like a stuck loader in dev
  devIndicators: false,

  // Avoid wrong monorepo root (parent lockfile) which breaks preview / HMR
  turbopack: {
    root: process.cwd(),
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "moodilier.ro" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },

  poweredByHeader: false,
  compress: true,

  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    // In Cursor/VS Code Simple Browser the page is iframed — SAMEORIGIN blocks preview.
    const headersForAll = isDev
      ? securityHeaders.filter((h) => h.key !== "X-Frame-Options")
      : securityHeaders;

    return [
      {
        source: "/(.*)",
        headers: headersForAll,
      },
      {
        source: "/videos/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/projects/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/brand/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://moodilier.ro" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PATCH,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
