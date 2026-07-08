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
    id: 'muzammil',
    username: 'muzammil',
    password: 'maestro2026',
    name: 'Muzammil Rashid',
    role: 'master',
    title: 'Founder & CEO',
    initials: 'MR',
    accentColor: '#C9A85C',
    teamOrder: 0,
  },
  {
    id: 'priya',
    username: 'priya',
    password: 'ziworks123',
    name: 'Priya Mehta',
    role: 'account-manager',
    title: 'Account Manager',
    initials: 'PM',
    accentColor: '#60a5fa',
    teamOrder: 1,
  },
  {
    id: 'rohan',
    username: 'rohan',
    password: 'ziworks123',
    name: 'Rohan Sharma',
    role: 'research',
    title: 'Research Analyst',
    initials: 'RS',
    accentColor: '#34d399',
    teamOrder: 2,
  },
  {
    id: 'divya',
    username: 'divya',
    password: 'ziworks123',
    name: 'Divya Nair',
    role: 'creative',
    title: 'Creative Lead',
    initials: 'DN',
    accentColor: '#a78bfa',
    teamOrder: 3,
  },
  {
    id: 'arjit',
    username: 'arjit',
    password: 'ziworks123',
    name: 'Arjit Singh',
    role: 'compliance',
    title: 'Compliance Officer',
    initials: 'AS',
    accentColor: '#fb923c',
    teamOrder: 4,
  },
  {
    id: 'sneha',
    username: 'sneha',
    password: 'ziworks123',
    name: 'Sneha Patel',
    role: 'finance',
    title: 'Finance Manager',
    initials: 'SP',
    accentColor: '#C9A85C',
    teamOrder: 5,
  },
  {
    id: 'karan',
    username: 'karan',
    password: 'ziworks123',
    name: 'Karan Malhotra',
    role: 'content-ops',
    title: 'Content & Production',
    initials: 'KM',
    accentColor: '#f472b6',
    teamOrder: 6,
  },
]

export function findUser(username: string, password: string): AppUser | null {
  return USERS.find((u) => u.username === username && u.password === password) ?? null
}

export function getUserById(id: string): AppUser | null {
  return USERS.find((u) => u.id === id) ?? null
}
