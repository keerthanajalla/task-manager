import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTasks, createTask, updateTask, deleteTask } from '../services/api'
import { toast } from 'react-toastify'

export default function TasksPage() {
  const [tasks, setTasks]     = useState([])
  const [form, setForm]       = useState({ title: '', description: '', status: 'todo' })
  const [editId, setEditId]   = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate              = useNavigate()
  const user                  = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    try {
      const res = await getTasks()
      setTasks(res.data)
    } catch (err) {
      toast.error('Failed to load tasks')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editId) {
        await updateTask(editId, form)
        toast.success('Task updated!')
        setEditId(null)
      } else {
        await createTask(form)
        toast.success('Task created!')
      }
      setForm({ title: '', description: '', status: 'todo' })
      fetchTasks()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Action failed')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (task) => {
    setEditId(task.id)
    setForm({ title: task.title, description: task.description || '', status: task.status })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await deleteTask(id)
      toast.success('Task deleted!')
      fetchTasks()
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const getBadge = (status) => {
    if (status === 'todo')        return <span className="badge badge-todo">Todo</span>
    if (status === 'in-progress') return <span className="badge badge-progress">In Progress</span>
    if (status === 'done')        return <span className="badge badge-done">Done</span>
  }

  return (
    <div>
      <div className="navbar">
        <h1>Task Manager</h1>
        <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
          <span>Welcome, {user.username}</span>
          <button className="btn" style={{background:'white', color:'#4f46e5'}} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        {/* Task Form */}
        <div className="card">
          <h3 style={{marginBottom:'16px'}}>{editId ? 'Edit Task' : 'Add New Task'}</h3>
          <form onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              required
            />
            <textarea
              className="input"
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              rows={3}
            />
            <select
              className="input"
              value={form.status}
              onChange={(e) => setForm({...form, status: e.target.value})}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <div style={{display:'flex', gap:'8px'}}>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : editId ? 'Update Task' : 'Add Task'}
              </button>
              {editId && (
                <button type="button" className="btn btn-warning"
                  onClick={() => { setEditId(null); setForm({ title:'', description:'', status:'todo' }) }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Task List */}
        <div className="task-grid">
          {tasks.length === 0 && (
            <div className="card" style={{textAlign:'center', color:'#888'}}>
              No tasks yet. Add one above!
            </div>
          )}
          {tasks.map(task => (
            <div className="card" key={task.id}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div>
                  <h4 style={{marginBottom:'6px'}}>{task.title}</h4>
                  {task.description && (
                    <p style={{color:'#666', fontSize:'14px', marginBottom:'8px'}}>{task.description}</p>
                  )}
                  {getBadge(task.status)}
                </div>
                <div style={{display:'flex', gap:'8px'}}>
                  <button className="btn btn-warning" onClick={() => handleEdit(task)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}