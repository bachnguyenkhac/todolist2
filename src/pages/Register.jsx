import { useState } from 'react'
import { Button, Form, Input, Typography, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/
// Password: at least 6, must include letter and number
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/

export default function Register() {
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function onFinish(values) {
    try {
      setLoading(true)
      const { email, password, confirm } = values
      if (password !== confirm) throw new Error('Mật khẩu xác nhận không khớp')
      await Promise.resolve()
      register(email, password)
      message.success('Đăng ký thành công')
      navigate('/')
    } catch (err) {
      message.error(err.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Typography.Title level={2} style={{ textAlign: 'center' }}>Đăng ký</Typography.Title>
      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 420, margin: '0 auto' }}>
        <Form.Item label="Email" name="email" rules={[
          { required: true, message: 'Vui lòng nhập email' },
          { pattern: emailRegex, message: 'Email không hợp lệ' }
        ]}>
          <Input placeholder="you@example.com" autoComplete="email" />
        </Form.Item>
        <Form.Item label="Mật khẩu" name="password" rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu' },
          { pattern: passwordRegex, message: 'Ít nhất 6 ký tự, gồm chữ và số' }
        ]} hasFeedback>
          <Input.Password placeholder="••••••" autoComplete="new-password" />
        </Form.Item>
        <Form.Item label="Xác nhận mật khẩu" name="confirm" dependencies={["password"]} hasFeedback rules={[
          { required: true, message: 'Vui lòng xác nhận mật khẩu' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) return Promise.resolve()
              return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
            }
          })
        ]}>
          <Input.Password placeholder="••••••" autoComplete="new-password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>Đăng ký</Button>
        </Form.Item>
        <Typography.Paragraph style={{ textAlign: 'center' }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </Typography.Paragraph>
      </Form>
    </div>
  )
}


