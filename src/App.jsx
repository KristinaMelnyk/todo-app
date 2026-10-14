import './App.css'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import TodoItem from './components/TodoItem'


function App() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')

    if (saved) return JSON.parse(saved)

      return []
  })
  
  const [newText, setNewText] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])


  const doneCount = todos.filter((todo) => todo.done).length
  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.done
    if (filter === 'done') return todo.done

    return true;
  })

  let emptyMessage = 'There are no tasks yet. Add your first task!'

  if (todos.length > 0 && doneCount === todos.length) emptyMessage = 'All tasks are done!✅ Good job!👍'
  if (filter === 'done' && visibleTodos.length === 0) emptyMessage = 'No done tasks yet.'

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    )
  }

  function editTodo(id, newText) {
    setTodos(
      todos.map((todo) => 
      todo.id === id ? { ...todo, text: newText } : todo)
    )
  }


  function handleSubmit(e) {
    e.preventDefault()

    if (newText.trim() === '') return;

    const newTodo = {
      id: Date.now(),
      text: newText.trim(),
      done: false
    }

    setTodos([...todos, newTodo])
    setNewText('')
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id))
  }
  
  
  return (
    <main className="app">
      <Header />
      <p className="date">{today}</p>
      <form className='add-form' onSubmit={handleSubmit}>
          <input
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        placeholder='What do you need to do?'
        />
        <button type='submit'>Add</button>
          </form>

          <div className='filters'>
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
            <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active</button>
            <button className={filter === 'done' ? 'active' : ''} onClick={() => setFilter('done')}>Done</button>
          </div>

          {visibleTodos.length === 0 ? (
            <p className='empty'>{emptyMessage}</p>
          ) : (
            <ul className="todo-list">
        {/* LESSON 7: show only visibleTodos, based on the selected filter */}
       {visibleTodos.map((todo) => (
        <TodoItem key={todo.id} text={todo.text} done={todo.done} onToggle={() => toggleTodo(todo.id)} onDelete={() => deleteTodo(todo.id)} onEdit={(newText) => editTodo(todo.id, newText)} />
       ))}
        
      </ul>
          )}
      <div className='footer'>
        <p className='counter'>{doneCount} of {todos.length} done</p>
        <div className='progress'>
          <div
            className='progress-bar'
            style={{ width: todos.length === 0 ? '0%' : (doneCount / todos.length) * 100 + '%' }}
          />
        </div>
      </div>
    </main>
  )
}

export default App

