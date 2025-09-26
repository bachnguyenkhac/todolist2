import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { ConfigProvider, Layout, Menu, theme } from 'antd'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext.jsx'

export default function App() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Header style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ color: '#fff', fontWeight: 600, marginRight: 24 }}>Vite Todos</div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectable={false}
            items={
              isAuthenticated
                ? [
                    { key: 'home', label: <Link to="/">Home</Link> },
                    { key: 'logout', label: <span onClick={logout}>Đăng xuất</span> }
                  ]
                : [
                    { key: 'login', label: <Link to="/login">Đăng nhập</Link> },
                    { key: 'register', label: <Link to="/register">Đăng ký</Link> }
                  ]
            }
          />
        </Layout.Header>
        <Layout.Content style={{ padding: 24 }}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  )
}


