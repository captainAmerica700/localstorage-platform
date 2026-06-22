# localstorage-platform

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
const storage = new StorageManager('guidesly');

storage.set('user', user);
```

Stored as:

```txt
guidesly:user
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
  new StorageManager('guidesly');

const cleanup =
  new CleanupManager(
    'guidesly',
    storage
  );
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
guidesly:user
guidesly:booking
guidesly:theme
```

After:

```txt
guidesly:theme
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
