import { getFileInfo } from '../hooks/fileUtils'
import styles from './PropertiesPanel.module.css'

function MetaRow({ label, value, mono }) {
  return (
    <div className={styles.metaRow}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={`${styles.metaValue} ${mono ? styles.mono : ''}`}>{value}</span>
    </div>
  )
}

export default function PropertiesPanel({ selected, recentFiles }) {
  if (!selected) {
    return (
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>Properties</span>
        </div>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 12h6M9 16h6M7 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2M9 4a2 2 0 002 2h2a2 2 0 002-2M9 4a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className={styles.emptyText}>Select a file to inspect</p>
        </div>

        {recentFiles.length > 0 && (
          <div className={styles.recentSection}>
            <span className={styles.sectionLabel}>Recently Viewed</span>
            {recentFiles.map(f => {
              const info = getFileInfo(f.name)
              return (
                <div key={f.id} className={styles.recentItem}>
                  <span style={{ color: info.color }}>{info.icon}</span>
                  <span className={styles.recentName}>{f.name}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const info = getFileInfo(selected.name)
  const ext = selected.name.includes('.') ? selected.name.split('.').pop().toUpperCase() : 'FILE'

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Properties</span>
      </div>

      <div className={styles.fileCard}>
        <div className={styles.fileIconLarge} style={{ color: info.color, borderColor: `${info.color}30` }}>
          <span>{info.icon}</span>
        </div>
        <div className={styles.fileName}>{selected.name}</div>
        <div className={styles.fileType}>{info.label}</div>
      </div>

      <div className={styles.metaSection}>
        <span className={styles.sectionLabel}>File Details</span>
        <MetaRow label="Name" value={selected.name} mono />
        <MetaRow label="Type" value={info.label} />
        <MetaRow label="Extension" value={`.${ext.toLowerCase()}`} mono />
        <MetaRow label="Size" value={selected.size || '—'} mono />
        <MetaRow label="ID" value={selected.id} mono />
      </div>

      <div className={styles.statusBar}>
        <span className={styles.statusDot} />
        <span className={styles.statusText}>Encrypted at rest</span>
      </div>
    </div>
  )
}
