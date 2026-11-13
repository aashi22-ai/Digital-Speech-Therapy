import { Component } from "react";

// Catches unexpected render-time JS errors anywhere in the app so the
// user sees a friendly recovery screen instead of a blank white page.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="text-center space-y-3">
            <h1 className="text-lg font-semibold text-slate-800">
              Something went wrong
            </h1>
            <p className="text-sm text-slate-500">
              Please refresh the page. If the problem continues, try logging in again.
            </p>
            <button
              onClick={() => window.location.assign("/dashboard")}
              className="text-sm text-slate-800 underline"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
