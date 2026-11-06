import React from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { Check, ChevronUp, LogOut, Settings, UserRound } from "lucide-react";
import { useDismiss } from "../lib/hooks/use-dismiss";

export default function AccountMenu({ expanded, onSettings }: {
  expanded: boolean;
  onSettings: () => void;
}) {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const [open, setOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);
  const [error, setError] = React.useState("");
  const root = React.useRef<HTMLDivElement>(null);
  const trigger = React.useRef<HTMLButtonElement>(null);
  const panelId = React.useId();
  const close = React.useCallback(() => {
    setOpen(false);
    if (root.current?.contains(document.activeElement)) trigger.current?.focus();
  }, []);
  useDismiss(open, close, root);

  if (!user) return null;

  const name = user.fullName || user.username || "Your account";
  const email = user.primaryEmailAddress?.emailAddress;
  const initials = name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();

  async function handleSignOut() {
    setSigningOut(true);
    setError("");
    try {
      await signOut({ redirectUrl: "/" });
    } catch {
      setError("Couldn't sign out. Please try again.");
      setSigningOut(false);
    }
  }

  return (
    <div ref={root} className="account-control" data-expanded={expanded}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}>
      <button ref={trigger} type="button" className="account-trigger"
        aria-label={`Account: ${name}`} aria-expanded={open} aria-controls={open ? panelId : undefined}
        title={expanded ? undefined : name} onClick={() => setOpen(value => !value)}>
        <span className="account-avatar" aria-hidden="true">{initials}</span>
        {expanded && <>
          <span className="account-identity">
            <span className="account-name">{name}</span>
            <span className="account-email">{email || "Your personal workspace"}</span>
          </span>
          <ChevronUp size={14} className="account-chevron" aria-hidden="true" />
        </>}
      </button>
      {open && (
        <section id={panelId} aria-label="Your Necookie AI account" className="account-panel">
          <div className="account-panel-brand">
            <img src="/favicon.svg" alt="" width="24" height="24" />
            <span>Necookie AI</span>
            <span className="account-status"><Check size={11} aria-hidden="true" /> Signed in</span>
          </div>
          <div className="account-panel-identity">
            <p className="account-name">{name}</p>
            {email && <p className="account-email">{email}</p>}
          </div>
          <div className="account-actions">
            <button type="button" onClick={() => { close(); openUserProfile(); }}>
              <UserRound size={15} aria-hidden="true" /> Manage account
            </button>
            <button type="button" onClick={() => { close(); onSettings(); }}>
              <Settings size={15} aria-hidden="true" /> Preferences
            </button>
          </div>
          <div className="account-signout">
            <button type="button" disabled={signingOut} onClick={handleSignOut}>
              <LogOut size={15} aria-hidden="true" /> {signingOut ? "Signing out…" : "Sign out"}
            </button>
            {error && <p role="alert" className="account-error">{error}</p>}
          </div>
        </section>
      )}
    </div>
  );
}
