"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function UserManagementPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      photo: "https://i.pravatar.cc/40?img=1",
      name: "John Doe",
      email: "john@mail.com",
      status: "Active",
      role: "User",
      joined: "2025-01-12",
    },
  ]);

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const [editedStatus, setEditedStatus] = useState("");

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter((user) => user.id !== id));
      }
    });
  };

  // 🔥 UPDATED HANDLE EDIT
  const handleEdit = (id) => {
    const user = users.find((u) => u.id === id);
    setSelectedUser(user);
    setEditedRole(user.role);
    setEditedStatus(user.status);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setUsers(
      users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, role: editedRole, status: editedStatus }
          : user
      )
    );
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        User Management
      </h2>

      <table className="w-full text-left min-w-[800px] text-gray-900">
        <thead>
          <tr className="border-b-2 border-gray-400">
            <th className="py-3 px-2">Photo</th>
            <th className="py-3 px-2">Name</th>
            <th className="py-3 px-2">Email</th>
            <th className="py-3 px-2">Status</th>
            <th className="py-3 px-2">Role</th>
            <th className="py-3 px-2">Joined</th>
            <th className="py-3 px-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b-2 border-gray-300 hover:bg-gray-50"
            >
              <td className="py-3 px-2">
                <img
                  src={user.photo}
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
              </td>

              <td className="py-3 px-2 font-medium">{user.name}</td>
              <td className="py-3 px-2 font-medium">{user.email}</td>

              <td className="py-3 px-2 font-medium">
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.status}
                </span>
              </td>

              <td className="py-3 px-2 font-medium">{user.role}</td>
              <td className="py-3 px-2 font-medium">{user.joined}</td>

              <td className="py-3 px-2 space-x-2">
                <button
                  onClick={() => handleEdit(user.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 text-gray-900">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-scaleIn">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Edit User
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-lg text-gray-700">
                  Role
                </label>
                <select
                  value={editedRole}
                  onChange={(e) => setEditedRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="User">User</option>
                  <option value="Seller">Seller</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-lg text-gray-700">
                  Status
                </label>
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
