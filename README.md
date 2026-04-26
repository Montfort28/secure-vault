# SecureVault Explorer

A file explorer UI built for enterprise cloud storage — think VS Code's sidebar but for law firms and banks navigating thousands of nested documents.

**Live Demo:** _[add your deployment URL]_
**Figma Design Link:** _[(https://www.figma.com/design/pyUDYu5xAEUajzSDlCBVRH/SecureVault-Explorer?node-id=0-1&p=f&t=9eDEbsC9pWDYzjpJ-0)]_

---

## Getting Started

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

Node 18+ required.

---

## How the Tree Works

The whole file tree runs off a single `TreeNode` component that renders itself recursively for every child. All the state — what's expanded, what's selected — lives at the top level in App and gets passed down. Nothing is stored inside the node itself.

This means depth doesn't matter. Two levels or twenty, the same component handles it without any changes.

Expanding and collapsing is just a Set — add the folder ID to open it, remove it to close. O(1) either way.

Keyboard navigation flattens only the currently visible nodes into an array on each render, then moves through them by index. Up and down walk the array, right expands a folder, left collapses it, Enter selects a file.

Search walks the tree recursively and collects two things — the filtered nodes that match, and the IDs of every parent folder that needs to be force-opened to show those matches. That way the tree structure stays intact even in search results.

---

## Wildcard Feature — Breadcrumb Trail

When you select a file, a breadcrumb bar shows the full path from the vault root down to that file. Something like `SecureVault › 01_Legal_Department › Active_Cases › Doe_vs_MegaCorp_Inc › Case_Summary_Draft_v3.docx`.

I added this because deeply nested vaults are disorienting. You can search for a file, find it, open it — and have no idea where it actually lives. For auditors and compliance teams that context matters a lot. Knowing the folder path is sometimes as important as the file itself.

When nothing is selected the same panel shows your last 5 opened files so you can jump back to them without searching again.

---

## What's in the App

- Recursive folder tree — expand, collapse, any depth
- Keyboard navigation — arrow keys, Enter to select
- Live search — filters as you type, auto-expands parent folders, highlights matches
- Sort controls — default order, A to Z, Z to A, by file size
- File inspector panel — name, type, extension, size, modified date, tags, activity
- Breadcrumb trail — full vault path of the selected file
- Recently viewed — last 5 files when nothing is selected
- Keyboard shortcut hints in the empty state
- Expand all / Collapse all
- File type icons color-coded by extension
- Vault stats in the sidebar
- No component libraries — everything built from scratch

---

## Stack

- React 18 + Vite
- CSS Modules
- Inter + JetBrains Mono
