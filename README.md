# SecureVault Explorer

A high-performance, keyboard-accessible file explorer UI for enterprise cloud storage. Built for law firms and financial institutions that need to navigate deeply nested document vaults with precision and speed.

**Live Demo:** _[deployment URL]_  
**Design File:** _[(https://www.figma.com/design/pyUDYu5xAEUajzSDlCBVRH/SecureVault-Explorer?node-id=0-1&t=I1OrsuQBO43P68gQ-1)]_

---

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Requires Node 18+.

---

## Recursive Strategy

The file tree is rendered by a single `TreeNode` component that calls itself for every child node. Each node receives the full `expanded` Set and `selected` state from the root — no local state lives inside the node itself. This means:

- Depth is unbounded. Whether the tree is 2 levels or 20, the same component handles it.
- Expanding/collapsing is O(1) — just a Set add/delete at the top level.
- Keyboard navigation works by flattening only the *visible* nodes (respecting the `expanded` Set) into a flat array on each render, then using index arithmetic for Up/Down/Left/Right/Enter.

Search filters the tree recursively and returns both the filtered node tree and a Set of folder IDs that must be force-expanded to reveal matches. This keeps the search result view consistent with the tree structure.

---

## Wildcard Feature: Live Breadcrumb Trail

When a file is selected, a breadcrumb bar above the Properties Panel shows the full vault path — e.g. `SecureVault › 01_Legal_Department › Active_Cases › Doe_vs_MegaCorp_Inc › Case_Summary_Draft_v3.docx`.

**Why this adds value:** In a deeply nested vault with hundreds of folders, users frequently lose track of where a file lives after navigating to it via search. The breadcrumb gives instant spatial context without requiring the user to scroll the tree. For auditors and compliance officers reviewing specific documents, knowing the exact folder path is often as important as the file itself.

A secondary benefit: the breadcrumb doubles as a "Recently Viewed" panel when no file is selected, surfacing the last 5 opened files for fast re-access — a pattern familiar from IDEs and document editors.

---

## Features

- Recursive folder tree with expand/collapse
- Full keyboard navigation (↑ ↓ → ← Enter)
- Live search with auto-expand of matching parent folders and inline highlight
- File Properties Panel with name, type, extension, size, and ID
- Breadcrumb trail showing full vault path of selected file
- Recently Viewed file list
- Expand All / Collapse All controls
- File type icons and color-coded by extension
- Vault stats (total folders and files) in sidebar
- AES-256 encryption status indicator
- Zero external component libraries — all UI built from scratch

---

## Tech Stack

- React 18 + Vite
- CSS Modules
- Inter + JetBrains Mono (Google Fonts)
