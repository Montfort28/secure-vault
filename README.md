# SecureVault Explorer

SecureVault is a client-side file explorer dashboard for navigating deeply nested enterprise documents. The interface is designed for workflows such as legal case files, finance records, audits, and compliance review, where understanding a document's location is as important as opening it.

**Live demo:** https://secure-vault-beige.vercel.app

**Design file:** https://www.figma.com/design/pyUDYu5xAEUajzSDlCBVRH/SecureVault-Explorer?node-id=0-1&p=f&t=9eDEbsC9pWDYzjpJ-0

## Project Overview

The application renders the supplied vault data from `data.json` as an interactive explorer. Users can expand nested folders, select files, inspect metadata, search the hierarchy, sort items, navigate with the keyboard, and copy the full path of a selected file.

The project is a frontend challenge implementation. It does not connect to a backend, persist changes, or perform real file operations. The encryption labels shown in the interface describe the SecureVault product concept; this demo does not implement encryption.

## Features

- Recursive folder and file tree with arbitrary nesting depth
- Mouse-based folder expansion and collapse
- Expand all and collapse all controls
- File selection with selected-row highlighting
- Inspector panel with file type, extension, size, modified date, ID, tags, and activity metadata
- Recently viewed files when no file is selected
- Live, case-insensitive search for files and folders
- Hierarchical filtering that retains matching ancestor folders
- Search highlighting and a no-results state
- Default, A-Z, Z-A, and file-size sorting
- Keyboard navigation with Up, Down, Left, Right, and Enter
- Breadcrumb path for the selected file
- Wildcard feature: copy the selected file's full vault path
- File-type icons and vault statistics

## Technology Stack

- React 18
- Vite
- JavaScript with JSX
- CSS Modules
- Vitest and React Testing Library for interaction tests
- No component library; the interface is built with local React components and CSS

Node.js 18 or newer is required.

## Installation and Development

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run the interaction test suite:

```bash
npm test
```

## Project Structure

```text
secure-vault/
├── data.json                         # Supplied vault tree data
├── index.html                        # Vite HTML entry point
├── package.json                      # Scripts and dependencies
├── vite.config.js                    # Vite and Vitest configuration
├── src/
│   ├── App.jsx                       # Application state and page composition
│   ├── App.module.css                # Application layout styles
│   ├── index.css                     # Global design tokens and base styles
│   ├── main.jsx                      # React entry point
│   ├── components/
│   │   ├── Breadcrumb.jsx             # Selected-file path and copy action
│   │   ├── PropertiesPanel.jsx        # Inspector and recently viewed files
│   │   ├── TreeNode.jsx                # Recursive tree row and child rendering
│   │   └── *.module.css                # Component-scoped styles
│   ├── hooks/
│   │   ├── fileUtils.js               # File extension metadata
│   │   ├── useKeyboardNav.js           # Visible-tree flattening and key handling
│   │   └── useSearch.js                # Recursive filtering and ancestor expansion
│   └── test/
│       ├── App.test.jsx                # Explorer interaction tests
│       └── setup.js                    # Vitest and jsdom setup
└── README.md
```

## Recursive Folder Tree

`TreeNode` renders one node and recursively renders its children when an expandable folder is open. The same component handles both folders and files at every depth, so the data can contain two levels or many levels without a separate component for each depth.

Tree state is controlled by `App` and passed down as props:

- `expanded` is a `Set` of folder IDs. Toggling a folder adds or removes its ID without changing `data.json`.
- `selected` stores the selected file and drives row highlighting, the breadcrumb, and the inspector.
- `focusedId` identifies the item used by keyboard navigation.

The tree receives the original data or a cloned filtered result. The source data is never mutated.

## Expand and Collapse

Clicking a folder row toggles it when it has children. Empty folders do not create meaningless expansion state. The toolbar can open every folder or clear the expanded set.

The keyboard uses the same expansion state. Right expands a collapsed folder or enters its first child when already expanded. Left collapses an expanded folder; otherwise it moves focus to the nearest visible parent.

## File Selection and Inspector

Folders are navigation items and files are selectable items. Selecting a file updates the shared selection state, highlights the tree row, updates the breadcrumb, and renders the inspector panel. The panel displays metadata from the selected `data.json` record and maintains the five most recently selected files for quick access from the empty state.

## Keyboard Navigation

Before handling a key, `flattenVisible` walks the tree and creates an ordered list containing only visible nodes. Each entry includes its depth.

- Up and Down move to the previous or next visible entry.
- Right expands a collapsed folder, then moves into its first child when the folder is already open.
- Left collapses an open folder, or moves to the nearest visible ancestor when the current item cannot be collapsed.
- Enter selects a file or toggles a folder.

Because collapsed descendants are not included in the flattened list, keyboard navigation cannot move into hidden content.

## Search and Filtering

`searchTree` recursively compares each node name with a trimmed, case-insensitive query. A file is retained when its name matches. A folder is retained when its own name matches or one of its descendants matches; unrelated branches are removed from the returned tree.

The function also collects the IDs of ancestor folders required to reveal matching descendants. `App` combines those IDs with the user's manual expansion state only while a search is active, so clearing the query restores the user's previous folder state instead of leaving search-only folders open.

## Wildcard Feature: Breadcrumb Path

The breadcrumb is the project's additional wildcard feature. When a file is selected, the existing recursive path lookup displays its complete location from `SecureVault` to the filename. A copy button writes that path to the clipboard, for example:

```text
SecureVault / 01_Legal_Department / Active_Cases / Doe_vs_MegaCorp_Inc / Case_Summary_Draft_v3.docx
```

This is useful for audit, legal, and compliance workflows where a reviewer needs to record or share a document's location. It reuses the selected item and original tree data without adding a second navigation model.

## Testing Approach

The project uses Vitest with jsdom and React Testing Library. Tests interact with the rendered application through visible labels, buttons, text, and keyboard events rather than testing component internals.

The current suite covers:

- folder expansion and collapse
- nested folder rendering
- file selection and inspector updates
- keyboard movement through visible tree items
- recursive search, filtering, clearing, and no-results behavior
- wildcard breadcrumb path copying

## Challenge Context

The implementation addresses the challenge's core explorer requirements through a recursive data-driven tree, folder expansion/collapse, file selection, keyboard controls, hierarchical search, and an additional wildcard capability. The repository history separates these improvements into focused development commits for review.

## Deployment

The application is deployed as a static Vite frontend on Vercel:

https://secure-vault-beige.vercel.app

The production output is generated with `npm run build` and can be hosted by any static hosting provider that serves the Vite build output.
