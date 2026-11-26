
import React, { useState } from "react";

const initialItems = [
  { id: 1, name: "Aarav Sharma", email: "aarav@example.com", description: "IT Student" },
  { id: 2, name: "Diya Patel", email: "diya@example.com", description: "Computer Student" }
];

export default function App() {
  const [items, setItems] = useState(initialItems);

  const [form, setForm] = useState({
    name: "",
    email: "",
    description: ""
  });

  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    if (editId) {
      setItems(items.map(item =>
        item.id === editId
          ? { ...form, id: editId }
          : item
      ));

      setEditId(null);
    } else {
      setItems([
        ...items,
        { ...form, id: Date.now() }
      ]);
    }

    setForm({ name: "", email: "", description: "" });
  };

  const editItem = (item) => {
    setForm({
      name: item.name,
      email: item.email,
      description: item.description
    });

    setEditId(item.id);
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <main className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Student Management
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

      </form>

      <section className="mt-8 grid gap-3">

        {items.map(item => (
          <article
            key={item.id}
            className="bg-white p-4 rounded-xl shadow flex flex-wrap justify-between gap-3"
          >

            <div>
              <h2 className="font-bold">{item.name}</h2>
              <p className="text-gray-600">{item.email}</p>
              <p>{item.description}</p>
            </div>

            <div className="flex gap-2">

              <button
                onClick={() => editItem(item)}
                className="bg-amber-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteItem(item.id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>

            </div>

          </article>
        ))}

      </section>

    </main>
  );
}
