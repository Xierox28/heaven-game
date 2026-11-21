import React, { useState, useEffect } from "react";
import PlayerView from "./views/PlayerView";
import AdminView from "./views/AdminView";

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
      {currentRoute === "/admin" ? (
        <AdminView onNavigateToPlayer={() => navigateTo("/")} />
      ) : (
        <PlayerView onNavigateToAdmin={() => navigateTo("/admin")} />
      )}
    </main>
  );
}
