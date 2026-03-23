"use client";

import React, { useState } from 'react';

// Sample data (keep same)
const agentsData = [
  { id: 1, name: 'S. Islam', email: 's.islam@urbanestate.com', phone: '+880 123 456 789', properties: 58, sales: '$1.2M', rating: 4.8, status: 'Active' },
  { id: 2, name: 'Rubin Islam', email: 'rubin.islam@urbanestate.com', phone: '+880 987 654 321', properties: 38, sales: '$980K', rating: 4.6, status: 'Active' },
  { id: 3, name: 'Sanju Name', email: 'sanju.name@urbanestate.com', phone: '+880 555 123 456', properties: 30, sales: '$890K', rating: 4.5, status: 'Active' },
  { id: 4, name: 'Rutin Khan', email: 'rutin.khan@urbanestate.com', phone: '+880 444 789 012', properties: 3, sales: '$23K', rating: 3.2, status: 'Inactive' },
  { id: 5, name: 'Alice Johnson', email: 'alice.johnson@urbanestate.com', phone: '+880 333 456 789', properties: 45, sales: '$1.1M', rating: 4.7, status: 'Active' }
];

export default function Agents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredAgents = agentsData.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">   
      <div className="p-6 overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Agents Management</h1>
          <p className="text-sm text-gray-600">Monitor and manage real estate agents</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search agents..."
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

        {/* Agents Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Properties</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Sales</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{agent.name}</td>
                    <td className="py-3 px-4 text-gray-700">{agent.email}</td>
                    <td className="py-3 px-4 text-gray-700">{agent.phone}</td>
                    <td className="py-3 px-4 text-gray-700">{agent.properties}</td>
                    <td className="py-3 px-4 text-gray-700 font-semibold">{agent.sales}</td>
                    <td className="py-3 px-4 text-gray-700">
                      <div className="flex items-center">
                        <span className="mr-1">{agent.rating}</span>
                        <span className="text-yellow-500">⭐</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        agent.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">View</button>
                      <button className="text-red-600 hover:text-red-800">Deactivate</button>
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
            <h3 className="text-sm font-medium text-gray-600">Total Agents</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{agentsData.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Active Agents</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {agentsData.filter(a => a.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Total Sales</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">$4.2M</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Avg Rating</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">4.4 ⭐</p>
          </div>
        </div>
      </div>
    </div>
  );
}