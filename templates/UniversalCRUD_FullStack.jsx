
import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api/records";
const CATEGORY = "Student";

export default function App() {
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    description: ""
  });

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // GET RECORDS
  const loadItems = async () => {
    try {
      setError("");

      const response = await fetch(`${API}?category=${CATEGORY}`);

      if (!response.ok) {
        throw new Error("Could not load records");
      }

      const data = await response.json();
      setItems(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // POST OR PUT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      category: CATEGORY,
      details: {
        description: form.description
      }
    };

    try {
      const response = await fetch(
        editId ? `${API}/${editId}` : API,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      setForm({ name: "", email: "", description: "" });
      setEditId(null);

      await loadItems();

    } catch (err) {
      setError(err.message);
    }
  };

  // EDIT
  const editItem = (item) => {
    setForm({
      name: item.name,
      email: item.email || "",
      description: item.details?.description || ""
    });

    setEditId(item._id);
  };

  // DELETE
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      await loadItems();

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Student Management — Full Stack
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl shadow grid gap-3 sm:grid-cols-2"
      >

        <input
          className="border p-3 rounded"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          className="border p-3 rounded"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          className="border p-3 rounded sm:col-span-2"
          name="description"
          placeholder="Course / Details"
          value={form.description}
          onChange={handleChange}
        />

        <button className="bg-indigo-600 text-white p-3 rounded sm:col-span-2">
          {editId ? "Update" : "Add"} Student
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ name: "", email: "", description: "" });
            }}
            className="bg-gray-200 p-3 rounded sm:col-span-2"
          >
            Cancel Edit
          </button>
        )}

      </form>

      {error && (
        <p className="text-red-600 mt-4">{error}</p>
      )}

      {loading ? (
        <p className="mt-6">Loading...</p>
      ) : (

        <section className="mt-8 grid gap-3">

          {items.map(item => (
            <article
              key={item._id}
              className="bg-white p-4 rounded-xl shadow flex flex-wrap justify-between gap-3"
            >

              <div>
                <h2 className="font-bold">{item.name}</h2>
                <p>{item.email}</p>
                <p>{item.details?.description}</p>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => editItem(item)}
                  className="bg-amber-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteItem(item._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>

              </div>

            </article>
          ))}

          {items.length === 0 && (
            <p>No students found. Add one above.</p>
          )}

        </section>

      )}

    </main>
  );
}
