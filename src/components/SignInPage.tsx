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
      className="fixed inset-0 z-50 flex items-center justify-center px-4 select-none"
      style={{
        background: "rgba(250,249,245,0.85)",
        backdropFilter: "blur(6px)",
        animation: "authFadeIn 0.22s ease-out",
      }}
    >
      <div
        className="w-full max-w-sm px-8 py-10"
        style={{
          background: "var(--color-canvas)",
          border: "1px solid var(--color-hairline)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 8px 32px rgba(20,20,19,0.08)",
        }}
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          {/* Spike mark */}
          <div className="flex justify-center mb-4">
            <div
              className="flex items-center justify-center w-10 h-10"
              style={{
                background: "var(--color-primary)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L9 16M2 9L16 9M3.7 3.7L14.3 14.3M14.3 3.7L3.7 14.3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 400,
              letterSpacing: "-0.3px",
              lineHeight: 1.2,
              color: "var(--color-ink)",
            }}
          >
            Necookie AI
          </h1>
          <p
            className="mt-3 leading-relaxed max-w-[260px] mx-auto"
            style={{
              fontSize: "14px",
              color: "var(--color-muted)",
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
            }}
          >
            Your intelligent thinking partner for writing, development, and engineering.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <SignInButton mode="modal">
            <button
              className="flex items-center justify-center w-full h-11 transition-all duration-200 cursor-pointer"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-on-primary)",
                borderRadius: "var(--radius-md)",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "var(--font-sans)",
                border: "none",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-primary-active)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--color-primary)"}
            >
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button
              className="flex items-center justify-center w-full h-11 transition-all duration-200 cursor-pointer"
              style={{
                background: "var(--color-canvas)",
                color: "var(--color-ink)",
                borderRadius: "var(--radius-md)",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "var(--font-sans)",
                border: "1px solid var(--color-hairline)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-primary)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-hairline)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-ink)";
              }}
            >
              Create Account
            </button>
          </SignUpButton>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "1px",
              fontWeight: 500,
              color: "var(--color-muted-soft)",
              fontFamily: "var(--font-sans)",
              textTransform: "uppercase",
            }}
          >
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
