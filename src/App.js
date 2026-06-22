import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { ADMIN_USER } from "./data/features";
import "./App.css";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

  function handleLogin(userId) {
    if (userId.trim().toUpperCase() === ADMIN_USER.id) {
      setAuthenticated(true);
    } else {
      return false;
    }
    return true;
  }

  function handleLogout() {
    setAuthenticated(false);
  }

  return (
    <div className="app-root">
      {authenticated ? (
        <Dashboard admin={ADMIN_USER} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}
