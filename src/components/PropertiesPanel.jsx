import { getFileInfo } from '../hooks/fileUtils'
import styles from './PropertiesPanel.module.css'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function daysAgo(dateStr) {
  if (!dateStr) return null
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 30) return `${diff} days ago`
  if (diff < 365) return `${Math.floor(diff / 30)} months ago`
  return `${Math.floor(diff / 365)} years ago`
}

function MetaRow({ label, value, mono, accent }) {
  return (
    <div className={styles.metaRow}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={`${styles.metaValue} ${mono ? styles.mono : ''} ${accent ? styles.accent : ''}`}>{value}</span>
    </div>
  )
}

function EmptyState({ recentFiles, onSelect }) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Inspector</span>
      </div>
      <div className={styles.emptyHero}>
        <div className={styles.emptyOrb}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M9 12h6M9 16h6M7 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2M9 4a2 2 0 002 2h2a2 2 0 002-2M9 4a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p className={styles.emptyTitle}>No file selected</p>
        <p className={styles.emptySubtitle}>Click any file in the vault to inspect its details</p>
      </div>

      {recentFiles.length > 0 && (
        <div className={styles.recentSection}>
          <div className={styles.sectionHeader}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Recently Viewed
          </div>
          {recentFiles.map(f => {
            const info = getFileInfo(f.name)
            return (
              <button key={f.id} className={styles.recentItem} onClick={() => onSelect(f)}>
                <span className={styles.recentIcon} style={{ color: info.color, borderColor: `${info.color}25` }}>
                  {info.icon}
                </span>
                <div className={styles.recentMeta}>
                  <span className={styles.recentName}>{f.name}</span>
                  <span className={styles.recentSize}>{f.size || '—'}</span>
                </div>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={styles.recentArrow}>
                  <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
            )
          })}
        </div>
      )}

      <div className={styles.kbHint}>
        <div className={styles.kbRow}>
          <kbd>↑</kbd><kbd>↓</kbd><span>navigate</span>
        </div>
        <div className={styles.kbRow}>
          <kbd>→</kbd><kbd>←</kbd><span>expand / collapse</span>
        </div>
        <div className={styles.kbRow}>
          <kbd>Enter</kbd><span>select file</span>
        </div>
      </div>
    </div>
  )
}

export default function PropertiesPanel({ selected, recentFiles, onSelect }) {
  if (!selected) return <EmptyState recentFiles={recentFiles} onSelect={onSelect} />

  const info = getFileInfo(selected.name)
  const ext = selected.name.includes('.') ? selected.name.split('.').pop().toLowerCase() : 'file'
  const ago = daysAgo(selected.modified)

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Inspector</span>
        <span className={styles.extPill}>.{ext}</span>
      </div>

      <div className={styles.fileHero}>
        <div className={styles.fileIconWrap} style={{ '--file-color': info.color }}>
          <span className={styles.fileIconEmoji}>{info.icon}</span>
          <div className={styles.fileIconGlow} />
        </div>
        <div className={styles.fileHeroMeta}>
          <div className={styles.fileHeroName}>{selected.name}</div>
          <div className={styles.fileHeroType}>{info.label}</div>
          {ago && <div className={styles.fileHeroAgo}>{ago}</div>}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          File Details
        </div>
        <MetaRow label="Name" value={selected.name} mono />
        <MetaRow label="Type" value={info.label} />
        <MetaRow label="Extension" value={`.${ext}`} mono />
        <MetaRow label="Size" value={selected.size || '—'} mono accent />
        <MetaRow label="Modified" value={formatDate(selected.modified)} mono />
        <MetaRow label="ID" value={selected.id} mono />
      </div>

      {selected.tags?.length > 0 && (
        <>
          <div className={styles.divider} />
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <path d="M2 4a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 010 1.414l-4.586 4.586a1 1 0 01-1.414 0L3.293 8.293A1 1 0 013 7.586V4z" stroke="currentColor" strokeWidth="1.3"/>
                <circle cx="6" cy="6" r="1" fill="currentColor"/>
              </svg>
              Tags
            </div>
            <div className={styles.tagList}>
              {selected.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        </>
      )}

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1z" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Activity
        </div>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} style={{ background: 'var(--accent-green)' }} />
            <div className={styles.timelineContent}>
              <span className={styles.timelineAction}>Last modified</span>
              <span className={styles.timelineDate}>{formatDate(selected.modified)}</span>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} style={{ background: 'var(--accent-blue)' }} />
            <div className={styles.timelineContent}>
              <span className={styles.timelineAction}>Encrypted at rest</span>
              <span className={styles.timelineDate}>AES-256-GCM</span>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} style={{ background: 'var(--accent-purple)' }} />
            <div className={styles.timelineContent}>
              <span className={styles.timelineAction}>Access control</span>
              <span className={styles.timelineDate}>Role-based</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.encryptBar}>
        <div className={styles.encryptBarLeft}>
          <span className={styles.encryptDot} />
          <span className={styles.encryptLabel}>AES-256 Encrypted</span>
        </div>
        <span className={styles.encryptBadge}>Secure</span>
      </div>
    </div>
  )
}
