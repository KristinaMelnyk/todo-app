import { useState } from 'react' 

function TodoItem({ text, done, onToggle, onDelete, onEdit }) {
const [isEditing, setIsEditing] = useState(false)
const [draft, setDraft] = useState(text)

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      if (draft.trim() !== '') onEdit(draft.trim())
        setIsEditing(false)
    }

    if (e.key === 'Escape') {
      setDraft(text)
      setIsEditing(false)
    }
  }

  return (
    <li className={done ? 'todo-item is-done' : 'todo-item'}>
      <button className='check' onClick={onToggle} aria-label='Toggle task'>{done ? '✓' : ''}</button>

      {isEditing ? (
        <input
        className='edit-input'
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        />
        ) : (
          <span className='todo-text' onDoubleClick={() => setIsEditing(true)}>{text}</span>
        )}

      <button className='delete-btn' onClick={onDelete} aria-label='Delete task'>×</button>
    </li>
    )
}

export default TodoItem