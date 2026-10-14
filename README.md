# My Tasks — React Todo App

A clean, minimal to-do app built with React. It was my first React project, made to learn the fundamentals step by step.

**Live demo:** https://YOUR-LINK.vercel.app

## Features

- Add, edit (double-click), check off and delete tasks
- Filter by **All / Active / Done**
- Progress counter and progress bar
- Tasks are saved in the browser (localStorage), so they survive a page refresh
- Friendly empty states ("All tasks are done. Good job!")
- Automatic dark mode, follows your system setting
- Responsive, works on mobile

## Built with

- **React**: components, props, `useState`, `useEffect`
- **Vite**: development server and build tool
- **CSS**: custom properties (design tokens) for light and dark themes
- **Vercel**: hosting, with automatic deploys from GitHub

## What I learned

- Splitting a UI into reusable components and passing data with props
- Managing state and updating arrays immutably with `map`, `filter` and the spread operator
- Calculating values from state instead of storing them twice (derived state)
- Saving and loading data with `useEffect` and `localStorage`
- Organising a project into files, and deploying it with Git, GitHub and Vercel

## Run it locally

```bash
git clone https://github.com/KristinaMelnyk/todo-app.git
cd todo-app
npm install
npm run dev
```

Then open http://localhost:5173.
