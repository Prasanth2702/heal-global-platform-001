import Rollbar from "rollbar";

const levels: Rollbar.Level[] = ["warning", "error", "critical", "info"];

// ✅ Build number / commit SHA (Vercel provides this automatically)
const buildNumber =
  import.meta.env.VERCEL_GIT_COMMIT_SHA ||          // Vercel Git commit SHA
  import.meta.env.VERCEL_GITHUB_COMMIT_SHA ||       // GitHub commit SHA
  import.meta.env.VITE_BUILD_NUMBER ||              // Manual env var (optional)
  new Date().toISOString().replace(/[:.]/g, "-");   // Fallback: timestamp

const config: Rollbar.Configuration = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN as string,
  environment: import.meta.env.MODE || "development",

  captureUncaught: true,
  captureUnhandledRejections: true,

  replay: {
    enabled: true,
    triggers: [
      {
        type: "occurrence",
        level: levels,
        samplingRatio: 1.0,
      },
    ],
  },

  scrubFields: [
    "password",
    "token",
    "secret",
    "authorization",
    "cookie",
    "csrf_token",
  ],

  payload: {
    client: {
      javascript: {
        code_version: buildNumber.slice(0, 12), // short version (first 12 chars)
      },
    },
    // optional: include full build number in a custom field
    build: buildNumber,
  },
};

const rollbar = new Rollbar(config);

export default rollbar;