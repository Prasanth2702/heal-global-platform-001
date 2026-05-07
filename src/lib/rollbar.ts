import Rollbar from "rollbar";

// ✅ define levels here (top of file)
const levels: Rollbar.Level[] = ["warning", "error", "critical", "info"];

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
        level: levels, // ✅ use it here
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
        code_version: "1.0.0",
      },
    },
  },
};

const rollbar = new Rollbar(config);

export default rollbar;