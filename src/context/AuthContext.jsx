import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const USERS_KEY = 'users'

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function todosKeyFor(email) {
  return `todos:${email}`
}

function readTodos(email) {
  try {
    const raw = localStorage.getItem(todosKeyFor(email))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeTodos(email, todos) {
  localStorage.setItem(todosKeyFor(email), JSON.stringify(todos))
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(readUsers)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('currentUser')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [todos, setTodosState] = useState(() => (currentUser ? readTodos(currentUser.email) : []))

  useEffect(() => {
    writeUsers(users)
  }, [users])

  useEffect(() => {
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser))
    else localStorage.removeItem('currentUser')
  }, [currentUser])

  // Load todos when user changes
  useEffect(() => {
    if (currentUser) setTodosState(readTodos(currentUser.email))
    else setTodosState([])
  }, [currentUser])

  // Persist todos for current user
  useEffect(() => {
    if (currentUser) writeTodos(currentUser.email, todos)
  }, [todos, currentUser])

  const value = useMemo(() => {
    return {
      currentUser,
      isAuthenticated: !!currentUser,
      register(email, password) {
        const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase())
        if (exists) throw new Error('Email đã tồn tại')
        const user = { email, password }
        const next = [...users, user]
        setUsers(next)
        setCurrentUser({ email })
      },
      login(email, password) {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
        if (!user || user.password !== password) throw new Error('Email hoặc mật khẩu không đúng')
        setCurrentUser({ email: user.email })
      },
      logout() {
        setCurrentUser(null)
      },
      todos,
      setTodos(updater) {
        if (!currentUser) return
        setTodosState(prev => (typeof updater === 'function' ? updater(prev) : updater))
      }
    }
  }, [users, currentUser, todos])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


