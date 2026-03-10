'use client';

import React, { useState, useRef, FormEvent } from "react";
import db from "../lib/db";

export function AuthPanel() {
  const [sentEmail, setSentEmail] = useState("");

  return (
    <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
      {!sentEmail ? (
        <EmailStep onSendEmail={setSentEmail} />
      ) : (
        <CodeStep sentEmail={sentEmail} />
      )}
    </div>
  );
}

function EmailStep({ onSendEmail }: { onSendEmail: (email: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputEl = inputRef.current!;
    const email = inputEl.value;
    onSendEmail(email);
    db.auth.sendMagicCode({ email }).catch((err: any) => {
      alert("Uh oh: " + (err.body?.message ?? "Something went wrong"));
      onSendEmail("");
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 text-sm text-zinc-800 dark:text-zinc-100"
    >
      <h2 className="text-base font-semibold">Sign in to share poems</h2>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Enter your email and we&apos;ll send you a one-time login code.
      </p>
      <input
        ref={inputRef}
        type="email"
        required
        autoFocus
        placeholder="you@example.com"
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
      />
      <button
        type="submit"
        className="mt-1 inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Send magic code
      </button>
    </form>
  );
}

function CodeStep({ sentEmail }: { sentEmail: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputEl = inputRef.current!;
    const code = inputEl.value;
    db.auth
      .signInWithMagicCode({ email: sentEmail, code })
      .catch((err: any) => {
        inputEl.value = "";
        alert("Uh oh: " + (err.body?.message ?? "Something went wrong"));
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 text-sm text-zinc-800 dark:text-zinc-100"
    >
      <h2 className="text-base font-semibold">Check your email</h2>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        We sent a code to <span className="font-medium">{sentEmail}</span>.
        Paste it below to finish signing in.
      </p>
      <input
        ref={inputRef}
        type="text"
        required
        autoFocus
        placeholder="123456..."
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm tracking-[0.3em] outline-none ring-0 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
      />
      <button
        type="submit"
        className="mt-1 inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Verify code
      </button>
    </form>
  );
}

