
import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api/records";
const CATEGORY = "FormSubmission";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    message: ""
  });

  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");

  // GET SUBMISSIONS
  const loadSubmissions = async () => {
    try {
      const response = await fetch(
        `${API}?category=${CATEGORY}`
      );

      if (!response.ok) {
        throw new Error("Could not load submissions");
      }

      setSubmissions(await response.json());

    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  // HANDLE INPUT
  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // SUBMIT TO DATABASE
  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and email are required");
      return;
    }

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          category: CATEGORY,
          details: {
            course: form.course,
            message: form.message
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      setForm({
        name: "",
        email: "",
        course: "",
        message: ""
      });

      await loadSubmissions();

      alert("Form submitted successfully!");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Registration Form — Full Stack
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

      {error && (
        <p className="text-red-600 mt-4">{error}</p>
      )}

      <section className="mt-8">

        <h2 className="text-xl font-bold mb-3">
          Saved Submissions
        </h2>

        {submissions.map(item => (
          <article
            key={item._id}
            className="bg-white p-4 rounded shadow mb-3"
          >
            <b>{item.name}</b>
            <p>{item.email}</p>
            <p>{item.details?.course}</p>
            <p>{item.details?.message}</p>
          </article>
        ))}

        {submissions.length === 0 && (
          <p>No submissions yet.</p>
        )}

      </section>

    </main>
  );
}
