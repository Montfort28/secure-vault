const EXT_MAP = {
  pdf:  { icon: '📄', color: '#f85149', label: 'PDF Document' },
  docx: { icon: '📝', color: '#58a6ff', label: 'Word Document' },
  doc:  { icon: '📝', color: '#58a6ff', label: 'Word Document' },
  xlsx: { icon: '📊', color: '#3fb950', label: 'Excel Spreadsheet' },
  xls:  { icon: '📊', color: '#3fb950', label: 'Excel Spreadsheet' },
  png:  { icon: '🖼️', color: '#d29922', label: 'PNG Image' },
  jpg:  { icon: '🖼️', color: '#d29922', label: 'JPEG Image' },
  jpeg: { icon: '🖼️', color: '#d29922', label: 'JPEG Image' },
  svg:  { icon: '🎨', color: '#8b5cf6', label: 'SVG Vector' },
  txt:  { icon: '📃', color: '#8b949e', label: 'Text File' },
  yaml: { icon: '⚙️', color: '#39d0d8', label: 'YAML Config' },
  yml:  { icon: '⚙️', color: '#39d0d8', label: 'YAML Config' },
  json: { icon: '🔧', color: '#39d0d8', label: 'JSON File' },
  ttf:  { icon: '🔤', color: '#8b5cf6', label: 'Font File' },
  log:  { icon: '📋', color: '#8b949e', label: 'Log File' },
  gitignore: { icon: '🚫', color: '#8b949e', label: 'Git Ignore' },
}

export function getFileInfo(name) {
  const parts = name.split('.')
  const ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
  const dotName = name.startsWith('.') ? name.slice(1).toLowerCase() : null
  return EXT_MAP[dotName] || EXT_MAP[ext] || { icon: '📄', color: '#8b949e', label: `${ext.toUpperCase() || 'File'}` }
}
