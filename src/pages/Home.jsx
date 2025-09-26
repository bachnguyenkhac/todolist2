import { useState } from 'react'
import { Button, Input, List, Typography, Space, Checkbox, message, Modal } from 'antd'
import { useAuth } from '../context/AuthContext.jsx'

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function Home() {
  const { currentUser, todos, setTodos, logout } = useAuth()
  const [newText, setNewText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')

  const remaining = todos.filter(t => !t.completed).length

  function sync(updater) {
    try {
      setTodos(updater)
    } catch {
      message.error('Không thể lưu todo')
    }
  }

  function addTodo() {
    const text = newText.trim()
    if (!text) return
    const exists = todos.some(t => t.text.trim().toLowerCase() === text.toLowerCase())
    if (exists) {
      message.warning('Công việc đã tồn tại, không được trùng nhau')
      return
    }
    sync(prev => [{ id: generateId(), text, completed: false }, ...prev])
    setNewText('')
    message.success('Đã thêm công việc')
  }

  function toggle(id) {
    sync(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function startEdit(id, text) {
    setEditingId(id)
    setEditingText(text)
  }

  function commitEdit(id) {
    const text = editingText.trim()
    if (!text) {
      // empty => ask to delete
      return Modal.confirm({
        title: 'Xóa công việc?',
        content: 'Nội dung trống sẽ xóa công việc này. Bạn có chắc không?',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: () => {
          sync(prev => prev.filter(t => t.id !== id))
          message.success('Đã xóa công việc')
          setEditingId(null)
          setEditingText('')
        }
      })
    }

    const exists = todos.some(t => t.id !== id && t.text.trim().toLowerCase() === text.toLowerCase())
    if (exists) {
      message.warning('Công việc đã tồn tại, không được trùng nhau')
      return
    }

    sync(prev => prev.map(t => (t.id === id ? { ...t, text } : t)))
    setEditingId(null)
    setEditingText('')
    message.success('Đã cập nhật công việc')
  }

  function remove(id) {
    const item = todos.find(t => t.id === id)
    Modal.confirm({
      title: 'Xóa công việc?',
      content: `Bạn có chắc muốn xóa: "${item?.text}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        sync(prev => prev.filter(t => t.id !== id))
        message.success('Đã xóa công việc')
      }
    })
  }

  function clearCompleted() {
    const count = todos.filter(t => t.completed).length
    if (!count) return
    Modal.confirm({
      title: 'Xóa việc đã hoàn thành?',
      content: `Bạn có chắc muốn xóa ${count} công việc đã xong?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        sync(prev => prev.filter(t => !t.completed))
        message.success('Đã xóa các công việc đã xong')
      }
    })
  }

  return (
    <div className="home">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Xin chào, {currentUser?.email}</Typography.Title>
        <Button onClick={logout}>Đăng xuất</Button>
      </div>

      <Space.Compact style={{ width: '100%', marginBottom: 12 }}>
        <Input
          placeholder="Thêm công việc..."
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onPressEnter={addTodo}
        />
        <Button type="primary" onClick={addTodo}>Thêm</Button>
      </Space.Compact>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Typography.Text type="secondary">Còn lại: {remaining}</Typography.Text>
        <Button onClick={clearCompleted}>Xóa việc đã xong</Button>
      </div>

      <List
        bordered
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item
            actions={[
              editingId === todo.id ? (
                <Space key="edit">
                  <Button type="primary" onClick={() => commitEdit(todo.id)}>Lưu</Button>
                  <Button onClick={() => { setEditingId(null); setEditingText('') }}>Hủy</Button>
                </Space>
              ) : (
                <Space key="actions">
                  <Button onClick={() => startEdit(todo.id, todo.text)}>Sửa</Button>
                  <Button danger onClick={() => remove(todo.id)}>Xóa</Button>
                </Space>
              )
            ]}
          >
            <Space>
              <Checkbox checked={todo.completed} onChange={() => toggle(todo.id)} />
              {editingId === todo.id ? (
                <Input
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  onPressEnter={() => commitEdit(todo.id)}
                />
              ) : (
                <Typography.Text delete={todo.completed}>{todo.text}</Typography.Text>
              )}
            </Space>
          </List.Item>
        )}
      />
    </div>
  )
}


