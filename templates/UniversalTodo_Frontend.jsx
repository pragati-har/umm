
import React, { useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete practical journal", done: false },
    { id: 2, title: "Revise React hooks", done: true }
  ]);

  const [title, setTitle] = useState("");

  // ADD TASK
  const addTask = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: title.trim(),
        done: false
      }
    ]);

    setTitle("");
  };

  // TOGGLE TASK
  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, done: !task.done }
        : task
    ));
  };

  // DELETE TASK
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <main className="max-w-2xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        My Todo List
      </h1>

      <form
        onSubmit={addTask}
        className="flex gap-2 mb-6"
      >

        <input
          className="border bg-white p-3 rounded flex-1"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter a task"
        />

        <button className="bg-indigo-600 text-white px-5 rounded">
          Add
        </button>

      </form>

      <div className="grid gap-3">

        {tasks.map(task => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-xl shadow flex items-center gap-3"
          >

            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
            />

            <span className={
              task.done
                ? "line-through text-gray-400 flex-1"
                : "flex-1"
            }>
              {task.title}
            </span>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-600"
            >
              Delete
            </button>

          </div>
        ))}

      </div>

    </main>
  );
}
