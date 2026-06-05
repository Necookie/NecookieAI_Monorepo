/*
 * Copyright 2026 Dheyn Michael Orlanda
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import { AppProvider, useAppStore } from "../lib/context";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ChatCanvas from "./ChatCanvas";
import SettingsPanel from "./SettingsPanel";
import HelpPanel from "./HelpPanel";

/**
 * Inner shell — separated so it can consume AppProvider context.
 */
function AppShell() {
  const showSettings = useAppStore(s => s.showSettings);
  const showHelp = useAppStore(s => s.showHelp);
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
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

import { ClerkProvider, SignedOut } from "@clerk/clerk-react";
import SignInPage from "./SignInPage";

const publishableKey = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Root application shell mounted as a single React island.
 * All state is managed by AppProvider context — no prop drilling.
 */
export default function App() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <AppProvider>
        <AppShell />
        <SignedOut>
          <SignInPage />
        </SignedOut>
      </AppProvider>
    </ClerkProvider>
  );
}
