import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import rawData from '../data.json'
import TreeNode from './components/TreeNode'
import PropertiesPanel from './components/PropertiesPanel'
import Breadcrumb from './components/Breadcrumb'
import { flattenVisible, useKeyboardNav } from './hooks/useKeyboardNav'
import { searchTree } from './hooks/useSearch'
import styles from './App.module.css'

function countItems(nodes) {
  let files = 0, folders = 0
  function walk(items) {
    for (const n of items) {
      if (n.type === 'folder') { folders++; walk(n.children || []) }
      else files++
    }
  }
  walk(nodes)
  return { files, folders }
}

function sortNodes(nodes, mode) {
  if (mode === 'none') return nodes
  return [...nodes].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
    if (mode === 'az') return a.name.localeCompare(b.name)
    if (mode === 'za') return b.name.localeCompare(a.name)
    if (mode === 'size') {
      const parse = s => s ? parseFloat(s) * (s.includes('MB') ? 1000 : s.includes('KB') ? 1 : 0.001) : 0
      return parse(b.size) - parse(a.size)
    }
    return 0
  }).map(n => n.type === 'folder' ? { ...n, children: sortNodes(n.children || [], mode) } : n)
}

export default function App() {
  const [expanded, setExpanded] = useState(new Set())
  const [selected, setSelected] = useState(null)
  const [focusedId, setFocusedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [recentFiles, setRecentFiles] = useState([])
  const [sortMode, setSortMode] = useState('none')
  const [sortOpen, setSortOpen] = useState(false)
  const explorerRef = useRef(null)
  const sortRef = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const { filtered: searchFiltered, expandIds } = useMemo(() => {
    if (!searchQuery.trim()) return { filtered: rawData, expandIds: new Set() }
    return searchTree(rawData, searchQuery)
  }, [searchQuery])

  const displayData = useMemo(() => sortNodes(searchFiltered, sortMode), [searchFiltered, sortMode])

  useEffect(() => {
    if (expandIds.size > 0) setExpanded(prev => new Set([...prev, ...expandIds]))
  }, [expandIds])

  const toggleExpand = useCallback((id) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const handleSelect = useCallback((node) => {
    setSelected(node)
    setRecentFiles(prev => {
      const f = prev.filter(x => x.id !== node.id)
      return [node, ...f].slice(0, 5)
    })
  }, [])

  const flatNodes = useMemo(() => flattenVisible(displayData, expanded), [displayData, expanded])

  const handleKeyDown = useKeyboardNav({ flatNodes, focusedId, setFocusedId, expanded, toggleExpand, setSelected: handleSelect })

  const { files, folders } = useMemo(() => countItems(rawData), [])

  function expandAll() {
    const ids = new Set()
    function walk(nodes) {
      for (const n of nodes) { if (n.type === 'folder') { ids.add(n.id); walk(n.children || []) } }
    }
    walk(rawData)
    setExpanded(ids)
  }

  const SORT_LABELS = { none: 'Default', az: 'A → Z', za: 'Z → A', size: 'By Size' }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.logoMark}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" fill="var(--accent-blue)" fillOpacity="0.2" stroke="var(--accent-blue)" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 12l2 2 4-4" stroke="var(--accent-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className={styles.logoText}>SecureVault</div>
            <div className={styles.logoSub}>Enterprise Storage</div>
          </div>
        </div>

        <div className={styles.sidebarNav}>
          <button className={`${styles.navItem} ${styles.navActive}`}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M1 3a1 1 0 011-1h4l1.5 1.5H14a1 1 0 011 1V13a1 1 0 01-1 1H2a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            File Explorer
          </button>
          <button className={styles.navItem}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Activity
          </button>
          <button className={styles.navItem}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Audit Log
          </button>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.vaultStats}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{folders}</span>
              <span className={styles.statLabel}>Folders</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>{files}</span>
              <span className={styles.statLabel}>Files</span>
            </div>
          </div>
          <div className={styles.encryptBadge}>
            <span className={styles.encryptDot} />
            AES-256 Encrypted
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className={styles.clearBtn} onClick={() => setSearchQuery('')}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.topbarStatus}>
              <span className={styles.statusPulse} />
              <span className={styles.statusText}>Vault Online</span>
            </div>
            <div className={styles.topbarActions}>
              <button className={styles.actionBtn} onClick={expandAll} title="Expand all">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M2 5l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className={styles.actionBtn} onClick={() => setExpanded(new Set())} title="Collapse all">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M2 11l6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className={styles.explorerLayout}>
          <div
            className={styles.treePane}
            ref={explorerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (!focusedId && flatNodes.length) setFocusedId(flatNodes[0].id) }}
          >
            <div className={styles.treePaneHeader}>
              <span className={styles.treePaneTitle}>VAULT EXPLORER</span>
              <div className={styles.treePaneActions}>
                {searchQuery && (
                  <span className={styles.searchResultCount}>
                    {flatNodes.length} result{flatNodes.length !== 1 ? 's' : ''}
                  </span>
                )}
                <div className={styles.sortWrap} ref={sortRef}>
                  <button
                    className={`${styles.sortBtn} ${sortMode !== 'none' ? styles.sortActive : ''}`}
                    onClick={() => setSortOpen(o => !o)}
                    title="Sort"
                  >
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </button>
                  {sortOpen && (
                    <div className={styles.sortDropdown}>
                      {Object.entries(SORT_LABELS).map(([key, label]) => (
                        <button
                          key={key}
                          className={`${styles.sortOption} ${sortMode === key ? styles.sortOptionActive : ''}`}
                          onClick={() => { setSortMode(key); setSortOpen(false) }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.treeScroll}>
              {displayData.length === 0 ? (
                <div className={styles.noResults}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M21 21l-4.35-4.35M11 8v3M11 14v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>No results for "{searchQuery}"</span>
                </div>
              ) : (
                displayData.map(node => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    depth={0}
                    expanded={expanded}
                    toggleExpand={toggleExpand}
                    selected={selected}
                    setSelected={handleSelect}
                    focusedId={focusedId}
                    setFocusedId={setFocusedId}
                    searchQuery={searchQuery}
                  />
                ))
              )}
            </div>
          </div>

          <div className={styles.rightPane}>
            <Breadcrumb selected={selected} data={rawData} />
            <div className={styles.propertiesWrap}>
              <PropertiesPanel selected={selected} recentFiles={recentFiles} onSelect={handleSelect} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
