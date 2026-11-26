
import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api/records";
const CATEGORY = "Task";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // GET TASKS
  const loadTasks = async () => {
    try {
      const response = await fetch(
        `${API}?category=${CATEGORY}`
      );

      if (!response.ok) {
        throw new Error("Could not load tasks");
      }

      setTasks(await response.json());

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // ADD TASK
  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: title.trim(),
          category: CATEGORY,
          details: {
            done: false
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add task");
      }

      setTitle("");
      await loadTasks();

    } catch (err) {
      setError(err.message);
    }
  };

  // UPDATE TASK STATUS
  const toggleTask = async (task) => {
    try {
      const response = await fetch(`${API}/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          details: {
            done: !task.details?.done
          }
        })
      });

      if (!response.ok) {
        throw new Error("Could not update task");
      }

      await loadTasks();

    } catch (err) {
      setError(err.message);
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Could not delete task");
      }

      await loadTasks();

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Todo List — Full Stack
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

      {error && (
        <p className="text-red-600 mb-3">{error}</p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (

        <div className="grid gap-3">

          {tasks.map(task => (
            <div
              key={task._id}
              className="bg-white p-4 rounded-xl shadow flex items-center gap-3"
            >

              <input
                type="checkbox"
                checked={Boolean(task.details?.done)}
                onChange={() => toggleTask(task)}
              />

              <span className={
                task.details?.done
                  ? "line-through text-gray-400 flex-1"
                  : "flex-1"
              }>
                {task.name}
              </span>

              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-600"
              >
                Delete
              </button>

            </div>
          ))}

        </div>

      )}

      {!loading && tasks.length === 0 && (
        <p>No tasks yet.</p>
      )}

    </main>
  );
}
