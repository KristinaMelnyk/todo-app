# Learning React — Todo App

## Getting started (once)

1. Open Terminal and go to this folder:
   `cd ~/Documents/react-learning/todo-app`
2. Install the packages: `npm install`
3. Start the dev server: `npm run dev`
4. Open the link it prints (usually http://localhost:5173).
   The page reloads by itself every time you save a file.

Open the folder in VS Code: `code .`

## The plan

| # | Lesson | React concept |
|---|--------|---------------|
| 1 | Your first component | Components, JSX, `{ }` |
| 2 | Passing data | Props |
| 3 | Rendering a list | `.map()` and `key` |
| 4 | Checking off tasks | `useState`, events |
| 5 | Adding tasks | Forms, controlled inputs |
| 6 | Deleting and editing | Updating arrays immutably |
| 7 | Filters (All / Active / Done) | Derived state |
| 8 | Saving to the browser | `useEffect`, localStorage |
| 9 | Splitting into files | Project structure |
| 10 | Publishing online | `npm run build`, deploy |

---

## Lesson 1 — Your first component

**Files to look at:** `src/main.jsx` → `src/App.jsx`

**What to notice**

- `main.jsx` puts `<App />` on the page. Everything starts there.
- A component is a function that **returns JSX**. Its name starts with a capital letter.
- You use a component like an HTML tag: `<Header />`.
- JSX uses `className` instead of `class`.
- `{ today }` inserts a JavaScript value into the markup.
- A component returns **one** parent element (wrap siblings in a `<div>` or `<>...</>`).

**Your exercise**

1. In `App.jsx`, under `Header`, create a component called `TodoItem` that returns:
   ```jsx
   <li className="todo-item">Learn about components</li>
   ```
2. Replace the three `<li>` lines inside `<ul>` with three `<TodoItem />`.
3. Save and look at the browser. You'll see the same text three times. That's the
   problem Lesson 2 (props) solves.

**Bonus:** make a `Footer` component that shows "3 tasks" and add it under the list.

When you're done, tell Claude "lesson 1 done" and we'll check it together.

---

## Lesson 2 — Passing data with props

**The problem:** `TodoItem` always shows "Drink water". A component is more useful when
the parent can tell it *what* to show.

**The idea:** you pass data to a component like an HTML attribute. These are called **props**.

```jsx
<TodoItem text="Read a book" />
```

The component receives all its props as one object, its first parameter:

```jsx
function TodoItem(props) {
  return <li className="todo-item">{props.text}</li>
}
```

Most people "destructure" it to take out just what they need. It does the same thing:

```jsx
function TodoItem({ text }) {
  return <li className="todo-item">{text}</li>
}
```

**Rules to remember**

- Strings go in quotes: `text="Read a book"`.
- Anything else goes in curly braces: `done={true}`, `priority={2}`.
- Props flow **one way**: from parent (App) down to child (TodoItem).
- A component must never change its own props. They're read-only.

**Your exercise**

1. Change `TodoItem` so it takes a `text` prop and shows it.
2. In `App`, give each `<TodoItem />` its own text: Read a book, Drink water, Learn React.
3. Add a second prop, `done`, and pass `done={true}` to one task.
   Inside `TodoItem`, show ✅ before the text when `done` is true and ⬜️ when it's false.
   Hint: `{done ? '✅' : '⬜️'}` (this is a "ternary": *condition ? if-true : if-false*).

**Bonus:** if a task is done, give the `<li>` a line-through. Hint:
`style={{ textDecoration: done ? 'line-through' : 'none' }}`
(the double braces are: `{ }` for JavaScript, then `{ }` for the object inside).

---

## Lesson 3 — Rendering a list with `.map()`

**The problem:** right now every task is typed by hand in the JSX. A real app keeps tasks
as **data** (an array) and turns that data into components automatically.

**Step 1: store tasks as data.** Put this inside `App`, above the `return`:

```jsx
const todos = [
  { id: 1, text: 'Drink water', done: false },
  { id: 2, text: 'Read a book', done: true },
  { id: 3, text: 'Learn React', done: false },
]
```

Each task is an **object** with an `id`, `text` and `done`.

**Step 2: turn the array into components.** `.map()` goes through an array and returns a new
array. React can display an array of JSX directly:

```jsx
<ul className="todo-list">
  {todos.map((todo) => (
    <TodoItem key={todo.id} text={todo.text} done={todo.done} />
  ))}
</ul>
```

Read it as: "for each `todo` in `todos`, make a `<TodoItem />`".

**What is `key`?** React needs a unique `key` on each item in a list so it can tell them apart
when the list changes (adding, deleting, reordering). Use something unique and stable,
like an `id`. `key` is special: React uses it, and it is **not** passed to your component as a prop.
If you forget it, the console shows a warning: *"Each child in a list should have a unique key prop."*

**Your exercise**

1. Create the `todos` array inside `App`.
2. Replace your three `<TodoItem />` lines with one `todos.map(...)`.
3. Add two more tasks to the array, just in the data, and watch them appear.
4. Remove `key` for a moment, open the console (Cmd + Option + J) and read the warning. Then put it back.

**Bonus:** under the list, show how many tasks there are, e.g. "5 tasks".
Hint: arrays have a `.length`. Even better: show "2 of 5 done".
Hint: `todos.filter((todo) => todo.done).length`

---

## Lesson 4 — Checking off tasks with `useState`

**The problem:** try changing `done` with a click. A normal variable like `const todos = [...]`
can't do it: when a normal variable changes, React doesn't know, so the page doesn't update.
Also, every time `App` runs, `todos` is created again from scratch.

**The idea: state.** State is data that React **remembers** between renders. When you
update it, React re-runs your component and updates the page.

```jsx
import { useState } from 'react'   // at the top of the file

const [todos, setTodos] = useState([
  { id: 1, text: 'Drink water', done: true },
  // ...
])
```

`useState` gives you two things:
- `todos`, the current value (read it)
- `setTodos`, a function to change it (never change `todos` directly!)

**Events.** React listens for clicks with `onClick`, and you give it a function:

```jsx
<li onClick={() => console.log('clicked!')}>...</li>
```

Note: `onClick={doSomething}` passes the function. `onClick={doSomething()}` would
call it immediately while rendering, which is a common mistake.

**Who changes the data?** The state lives in `App`, but the click happens in `TodoItem`.
So `App` gives `TodoItem` a **function as a prop**, and `TodoItem` calls it when clicked:

```jsx
// in App
function toggleTodo(id) {
  setTodos(
    todos.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    )
  )
}

<TodoItem key={todo.id} text={todo.text} done={todo.done} onToggle={() => toggleTodo(todo.id)} />

// in TodoItem
function TodoItem({ text, done, onToggle }) {
  return <li className="todo-item" onClick={onToggle}>...</li>
}
```

**What `toggleTodo` does, line by line:**
- `todos.map(...)` makes a **new** array (we never edit the old one).
- For the clicked task (`todo.id === id`), it makes a **new object**: `{ ...todo, done: !todo.done }`.
  `...todo` copies all fields, then `done` is overwritten with the opposite value (`!` means "not").
- Every other task is returned unchanged.
- `setTodos(newArray)` tells React "here's the new data, please re-render".

Why a new array instead of `todo.done = true`? React compares old and new. If you edit the
same array in place, React thinks nothing changed and the page doesn't update.

**Your exercise**

1. Import `useState` and turn `todos` into state.
2. Write `toggleTodo(id)` inside `App`.
3. Pass `onToggle` to each `TodoItem` and use it in `onClick`.
4. Click tasks and watch ✅ / ⬜️ switch.

**Bonus:** add `cursor: pointer` to `.todo-item` in `App.css`, and show "2 of 5 done" under the list.
It will update by itself when you click, because it's computed from state.

---

## Lesson 5 — Adding tasks with a form

**The goal:** a text field and an "Add" button. Type a task, press Enter or click Add,
and it appears in the list.

**Controlled input.** In React, the text in an input is usually kept in **state**.
The input shows the state, and every keystroke updates the state:

```jsx
const [newText, setNewText] = useState('')

<input
  value={newText}
  onChange={(e) => setNewText(e.target.value)}
  placeholder="What do you need to do?"
/>
```

- `value={newText}`: the input always shows what's in state.
- `onChange` runs on every keystroke. `e` is the **event**; `e.target` is the input;
  `e.target.value` is what's typed in it.
- This is called a *controlled input*: React is in control of the text, so you can read it,
  clear it or check it anytime.

**The form.** Wrapping the input in a `<form>` means Enter works automatically:

```jsx
function handleSubmit(e) {
  e.preventDefault()          // stop the browser from reloading the page
  // 1. ignore empty text
  // 2. make a new todo object
  // 3. setTodos([...todos, newTodo])
  // 4. clear the input
}

<form className="add-form" onSubmit={handleSubmit}>
  <input ... />
  <button type="submit">Add</button>
</form>
```

**Adding to an array without editing it.** Like in lesson 4, we make a **new** array:
`[...todos, newTodo]` means "all the old todos, plus `newTodo` at the end".

**A unique id.** Each new task needs an `id` for its `key`. A simple way: `Date.now()`
(the current time in milliseconds, different every time).

**Your exercise**

1. Add `newText` state.
2. Add the `<form>` with the input and button, above the `<ul>`.
3. Write `handleSubmit` and fill in the 4 steps from the comments.
   - Empty check: `if (newText.trim() === '') return`
     (`.trim()` removes spaces, so "   " counts as empty)
   - New task: `{ id: Date.now(), text: newText.trim(), done: false }`
4. Add a few tasks. Then refresh the page: they disappear! That's normal.
   State lives in memory only. Lesson 8 will save them.

**Bonus:** style the form in `App.css`: input and button side by side
(`display: flex; gap: 8px;` on `.add-form`), input takes the remaining space (`flex: 1`).

---

## Lesson 6 — Deleting tasks

**The goal:** each task gets a ✕ button that removes it.

**Removing from an array without editing it.** `.filter()` makes a **new** array that keeps
only the items where your test returns `true`:

```jsx
function deleteTodo(id) {
  setTodos(todos.filter((todo) => todo.id !== id))
}
```

Read it as: "keep every todo whose id is **not** the one I clicked".

So far you know three ways to change an array in state, all without touching the original:

| Want to... | Use |
|---|---|
| add | `[...todos, newTodo]` |
| change one | `todos.map(...)` |
| remove one | `todos.filter(...)` |

**The button.** Pass `onDelete` to `TodoItem`, just like `onToggle`:

```jsx
function TodoItem({ text, done, onToggle, onDelete }) {
  return (
    <li className="todo-item">
      <span onClick={onToggle}>{done ? '✅' : '⬜️'} {text}</span>
      <button className="delete-btn" onClick={onDelete}>✕</button>
    </li>
  )
}
```

Notice `onClick={onToggle}` moved from the `<li>` to a `<span>`. Why? If it stayed on the `<li>`,
clicking ✕ would **also** toggle the task, because clicks "bubble up" from the button to
its parent `<li>`. Putting each click handler on its own element keeps them separate.

**Your exercise**

1. Write `deleteTodo(id)` in `App`.
2. Pass `onDelete={() => deleteTodo(todo.id)}` to each `TodoItem`.
3. Update `TodoItem` with the `<span>` and the ✕ button.
4. Style it: push the button to the right with `margin-left: auto` on `.delete-btn`,
   and remove its default border/background.

**Bonus — edit a task:** double-click a task's text to rename it.
Hint: `TodoItem` can have its **own** state: `const [isEditing, setIsEditing] = useState(false)`.
When `isEditing` is true, show an `<input>` instead of the text. On Enter, call an `onEdit(newText)`
prop, and in `App`, update that task with `.map()`, just like `toggleTodo`.

---

## Lesson 7 — Filters: All / Active / Done

**The goal:** three buttons above the list. "Active" shows only unfinished tasks,
"Done" only finished ones, "All" everything. Plus a counter: "2 of 5 done".

**The big idea: derived state.** Don't store things you can **calculate**.
You only need to remember *which filter is selected*:

```jsx
const [filter, setFilter] = useState('all')   // 'all' | 'active' | 'done'
```

The visible list is **calculated** from `todos` + `filter` on every render, as a normal variable:

```jsx
const visibleTodos = todos.filter((todo) => {
  if (filter === 'active') return !todo.done
  if (filter === 'done') return todo.done
  return true                    // 'all'
})
```

Then `.map()` over `visibleTodos` instead of `todos`.

Why not keep a second state like `const [visibleTodos, setVisibleTodos]`? Because then you'd
have to remember to update it every time you add, toggle, edit or delete. Forget once and
the screen is wrong. A calculated value is **always** in sync, for free.

Same for the counter. It's just math on `todos`:

```jsx
const doneCount = todos.filter((todo) => todo.done).length
// in JSX: <p>{doneCount} of {todos.length} done</p>
```

**The buttons:**

```jsx
<div className="filters">
  <button onClick={() => setFilter('all')}>All</button>
  <button onClick={() => setFilter('active')}>Active</button>
  <button onClick={() => setFilter('done')}>Done</button>
</div>
```

**Your exercise**

1. Add `filter` state.
2. Calculate `visibleTodos` and use it in the `.map()`.
3. Add the three buttons between the form and the list.
4. Add the "X of Y done" counter under the list.
5. Test: mark a task done while on "Active". It should disappear from the view.

**Bonus 1:** highlight the selected button. Use a conditional class:
`className={filter === 'all' ? 'active' : ''}`, then style `.filters button.active` in CSS.

**Bonus 2:** when a filter has no tasks, show a message instead of an empty list,
e.g. "Nothing here 🎉". Hint: `visibleTodos.length === 0 ? <p>...</p> : <ul>...</ul>`
