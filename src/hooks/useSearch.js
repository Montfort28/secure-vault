export function searchTree(nodes, query) {
  const q = query.toLowerCase().trim()
  const expandIds = new Set()

  function walk(items, ancestorIds) {
    let hasMatch = false
    const filtered = []

    for (const node of items) {
      const nameMatch = node.name.toLowerCase().includes(q)

      if (node.type === 'folder') {
        const { filtered: childFiltered, hasMatch: childMatch } = walk(node.children || [], [...ancestorIds, node.id])
        if (nameMatch || childMatch) {
          if (childMatch) {
            expandIds.add(node.id)
            ancestorIds.forEach(id => expandIds.add(id))
          }
          filtered.push({ ...node, children: childFiltered })
          hasMatch = true
        }
      } else {
        if (nameMatch) {
          ancestorIds.forEach(id => expandIds.add(id))
          filtered.push(node)
          hasMatch = true
        }
      }
    }

    return { filtered, hasMatch }
  }

  const { filtered } = walk(nodes, [])
  return { filtered, expandIds }
}
