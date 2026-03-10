'use client';

import React, { useState, FormEvent } from "react";
import { id, InstaQLEntity } from "@instantdb/react";
import db from "../lib/db";
import schema from "../instant.schema";

type Profile = InstaQLEntity<typeof schema, "profiles">;

interface PoemFormProps {
  authorProfile: Profile | null;
  userId: string | null;
}

export function PoemForm({ authorProfile, userId }: PoemFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!userId) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    if (!userId) return;

    setIsSubmitting(true);
    try {
      // Ensure profile exists; if not, create one and link to user
      const profileId = authorProfile?.id ?? userId;

      if (!authorProfile) {
        await db.transact(
          db.tx.profiles[profileId].update({
            handle: `Poet-${userId.slice(0, 6)}`,
          }).link({ user: userId })
        );
      }

      await db.transact(
        db.tx.poems[id()].update({
          title: title.trim(),
          body: body.trim(),
          createdAt: Date.now(),
        }).link({ author: profileId })
      );

      setTitle("");
      setBody("");
    } catch (err) {
      console.error(err);
      alert("Failed to publish poem. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl space-y-3 rounded-xl border border-zinc-200 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80"
    >
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Share a new poem
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Signed in as{" "}
            <span className="font-medium">
              {authorProfile?.handle ?? "anonymous poet"}
            </span>
          </p>
        </div>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your poem here..."
        rows={5}
        className="w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
      />
      <div className="flex items-center justify-end gap-2">
        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !body.trim()}
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isSubmitting ? "Publishing..." : "Publish poem"}
        </button>
      </div>
    </form>
  );
}

