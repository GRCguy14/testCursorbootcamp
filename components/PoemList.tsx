'use client';

import React from "react";
import { InstaQLEntity } from "@instantdb/react";
import schema from "../instant.schema";

type PoemWithAuthor = InstaQLEntity<
  typeof schema,
  "poems",
  { author: {} },
  undefined,
  true
>;

interface PoemListProps {
  poems: PoemWithAuthor[];
}

export function PoemList({ poems }: PoemListProps) {
  if (!poems.length) {
    return (
      <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
        No poems yet. Be the first to share something beautiful.
      </p>
    );
  }

  return (
    <div className="mt-6 flex w-full max-w-xl flex-col gap-4">
      {poems.map((poem) => (
        <article
          key={poem.id}
          className="rounded-xl border border-zinc-200 bg-white/90 p-4 text-sm shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80"
        >
          <header className="mb-2 flex items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {poem.title}
            </h3>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="font-medium">
                {poem.author?.handle ?? "Unknown poet"}
              </span>{" "}
              ·{" "}
              {new Date(poem.createdAt ?? 0).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </header>
          <p className="whitespace-pre-wrap text-zinc-800 dark:text-zinc-100">
            {poem.body}
          </p>
        </article>
      ))}
    </div>
  );
}

