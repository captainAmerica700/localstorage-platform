# localstorage-platform

![CI](https://github.com/captainAmerica700/localstorage-platform/actions/workflows/ci.yml/badge.svg)

A type-safe storage platform for managing localStorage using namespaces, metadata, and group-based cleanup.

## Why?

Most applications start with code like:

```ts
localStorage.setItem('user', JSON.stringify(user));
localStorage.setItem('booking', JSON.stringify(booking));

localStorage.removeItem('user');
localStorage.removeItem('booking');
localStorage.removeItem('calendar');
```

Over time this becomes difficult to maintain:

* Storage keys are scattered across the codebase
* Logout flows require manual cleanup
* No ownership information exists for stored data
* No metadata is available for future features such as TTL, migrations, or adapters
* Different applications can accidentally collide on storage keys

`localstorage-platform` provides a structured approach while remaining lightweight and framework-agnostic.

---

## Features

### Namespace Isolation

Prevent key collisions across applications.

```ts
const storage = new StorageManager('company-name');  // here company-name is equivalent to organization identity

storage.set('user', user);
```

Stored as:

```txt
company-name:user
```

---

### Metadata-Aware Storage

Every stored item includes metadata.

```json
{
  "value": {
    "id": 1,
    "name": "Jay"
  },
  "meta": {
    "type": "group",
    "group": "session",
    "createdAt": 171111111,
    "updatedAt": 171111111
  }
}
```

---

### Group-Based Cleanup

Store related items together and clean them up with a single operation.

```ts
storage.set('user', user, 'session');
storage.set('booking', booking, 'session');

cleanup.clearGroup('session');
```

---

### Type Safe API

```ts
const user = storage.get<User>('user');
```

---

## Installation

```bash
pnpm add localstorage-platform
```

or

```bash
npm install localstorage-platform
```

---

## Quick Start

```ts
import {
  StorageManager,
  CleanupManager
} from 'localstorage-platform';

const storage =
  new StorageManager('company-name');

const cleanup =
  new CleanupManager(
    'company-name',
    storage
  );
```

---

## Real-world examples

### Clear session data on logout

Group session-owned keys together so logout cleanup does not remove long-lived preferences.

```ts
type UserSession = {
  id: string;
  email: string;
};

const storage = new StorageManager('booking-admin');
const cleanup = new CleanupManager('booking-admin', storage);

storage.set<UserSession>(
  'user',
  { id: '42', email: 'jay@example.com' },
  'session'
);
storage.set<string[]>(
  'permissions',
  ['bookings:read', 'bookings:write'],
  'session'
);
storage.set('theme', 'dark', 'preferences');

cleanup.clearGroup('session');

const user = storage.get<UserSession>('user'); // null
const theme = storage.get<'light' | 'dark'>('theme'); // 'dark'
```

### Persist a theme preference

Store UI preferences in their own group so they survive session cleanup and can be read during app startup.

```ts
type Theme = 'light' | 'dark';

const storage = new StorageManager('customer-portal');

function saveTheme(theme: Theme): void {
  storage.set<Theme>('theme', theme, 'preferences');
}

function loadTheme(): Theme {
  return storage.get<Theme>('theme') ?? 'light';
}

saveTheme('dark');
const theme = loadTheme();
```

### Use it from React or Next.js

In React or Next.js, call `localStorage`-backed methods from client-side code.

```tsx
'use client';

import { useEffect, useState } from 'react';
import { StorageManager } from 'localstorage-platform';

const storage = new StorageManager('dashboard');

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const storedTheme = storage.get<Theme>('theme');

    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  function chooseTheme(nextTheme: Theme): void {
    setTheme(nextTheme);
    storage.set<Theme>('theme', nextTheme, 'preferences');
  }

  return (
    <button onClick={() => chooseTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme}
    </button>
  );
}
```

---

## StorageManager

### set

```ts
storage.set(
  'user',
  user,
  'session'
);
```

### get

```ts
const user =
  storage.get<User>(
    'user'
  );
```

### has

```ts
storage.has('user');
```

### getMetadata

```ts
storage.getMetadata(
  'user'
);
```

### remove

```ts
storage.remove('user');
```

---

## CleanupManager

### clearGroup

```ts
cleanup.clearGroup(
  'session'
);
```

Before:

```txt
company-name:user
company-name:booking
company-name:theme
```

After:

```txt
company-name:theme
```

---

### clearAll

```ts
cleanup.clearAll();
```

Removes all keys belonging to the current namespace.

---

## Architecture

### StorageManager

Responsible for:

* set
* get
* has
* getMetadata
* remove

### CleanupManager

Responsible for:

* clearGroup
* clearAll

This separation keeps single-key operations and multi-key operations independent.

---

## Testing

The package includes automated tests covering:

* set / get
* has
* remove
* getMetadata
* namespace isolation
* corrupted storage handling
* clearGroup
* clearAll

Run tests:

```bash
pnpm test:run
```

---

## Current Scope

Version 1 focuses on:

* Namespace isolation
* Metadata support
* Group-based cleanup
* Type safety
* Test coverage

---

## Roadmap

Future versions may include:

* TTL support
* Session storage adapter
* IndexedDB adapter
* Data migrations
* Encryption hooks
* Synchronization utilities

The API has been designed to support these capabilities without breaking existing consumers.

Design Philosophy

The package stores metadata alongside values instead of maintaining a separate registry.

This approach keeps storage self-contained and enables future capabilities such as:

TTL expiration
Storage migrations
Encryption hooks
Additional storage adapters

without requiring changes to existing stored data.
---

## License

MIT
