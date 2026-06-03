import { useState, useEffect, useCallback } from 'react'

const KEY = 'emdad-wishlist'

export function useWishlist() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items])

  const toggle = useCallback((img) => {
    setItems(prev => {
      const exists = prev.some(i => i.src === img.src)
      return exists ? prev.filter(i => i.src !== img.src) : [...prev, img]
    })
  }, [])

  const isSaved = useCallback((src) => items.some(i => i.src === src), [items])
  const clear = useCallback(() => setItems([]), [])

  return { items, toggle, isSaved, count: items.length, clear }
}
