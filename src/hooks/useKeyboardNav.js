import { useCallback } from 'react'

export function flattenVisible(nodes, expanded) {
  const result = []
  function walk(items, depth) {
    for (const node of items) {
      result.push({ ...node, depth })
      if (node.type === 'folder' && expanded.has(node.id) && node.children?.length) {
        walk(node.children, depth + 1)
      }
    }
  }
  walk(nodes, 0)
  return result
}

function findParentIndex(nodes, childIndex) {
  const childDepth = nodes[childIndex]?.depth
  if (childDepth === undefined || childDepth === 0) return -1

  for (let index = childIndex - 1; index >= 0; index -= 1) {
    if (nodes[index].depth === childDepth - 1) return index
  }

  return -1
}

export function useKeyboardNav({ flatNodes, focusedId, setFocusedId, expanded, toggleExpand, setSelected }) {
  return useCallback((e) => {
    const idx = flatNodes.findIndex(n => n.id === focusedId)
    if (idx === -1 && flatNodes.length) {
      setFocusedId(flatNodes[0].id)
      return
    }
    const node = flatNodes[idx]

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (idx < flatNodes.length - 1) setFocusedId(flatNodes[idx + 1].id)
        break
      case 'ArrowUp':
        e.preventDefault()
        if (idx > 0) setFocusedId(flatNodes[idx - 1].id)
        break
      case 'ArrowRight':
        e.preventDefault()
        if (node?.type !== 'folder' || !node.children?.length) break
        if (!expanded.has(node.id)) {
          toggleExpand(node.id)
        } else if (flatNodes[idx + 1]?.depth === node.depth + 1) {
          setFocusedId(flatNodes[idx + 1].id)
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (node?.type === 'folder' && node.children?.length && expanded.has(node.id)) {
          toggleExpand(node.id)
        } else {
          const parentIndex = findParentIndex(flatNodes, idx)
          if (parentIndex !== -1) setFocusedId(flatNodes[parentIndex].id)
        }
        break
      case 'Enter':
        e.preventDefault()
        if (node?.type === 'file') setSelected(node)
        else if (node?.type === 'folder' && node.children?.length) toggleExpand(node.id)
        break
    }
  }, [flatNodes, focusedId, setFocusedId, expanded, toggleExpand, setSelected])
}
