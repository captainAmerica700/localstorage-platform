import { InstallCommand } from "@/components/home/InstallCommand";
import Link from "next/link";

const storageFlow = [
  {
    label: "namespace",
    value: "company-name",
    description: "Own every key written by the application.",
  },
  {
    label: "record",
    value: "company-name:user",
    description: "Store values with metadata, TTL, and group context.",
  },
  {
    label: "cleanup",
    value: "clearGroup('session')",
    description: "Remove related data without touching the rest.",
  },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-neutral-200 bg-[linear-gradient(180deg,rgba(250,250,250,0.98),rgba(245,245,245,0.94))] dark:border-neutral-900 dark:bg-[linear-gradient(180deg,rgba(10,10,10,0.98),rgba(20,20,20,0.94))]">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(115,115,115,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(115,115,115,0.08)_1px,transparent_1px)] bg-[size:36px_36px]" />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl content-center gap-12 px-6 py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-24">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm font-medium text-neutral-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
            Structured browser storage for production apps.
          </div>

          <h1 className="max-w-4xl text-5xl font-bold text-neutral-950 dark:text-neutral-50 sm:text-6xl lg:text-7xl">
            The browser gives us{" "}
            <span className="text-blue-600 dark:text-blue-400">storage.</span>
            <br />
            We give it{" "}
            <span className="text-cyan-600 dark:text-cyan-300">structure.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-400">
            Build a deliberate storage layer on top of localStorage:
            namespaces, metadata, TTL, optional encryption, and group-based
            cleanup without scattering raw browser APIs across your app.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/docs/getting-started"
              className="inline-flex rounded-md bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              Get Started
            </Link>

            <Link
              href="/docs/guides/encryption"
              className="inline-flex rounded-md border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-neutral-900"
            >
              Explore Guides
            </Link>
          </div>

          <InstallCommand />
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.14),transparent_30%)]" />

          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-950/10 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-black/40">
            <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
              <div>
                <p className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">
                  Storage pipeline
                </p>
                <p className="mt-1 text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                  localStorage becomes an application boundary
                </p>
              </div>
              <div className="rounded-md border border-neutral-200 bg-white px-2 py-1 font-mono text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                v1.x
              </div>
            </div>

            <div className="space-y-4 p-5">
              {storageFlow.map((item, index) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[2rem_1fr] gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/70"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-950 font-mono text-sm font-semibold text-white dark:bg-neutral-50 dark:text-neutral-950">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">
                      {item.label}
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 bg-neutral-950 p-5 dark:border-neutral-800">
              <pre className="overflow-x-auto text-sm leading-6 text-neutral-100">
                <code>{`storage.set("token", token, {
  group: "session",
  ttl: 60000,
  encrypt: true,
});`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
