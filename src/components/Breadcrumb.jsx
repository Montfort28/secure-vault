import styles from './Breadcrumb.module.css'

function findPath(nodes, targetId, path = []) {
  for (const node of nodes) {
    const current = [...path, node.name]
    if (node.id === targetId) return current
    if (node.children?.length) {
      const found = findPath(node.children, targetId, current)
      if (found) return found
    }
  }
  return null
}

export default function Breadcrumb({ selected, data }) {
  if (!selected) return (
    <div className={styles.bar}>
      <span className={styles.root}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M2 6.5L8 2l6 4.5V14a1 1 0 01-1 1H3a1 1 0 01-1-1V6.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        SecureVault
      </span>
    </div>
  )

  const path = findPath(data, selected.id) || [selected.name]

  return (
    <div className={styles.bar}>
      <span className={styles.root}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M2 6.5L8 2l6 4.5V14a1 1 0 01-1 1H3a1 1 0 01-1-1V6.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        SecureVault
      </span>
      {path.map((segment, i) => (
        <span key={i} className={styles.segment}>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className={styles.sep}>
            <path d="M2 1.5L5.5 4L2 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className={i === path.length - 1 ? styles.active : styles.crumb}>{segment}</span>
        </span>
      ))}
    </div>
  )
}
