"use client";

import React, { useState } from 'react';

// Sample data (keep same)
const UsersData = [
  { id: 1, name: 'John Doe', email: 'john.doe@email.com', phone: '+880 123 456 789', propertiesViewed: 5, status: 'Active', lastActivity: '2024-09-25' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@email.com', phone: '+880 987 654 321', propertiesViewed: 12, status: 'Active', lastActivity: '2024-09-24' },
  { id: 3, name: 'Bob Johnson', email: 'bob.johnson@email.com', phone: '+880 555 123 456', propertiesViewed: 3, status: 'Inactive', lastActivity: '2024-09-20' },
  { id: 4, name: 'Alice Brown', email: 'alice.brown@email.com', phone: '+880 444 789 012', propertiesViewed: 8, status: 'Active', lastActivity: '2024-09-23' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@email.com', phone: '+880 333 456 789', propertiesViewed: 15, status: 'Active', lastActivity: '2024-09-25' }
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredUsers = UsersData.filter(User => {
    const matchesSearch = User.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          User.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || User.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-sm text-gray-600">Manage and track User interactions</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search Users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Properties Viewed</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Last Activity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((User) => (
                  <tr key={User.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{User.name}</td>
                    <td className="py-3 px-4 text-gray-700">{User.email}</td>
                    <td className="py-3 px-4 text-gray-700">{User.phone}</td>
                    <td className="py-3 px-4 text-gray-700">{User.propertiesViewed}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        User.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {User.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{User.lastActivity}</td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">View</button>
                      <button className="text-red-600 hover:text-red-800">Contact</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{UsersData.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {UsersData.filter(c => c.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Total Views</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {UsersData.reduce((sum, c) => sum + c.propertiesViewed, 0)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Avg Views/User</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {(UsersData.reduce((sum, c) => sum + c.propertiesViewed, 0) / UsersData.length).toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
