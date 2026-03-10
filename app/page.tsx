'use client';

import db from "../lib/db";
import schema from "../instant.schema";
import { AuthPanel } from "../components/AuthPanel";
import { PoemForm } from "../components/PoemForm";
import { PoemList } from "../components/PoemList";
import type { InstaQLEntity } from "@instantdb/react";

type PoemWithAuthor = InstaQLEntity<
  typeof schema,
  "poems",
  { author: {} },
  undefined,
  true
>;

type Profile = InstaQLEntity<typeof schema, "profiles">;

export default function Home() {
  const { isLoading, error, data } = db.useQuery({
    poems: {
      $: {
        order: {
          createdAt: "desc",
        },
      },
      author: {},
    },
  });

  const auth = db.useAuth();
  const userId = auth.user?.id ?? null;

  const poems = (data?.poems ?? []) as PoemWithAuthor[];

  // We don't yet have a direct query for the current profile; leave it null for now.
  const currentProfile: Profile | null = null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-50 px-4 py-10 font-sans text-zinc-900 dark:from-black dark:via-zinc-900 dark:to-black dark:text-zinc-50">
      <main className="mx-auto flex max-w-4xl flex-col items-center">
        <header className="mb-8 flex w-full flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Instant Poems
          </h1>
          <p className="max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            A tiny poetry corner where anyone can log in with a magic code and
            share short poems. All poems are public and update in real time.
          </p>
        </header>

        <section className="mb-8 flex w-full flex-col gap-4 md:flex-row md:items-start">
          <div className="md:w-1/2">
            <AuthPanel />
          </div>
          <div className="md:w-1/2 md:pl-4">
            {auth.user ? (
              <PoemForm authorProfile={currentProfile} userId={userId} />
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Log in with a magic code to publish your own poem.
              </p>
            )}
          </div>
        </section>

        <section className="w-full">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            All poems
          </h2>
          {isLoading && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Loading poems...
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500">
              Error loading poems: {error.message}
            </p>
          )}
          {!isLoading && !error && <PoemList poems={poems} />}
        </section>
      </main>
    </div>
  );
}

