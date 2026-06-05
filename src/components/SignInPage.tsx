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
import { SignInButton } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 font-sans select-none"
      style={{ background: "#f8f9ff" }}
    >
      <div
        className="w-full max-w-sm px-8 py-10 rounded-[8px] bg-white border border-slate-200"
        style={{
          boxShadow: "none",
        }}
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1
            className="text-[26px] font-semibold tracking-tight text-slate-900"
            style={{ fontFamily: "Geist, sans-serif" }}
          >
            Necookie AI
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-normal leading-relaxed">
            Your intelligence assistant for research, development, and creative engineering.
          </p>
        </div>

        {/* Action Button wrapper */}
        <div className="space-y-3">
          <SignInButton mode="modal">
            <button
              className="flex items-center justify-center w-full h-11 text-sm font-medium rounded-[6px] transition-all cursor-pointer"
              style={{
                background: "#0b1c30",
                color: "#ffffff",
                border: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#0d9488";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0b1c30";
              }}
            >
              Sign In to Workspace
            </button>
          </SignInButton>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <span
            className="text-[10px] uppercase tracking-wider font-medium text-slate-400"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            Secured by Clerk
          </span>
        </div>
      </div>
    </div>
  );
}
