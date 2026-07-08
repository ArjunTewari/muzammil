'use client'

import { useEffect, useState } from 'react'
import { findUser, getUserById, type AppUser } from '@/lib/users'

const STORAGE_KEY = 'maestro-session'

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const found = getUserById(stored)
      setUser(found)
    }
    setReady(true)
  }, [])

  function login(username: string, password: string): boolean {
    const found = findUser(username.trim().toLowerCase(), password)
    if (!found) return false
    localStorage.setItem(STORAGE_KEY, found.id)
    setUser(found)
    return true
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return { user, ready, login, logout }
}
