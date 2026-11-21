import React, { useState, useEffect } from "react";
import PlayerView from "./views/PlayerView";
import AdminView from "./views/AdminView";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-['Itim',sans-serif]">
          <div className="w-16 h-16 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-2xl flex items-center justify-center text-3xl mb-4">
            ⚠️
          </div>
          <h2 className="text-xl font-black text-rose-400 mb-2">เกิดข้อผิดพลาดในการโหลดหน้านี้</h2>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            {this.state.error?.message || "มีข้อผิดพลาดบางอย่างเกิดขึ้น"}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                sessionStorage.removeItem("heaven_admin_auth");
                window.location.href = "/";
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer"
            >
              กลับหน้าหลัก 🏡
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              โหลดใหม่ 🔄
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes("/admin") || hash.includes("admin")) {
        return "/admin";
      }
    }
    return "/";
  });

  // ฟังการกด Back / Forward ของบราวเซอร์
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes("/admin") || hash.includes("admin")) {
        setCurrentRoute("/admin");
      } else {
        setCurrentRoute("/");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (route) => {
    setCurrentRoute(route);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", route);
    }
  };

  return (
    <main className="min-h-screen">
      <ErrorBoundary>
        {currentRoute === "/admin" ? (
          <AdminView onNavigateToPlayer={() => navigateTo("/")} />
        ) : (
          <PlayerView onNavigateToAdmin={() => navigateTo("/admin")} />
        )}
      </ErrorBoundary>
    </main>
  );
}
