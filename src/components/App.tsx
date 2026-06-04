import React from "react";
import { AppProvider } from "../lib/context";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ChatCanvas from "./ChatCanvas";

/**
 * Root application shell mounted as a single React island.
 * All state is managed by AppProvider context — no prop drilling.
 */
export default function App() {
  return (
    <AppProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <ChatCanvas />
        </div>
      </div>
    </AppProvider>
  );
}
