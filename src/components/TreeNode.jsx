import { useEffect, useRef } from 'react'
import { getFileInfo } from '../hooks/fileUtils'
import styles from './TreeNode.module.css'

function ChevronIcon({ open }) {
  return (
    <svg className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4 2.5L7.5 6L4 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function FolderIcon({ open }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className={styles.folderIcon}>
      {open ? (
        <>
          <path d="M1 4a1 1 0 011-1h4l1.5 1.5H14a1 1 0 011 1V12a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" fill="#d29922" fillOpacity="0.9"/>
          <path d="M1 6.5h14" stroke="#d29922" strokeWidth="0.5" strokeOpacity="0.5"/>
        </>
      ) : (
        <path d="M1 4a1 1 0 011-1h4l1.5 1.5H14a1 1 0 011 1V12a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" fill="#d29922" fillOpacity="0.7"/>
      )}
    </svg>
  )
}

export default function TreeNode({ node, depth, expanded, toggleExpand, selected, setSelected, focusedId, setFocusedId, searchQuery }) {
  const ref = useRef(null)
  const isFolder = node.type === 'folder'
  const isOpen = expanded.has(node.id)
  const isSelected = selected?.id === node.id
  const isFocused = focusedId === node.id
  const fileInfo = !isFolder ? getFileInfo(node.name) : null

  useEffect(() => {
    if (isFocused && ref.current) {
      ref.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [isFocused])

  function highlight(text) {
    if (!searchQuery) return text
    const idx = text.toLowerCase().indexOf(searchQuery.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <mark className={styles.highlight}>{text.slice(idx, idx + searchQuery.length)}</mark>
        {text.slice(idx + searchQuery.length)}
      </>
    )
  }

  function handleClick() {
    setFocusedId(node.id)
    if (isFolder) toggleExpand(node.id)
    else setSelected(node)
  }

  return (
    <div className={styles.nodeWrapper}>
      <div
        ref={ref}
        className={`${styles.row} ${isSelected ? styles.selected : ''} ${isFocused ? styles.focused : ''}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        data-id={node.id}
        tabIndex={-1}
      >
        <span className={styles.iconGroup}>
          {isFolder ? (
            <ChevronIcon open={isOpen} />
          ) : (
            <span className={styles.fileIndent} />
          )}
          {isFolder ? (
            <FolderIcon open={isOpen} />
          ) : (
            <span className={styles.fileEmoji} style={{ color: fileInfo.color }}>{fileInfo.icon}</span>
          )}
        </span>
        <span className={`${styles.name} ${isFolder ? styles.folderName : ''}`}>
          {highlight(node.name)}
        </span>
        {!isFolder && node.size && (
          <span className={styles.size}>{node.size}</span>
        )}
        {isFolder && node.children?.length > 0 && (
          <span className={styles.badge}>{node.children.length}</span>
        )}
      </div>

      {isFolder && isOpen && node.children?.length > 0 && (
        <div className={styles.children}>
          <div className={styles.indentLine} style={{ left: `${depth * 16 + 15}px` }} />
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              toggleExpand={toggleExpand}
              selected={selected}
              setSelected={setSelected}
              focusedId={focusedId}
              setFocusedId={setFocusedId}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  )
}
