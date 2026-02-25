"use client";
import { useState } from "react";

export default function AddProperty() {
  const [form, setForm] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Property Published 🚀");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Property</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl space-y-5"
      >
        <input name="title" placeholder="Title" onChange={handleChange} className="w-full p-3 border rounded-lg" />
        <input name="price" placeholder="Price" onChange={handleChange} className="w-full p-3 border rounded-lg" />
        <input name="location" placeholder="Location" onChange={handleChange} className="w-full p-3 border rounded-lg" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-3 border rounded-lg" />

        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition">
          Publish Property
        </button>
      </form>
    </div>
  );
}