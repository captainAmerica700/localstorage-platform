import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StorageManager } from '../src/core/StorageManager';
import { StorageProvider, useStorageValue } from '../src/react';

describe('React Hooks Integration', () => {
    let container: HTMLDivElement | null = null;
    let root: any = null;
    let storage: StorageManager;

    beforeEach(() => {
        (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
        localStorage.clear();
        storage = new StorageManager('reactApp');
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        if (root) {
            act(() => {
                root.unmount();
            });
            root = null;
        }
        if (container) {
            document.body.removeChild(container);
            container = null;
        }
        storage.destroy();
    });

    function render(element: React.ReactElement) {
        act(() => {
            root = createRoot(container!);
            root.render(element);
        });
    }

    it('should throw an error if useStorageValue is called without a provider or explicit manager', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        function TestComponent() {
            useStorageValue('theme');
            return null;
        }

        expect(() => {
            render(<TestComponent />);
        }).toThrow(/StorageManager is not configured/);

        consoleSpy.mockRestore();
    });

    it('should read and update value using explicit StorageManager', () => {
        let val: string | null = null;
        let setVal: any = null;

        function TestComponent() {
            const [theme, setTheme] = useStorageValue(storage, 'theme', 'light');
            val = theme;
            setVal = setTheme;
            return <div id="theme-div">{theme}</div>;
        }

        render(<TestComponent />);
        expect(container!.querySelector('#theme-div')?.textContent).toBe('light');
        expect(val).toBe('light');

        act(() => {
            setVal('dark');
        });
        expect(container!.querySelector('#theme-div')?.textContent).toBe('dark');
        expect(val).toBe('dark');
        expect(storage.get('theme')).toBe('dark');
    });

    it('should update reactively when external StorageManager changes value', () => {
        function TestComponent() {
            const [theme] = useStorageValue(storage, 'theme', 'light');
            return <div id="theme-div">{theme}</div>;
        }

        render(<TestComponent />);
        expect(container!.querySelector('#theme-div')?.textContent).toBe('light');

        act(() => {
            storage.set('theme', 'dark');
        });
        expect(container!.querySelector('#theme-div')?.textContent).toBe('dark');
    });

    it('should resolve manager from StorageProvider', () => {
        let val: string | null = null;
        let setVal: any = null;

        function TestComponent() {
            const [theme, setTheme] = useStorageValue<string>('theme', 'light');
            val = theme;
            setVal = setTheme;
            return <div id="theme-div">{theme}</div>;
        }

        render(
            <StorageProvider manager={storage}>
                <TestComponent />
            </StorageProvider>
        );

        expect(container!.querySelector('#theme-div')?.textContent).toBe('light');
        expect(val).toBe('light');

        act(() => {
            setVal('custom-theme');
        });

        expect(container!.querySelector('#theme-div')?.textContent).toBe('custom-theme');
        expect(storage.get('theme')).toBe('custom-theme');
    });

    it('should support functional updates', () => {
        let setVal: any = null;

        function TestComponent() {
            const [count, setCount] = useStorageValue<number>(storage, 'count', 0);
            setVal = setCount;
            return <div id="count-div">{count}</div>;
        }

        render(<TestComponent />);
        expect(container!.querySelector('#count-div')?.textContent).toBe('0');

        act(() => {
            setVal((prev: number | null) => (prev ?? 0) + 5);
        });

        expect(container!.querySelector('#count-div')?.textContent).toBe('5');
    });
});
