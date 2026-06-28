# localstorage-platform

![CI](https://github.com/captainAmerica700/localstorage-platform/actions/workflows/ci.yml/badge.svg)

> **The browser gives us storage. This library gives it structure.**

`localstorage-platform` is a lightweight, type-safe storage library that helps you organize browser storage with namespaces, metadata, TTL, optional encryption, and group-based cleanup.

Instead of scattering `localStorage` calls across your application, build a storage layer that is predictable, maintainable, and ready to grow with your project.

---

# Why?

Every application starts small.

```ts
localStorage.setItem("user", JSON.stringify(user));
localStorage.setItem("theme", "dark");
localStorage.setItem("token", token);
```

As the application grows, storage becomes difficult to manage.

* Keys are scattered throughout the codebase.
* Cleanup logic is duplicated.
* Related data becomes difficult to remove.
* Expired values remain forever.
* Sensitive information is stored in plain text.
* Different applications can accidentally reuse the same keys.

The browser provides storage.

It does not provide **storage architecture**.

`localstorage-platform` fills that gap.

---

# Philosophy

Storage is more than saving data.

Every stored value should answer questions like:

* Who owns this data?
* How long should it exist?
* Should it expire?
* Should it be encrypted?
* How should it be cleaned up?

Instead of treating browser storage as random key-value pairs, this library treats it as a structured part of your application.

---

# Features

* ✅ Namespace isolation
* ✅ Type-safe API
* ✅ Metadata for every value
* ✅ Automatic TTL expiration
* ✅ Optional AES encryption
* ✅ Group-based cleanup
* ✅ Lightweight (~2 KB ESM)
* ✅ Framework agnostic
* ✅ Zero configuration

---

# Installation

Using pnpm

```bash
pnpm add localstorage-platform
```

Using npm

```bash
npm install localstorage-platform
```

---

# Quick Start

```ts
import {
    StorageManager,
    CleanupManager
} from "localstorage-platform";

const storage = new StorageManager("company-name");

const cleanup = new CleanupManager(
    "company-name",
    storage
);

storage.set("theme", "dark");

storage.set("user", {
    id: 1,
    name: "Jay"
});

const user = storage.get<{
    id: number;
    name: string;
}>("user");
```

---

# Namespace Isolation

Namespaces prevent different applications or features from using the same storage keys.

```ts
const storage = new StorageManager("company-name");

storage.set("user", user);
```

Stored in the browser as:

```text
company-name:user
```

---

# Metadata

Every stored value includes metadata.

```json
{
  "value": {
    "id": 1,
    "name": "Jay"
  },
  "meta": {
    "group": "session",
    "encrypt": true,
    "createdAt": 171111111,
    "updatedAt": 171111111,
    "expiresAt": 171112111
  }
}
```

Metadata enables advanced features without changing the storage format.

---

# Time-To-Live (TTL)

Automatically expire stored values.

```ts
storage.set(
    "session",
    session,
    {
        ttl: 60000
    }
);
```

Expired values are automatically removed when accessed.

---

# Encryption

Encrypt only the values you choose.

Create the storage manager with a secret.

```ts
const storage = new StorageManager(
    "company-name",
    {
        encryption: {
            secret: "my-secret-key"
        }
    }
);
```

Store encrypted data.

```ts
storage.set(
    "token",
    token,
    {
        encrypt: true
    }
);
```

Retrieve it normally.

```ts
const token =
    storage.get<string>("token");
```

Only the stored value is encrypted.

Metadata remains readable so TTL and cleanup continue to work.

---

# Group-Based Cleanup

Store related values together.

```ts
storage.set(
    "user",
    user,
    {
        group: "session"
    }
);

storage.set(
    "token",
    token,
    {
        group: "session"
    }
);
```

Later,

```ts
cleanup.clearGroup("session");
```

Before

```text
company-name:user
company-name:token
company-name:theme
```

After

```text
company-name:theme
```

---

# API

## StorageManager

```ts
storage.set(
    key,
    value,
    options
);

storage.get(key);

storage.has(key);

storage.getMetadata(key);

storage.remove(key);
```

---

### Metadata Options

```ts
{
    group?: string;
    ttl?: number;
    encrypt?: boolean;
}
```

---

## CleanupManager

```ts
cleanup.clearGroup(group);

cleanup.clearAll();
```

---

# Example

```ts
const storage = new StorageManager(
    "app",
    {
        encryption: {
            secret: "secret-key"
        }
    }
);

storage.set(
    "theme",
    "dark"
);

storage.set(
    "token",
    "abc123",
    {
        group: "auth",
        encrypt: true
    }
);

storage.set(
    "profile",
    {
        id: 7
    },
    {
        group: "user"
    }
);

cleanup.clearGroup("auth");
```

---

# Architecture

## StorageManager

Responsible for:

* set
* get
* has
* getMetadata
* remove

---

## CleanupManager

Responsible for:

* clearGroup
* clearAll

Keeping these responsibilities separate keeps the library simple and extensible.

---

# Testing

Run the complete test suite.

```bash
pnpm test:run
```

The project includes automated tests for:

* Storage operations
* Metadata
* TTL
* Encryption
* Namespace isolation
* Group cleanup
* Corrupted storage handling

---

# Current Scope

Version **1.x** focuses on providing a solid storage foundation.

* Namespace isolation
* Metadata
* TTL
* Optional encryption
* Group cleanup
* Type safety

---

# Roadmap

Future versions may include:

* Session Storage support
* IndexedDB adapter
* Memory storage adapter
* Storage drivers
* Compression
* Data migrations
* Synchronization
* React hooks

The API is designed so these features can be added without breaking existing applications.

---

# Design Philosophy

Good software grows.

Your storage layer should grow with it.

`localstorage-platform` stores metadata alongside every value instead of maintaining separate registries. This keeps each stored item self-contained and allows new capabilities to be introduced without changing the storage format.

Today's features:

* Namespaces
* Metadata
* TTL
* Encryption
* Cleanup

Tomorrow's possibilities:

* Multiple storage backends
* Compression
* Migrations
* Synchronization
* Plugins

The goal is not to wrap `localStorage`.

The goal is to build a storage foundation that applications can rely on.

---

# Contributing

Issues, feature requests, and pull requests are always welcome.

If you have an idea that makes browser storage simpler, safer, or more scalable, we'd love to discuss it.

---

# License

MIT
