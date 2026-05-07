import React from "react";
import rollbar from "@/lib/rollbar";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("🔥 ErrorBoundary caught:", error);
    console.error("📍 Component stack:", info.componentStack);

    // ✅ Send to Rollbar
    rollbar.error(error, {
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || "";

      let customMessage = null;

      if (msg.includes("Maximum call stack size exceeded")) {
        customMessage = (
          <div style={{ color: "orange", marginBottom: 8 }}>
            <strong>[Error] Module import failed</strong>
            <br />
            RangeError: Maximum call stack size exceeded.
            <br />
            <span style={{ color: "#555", fontSize: 14 }}>
              Likely caused by recursive import or infinite loop.
            </span>
          </div>
        );
      }

      return (
        <div style={{ padding: 20, color: "red" }}>
          <h2>Something went wrong</h2>
          {customMessage}
          <pre>{msg}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;