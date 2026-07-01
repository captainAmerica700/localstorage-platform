"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

const commands = {
  pnpm: "pnpm add localstorage-platform",
  npm: "npm install localstorage-platform",
  yarn: "yarn add localstorage-platform",
} as const;

type PackageManager = keyof typeof commands;

export function InstallCommand() {
  const [manager, setManager] = useState<PackageManager>("pnpm");
  const [copied, setCopied] = useState(false);
  const command = commands[manager];

  async function copy() {
    await navigator.clipboard.writeText(command);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-10 w-full max-w-2xl overflow-hidden rounded-lg border border-neutral-200 bg-white text-left shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-2 dark:border-neutral-800 dark:bg-neutral-900">
        <div
          className="inline-flex rounded-md border border-neutral-200 bg-white p-0.5 dark:border-neutral-800 dark:bg-neutral-950"
          aria-label="Package manager"
        >
          {(Object.keys(commands) as PackageManager[]).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={manager === item}
              onClick={() => {
                setManager(item);
                setCopied(false);
              }}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50",
                manager === item &&
                  "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-neutral-50",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          Install package
        </span>
      </div>

      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="font-mono font-semibold text-green-600 dark:text-green-400">
            $
          </span>

          <code className="truncate font-mono text-sm text-neutral-900 dark:text-neutral-100">
            {command}
          </code>
        </div>

        <button
          type="button"
          onClick={copy}
          aria-label="Copy install command"
          className="ml-4 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-neutral-500 transition-all hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "Install command copied." : ""}
      </span>
    </div>
  );
}

export default InstallCommand;
