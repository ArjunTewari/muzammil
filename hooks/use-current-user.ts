'use client'

import { createContext, useContext } from 'react'
import type { AppUser } from '@/lib/users'

// The dashboard layout already resolves the user once (via useAuth) and is
// the single source of truth for the whole authenticated shell. Pages that
// need to know who's logged in should read it from here — NOT call useAuth()
// themselves. (A component that fired its own independent useAuth() call
// once raced the layout's fetch and 401'd, permanently breaking that
// component; this context exists specifically to prevent that class of bug.)
const CurrentUserContext = createContext<AppUser | null>(null)

export const CurrentUserProvider = CurrentUserContext.Provider

export function useCurrentUser(): AppUser | null {
  return useContext(CurrentUserContext)
}
