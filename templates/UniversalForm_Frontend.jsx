
import React, { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    message: ""
  });

  const [submissions, setSubmissions] = useState([]);

  // HANDLE INPUT
  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // SUBMIT FORM
  const submit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and email are required");
      return;
    }

    setSubmissions([
      { ...form, id: Date.now() },
      ...submissions
    ]);

    setForm({
      name: "",
      email: "",
      course: "",
      message: ""
    });

    alert("Form submitted successfully!");
  };

  return (
    <main className="max-w-2xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Registration Form
      </h1>

      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl shadow grid gap-4"
      >

        <input
          className="border p-3 rounded"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={update}
          required
        />

        <input
          className="border p-3 rounded"
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={update}
          required
        />

        <input
          className="border p-3 rounded"
          name="course"
          placeholder="Course / Department"
          value={form.course}
          onChange={update}
        />

        <textarea
          className="border p-3 rounded"
          name="message"
          placeholder="Additional information"
          value={form.message}
          onChange={update}
        />

        <button className="bg-indigo-600 text-white p-3 rounded">
          Submit
        </button>

      </form>

      <section className="mt-8">

        <h2 className="text-xl font-bold mb-3">
          Submissions
        </h2>

        {submissions.map(item => (
          <article
            key={item.id}
            className="bg-white p-4 rounded shadow mb-3"
          >
            <b>{item.name}</b>
            <p>{item.email}</p>
            <p>{item.course}</p>
            <p>{item.message}</p>
          </article>
        ))}

      </section>

    </main>
  );
}
