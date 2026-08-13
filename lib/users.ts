export type UserRole = 'master' | 'account-manager' | 'research' | 'creative' | 'compliance' | 'finance' | 'content-ops'

export interface AppUser {
  id: string
  username: string
  password: string
  name: string
  role: UserRole
  title: string
  initials: string
  accentColor: string
  teamOrder: number
}

export const USERS: AppUser[] = [
  {
    id: 'founder',
    username: 'founder',
    password: 'supra2026',
    name: 'Founder',
    role: 'master',
    title: 'Founder & CEO',
    initials: 'FR',
    accentColor: '#C9A85C',
    teamOrder: 0,
  },
  {
    id: 'priya',
    username: 'kriti',
    password: 'supra123',
    name: 'Kriti',
    role: 'account-manager',
    title: 'Account Manager',
    initials: 'KR',
    accentColor: '#60a5fa',
    teamOrder: 1,
  },
  {
    id: 'rohan',
    username: 'trisha',
    password: 'supra123',
    name: 'Trisha',
    role: 'research',
    title: 'Research Analyst',
    initials: 'TR',
    accentColor: '#34d399',
    teamOrder: 2,
  },
  {
    id: 'divya',
    username: 'dipin',
    password: 'supra123',
    name: 'Dipin',
    role: 'creative',
    title: 'Creative Lead',
    initials: 'DI',
    accentColor: '#a78bfa',
    teamOrder: 3,
  },
  {
    id: 'arjit',
    username: 'vikas',
    password: 'supra123',
    name: 'Vikas',
    role: 'compliance',
    title: 'Compliance Officer',
    initials: 'VI',
    accentColor: '#fb923c',
    teamOrder: 4,
  },
  {
    id: 'sneha',
    username: 'mupen',
    password: 'supra123',
    name: 'Mupen',
    role: 'finance',
    title: 'Finance Manager',
    initials: 'MU',
    accentColor: '#C9A85C',
    teamOrder: 5,
  },
]

export function findUser(username: string, password: string): AppUser | null {
  return USERS.find((u) => u.username === username && u.password === password) ?? null
}

export function getUserById(id: string): AppUser | null {
  return USERS.find((u) => u.id === id) ?? null
}
