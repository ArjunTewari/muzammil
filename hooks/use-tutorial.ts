'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'maestro-tutorial-done'

export function useTutorial() {
  const [show, setShow] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY)
    if (!done) setShow(true)
    setReady(true)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setShow(false)
  }

  function restart() {
    localStorage.removeItem(STORAGE_KEY)
    setShow(true)
  }

  return { show, ready, dismiss, restart }
}
