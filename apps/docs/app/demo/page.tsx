"use client";

import React, { useState, useEffect } from "react";
import { StorageManager, CleanupManager } from "localstorage-platform";
import { StorageProvider, useStorageValue } from "localstorage-platform/react";

// Create a single storage manager instance
const demoStorage =
    typeof window !== "undefined" ? new StorageManager("demo-app") : null;

function CounterComponent({ title }: { title: string }) {
    const [count, setCount] = useStorageValue<number>("click-count", 0);

    return (
        <div className="p-6 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center justify-between gap-4 transition-all duration-300 hover:border-violet-500/50 hover:shadow-violet-900/10">
            <h3 className="text-slate-400 font-semibold tracking-wider text-sm uppercase">
                {title}
            </h3>
            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                {count ?? 0}
            </div>
            <div className="flex gap-2 w-full mt-2">
                <button
                    onClick={() => setCount((prev) => (prev ?? 0) - 1)}
                    className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold transition-all cursor-pointer"
                >
                    -
                </button>
                <button
                    onClick={() => setCount((prev) => (prev ?? 0) + 1)}
                    className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-bold transition-all shadow-md shadow-violet-900/20 cursor-pointer"
                >
                    +
                </button>
            </div>
        </div>
    );
}

function ThemeToggler() {
    const [theme, setTheme] = useStorageValue<string>("theme", "light");

    return (
        <div className="p-6 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 hover:border-sky-500/50 hover:shadow-sky-900/10">
            <div>
                <h3 className="text-slate-400 font-semibold tracking-wider text-sm uppercase">
                    Theme Switcher
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                    Updates localstorage value & syncs reactively
                </p>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm text-slate-300">Current Theme:</span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-sky-400 border border-sky-500/20">
                    {theme}
                </span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                        theme === "light"
                            ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                >
                    Light
                </button>
                <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                        theme === "dark"
                            ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                >
                    Dark
                </button>
            </div>
        </div>
    );
}

function AdvancedStorageControl() {
    const [customKey, setCustomKey] = useState("username");
    const [customValue, setCustomValue] = useState("Jay");
    const [groupName, setGroupName] = useState("user-session");

    const [value, setValue] = useStorageValue<any>(customKey, "");

    const handleSave = () => {
        setValue(customValue, groupName ? { group: groupName } : undefined);
    };

    const handleClearAll = () => {
        if (demoStorage) {
            const cleanup = new CleanupManager("demo-app", demoStorage);
            cleanup.clearAll();
        }
    };

    const handleClearGroup = () => {
        if (demoStorage) {
            const cleanup = new CleanupManager("demo-app", demoStorage);
            cleanup.clearGroup(groupName);
        }
    };

    return (
        <div className="p-6 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4 col-span-1 md:col-span-2 lg:col-span-3 transition-all hover:border-slate-700">
            <h3 className="text-slate-200 font-bold text-lg border-b border-slate-800 pb-2">
                Custom Keys & Cleanup Control
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase">
                        Key Name
                    </label>
                    <input
                        type="text"
                        value={customKey}
                        onChange={(e) => setCustomKey(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase">
                        Value to Write
                    </label>
                    <input
                        type="text"
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase">
                        Group Tag (Optional)
                    </label>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 mt-2 bg-slate-950/50 p-3 rounded-lg border border-slate-900">
                <span className="text-xs text-slate-400 font-mono">
                    Current value of `{customKey}`:
                </span>
                <span className="text-sm font-semibold text-violet-400 font-mono">
                    {JSON.stringify(value) ?? "null"}
                </span>
            </div>

            <div className="flex flex-wrap gap-3 mt-2">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 active:scale-95 rounded-lg text-sm font-bold text-white transition-all shadow-lg shadow-violet-900/25 cursor-pointer"
                >
                    Save Key
                </button>
                <button
                    onClick={() => setValue(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg text-sm font-semibold text-slate-300 transition-all cursor-pointer"
                >
                    Remove Key
                </button>
                <button
                    onClick={handleClearGroup}
                    className="px-4 py-2 border border-rose-500/25 hover:bg-rose-500/10 active:scale-95 rounded-lg text-sm font-semibold text-rose-400 transition-all cursor-pointer"
                >
                    Clear Group `{groupName}`
                </button>
                <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-rose-950/50 hover:bg-rose-900/50 active:scale-95 border border-rose-500/30 rounded-lg text-sm font-bold text-rose-300 transition-all cursor-pointer"
                >
                    Clear All Namespace
                </button>
            </div>
        </div>
    );
}

export default function DemoPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !demoStorage) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-6">
                <div className="text-center font-semibold text-slate-500">
                    Loading Storage Engine...
                </div>
            </div>
        );
    }

    return (
        <StorageProvider manager={demoStorage}>
            <div className="min-h-screen bg-slate-950 text-slate-200 p-8 flex flex-col justify-start items-center gap-8 font-sans">
                <div className="w-full max-w-5xl text-center flex flex-col gap-2 mt-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-sky-400 to-fuchsia-400">
                        React Hooks Live Sandbox
                    </h1>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto">
                        Test reactive updates, context resolution, key-specific
                        subscribers, and Group Cleanups in real time.
                    </p>
                </div>

                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {/* Component A - Shares 'click-count' */}
                    <CounterComponent title="Reactive Counter A" />

                    {/* Component B - Shares 'click-count' */}
                    <CounterComponent title="Reactive Counter B" />

                    {/* Theme Toggler - Separate state */}
                    <ThemeToggler />

                    {/* Advanced Operations */}
                    <AdvancedStorageControl />
                </div>

                <div className="w-full max-w-5xl mt-6 p-4 rounded-xl bg-slate-900/30 border border-slate-900 text-xs text-slate-500 flex flex-col gap-1 font-mono">
                    <div>
                        📌 Tip: Duplicate this tab in your browser and click
                        button controls. Values sync instantly across tabs!
                    </div>
                    <div>
                        📦 Namespace:{" "}
                        <span className="text-violet-400">"demo-app"</span>
                    </div>
                </div>
            </div>
        </StorageProvider>
    );
}
