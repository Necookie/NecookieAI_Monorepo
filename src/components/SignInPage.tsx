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
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/20 dark:bg-slate-950/60 backdrop-blur-[5px] flex items-center justify-center px-4 select-none"
      style={{ animation: "authFadeIn 0.22s ease-out" }}
    >
      <div
        className="w-full max-w-sm px-8 py-10 rounded-[8px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
        style={{
          boxShadow: "0 8px 30px rgba(15, 23, 42, 0.04)",
        }}
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1
            className="text-[28px] font-semibold tracking-tight text-slate-900 dark:text-slate-100 leading-none"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            Necookie AI
          </h1>
          <p className="mt-3 text-xs text-slate-950 dark:text-slate-400 font-normal leading-relaxed max-w-[280px] mx-auto">
            Clinical-grade intelligence interface for writing, development, and engineering operations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3.5">
          <SignInButton mode="modal">
            <button
              className="flex items-center justify-center w-full h-11 text-xs font-semibold rounded-[6px] tracking-wider uppercase transition-all duration-200 cursor-pointer bg-[#0b1c30] text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500"
            >
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button
              className="flex items-center justify-center w-full h-11 text-xs font-semibold rounded-[6px] tracking-wider uppercase transition-all duration-200 cursor-pointer bg-transparent border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-slate-400 hover:border-teal-600 hover:text-teal-600 dark:hover:border-teal-500 dark:hover:text-teal-500"
            >
              Create Account
            </button>
          </SignUpButton>
        </div>

        {/* Footer info */}
        <div className="mt-9 text-center">
          <span className="text-[10px] tracking-wider font-semibold text-slate-400 dark:text-slate-950 uppercase">
            Secured by Clerk
          </span>
        </div>
      </div>
      <style>{`
        @keyframes authFadeIn {
          from { opacity: 0; transform: scale(0.97) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
