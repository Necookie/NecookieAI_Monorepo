import React from "react";
import { AppProvider, useApp } from "../lib/context";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ChatCanvas from "./ChatCanvas";
import SettingsPanel from "./SettingsPanel";
import HelpPanel from "./HelpPanel";

/**
 * Inner shell — separated so it can consume AppProvider context.
 */
function AppShell() {
  const { showSettings, showHelp } = useApp();
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <ChatCanvas />
      </div>
      {showSettings && <SettingsPanel />}
      {showHelp && <HelpPanel />}
    </div>
  );
}

/**
 * Root application shell mounted as a single React island.
 * All state is managed by AppProvider context — no prop drilling.
 */
export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
