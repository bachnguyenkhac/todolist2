import { useState } from 'react'
import { Button, Form, Input, Typography, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/

export default function Login() {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function onFinish(values) {
    try {
      setLoading(true)
      const { email, password } = values
      await Promise.resolve()
      login(email, password)
      message.success('Đăng nhập thành công')
      navigate('/')
    } catch (err) {
      message.error(err.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Typography.Title level={2} style={{ textAlign: 'center' }}>Đăng nhập</Typography.Title>
      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 420, margin: '0 auto' }}>
        <Form.Item label="Email" name="email" rules={[
          { required: true, message: 'Vui lòng nhập email' },
          { pattern: emailRegex, message: 'Email không hợp lệ' }
        ]}>
          <Input placeholder="you@example.com" autoComplete="email" />
        </Form.Item>
        <Form.Item label="Mật khẩu" name="password" rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu' },
          { min: 6, message: 'Tối thiểu 6 ký tự' }
        ]}>
          <Input.Password placeholder="••••••" autoComplete="current-password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>Đăng nhập</Button>
        </Form.Item>
        <Typography.Paragraph style={{ textAlign: 'center' }}>
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </Typography.Paragraph>
      </Form>
    </div>
  )
}


