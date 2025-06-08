import React, { useState } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { User } from '../../types';
import { Edit, Trash2, UserPlus } from 'lucide-react';

// Mock users data
const MOCK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: 2, name: 'Regular User', email: 'user@example.com', role: 'user' },
  { id: 3, name: 'John Doe', email: 'john@example.com', role: 'user' },
  { id: 4, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
];

const UserManagementPage = () => {
  const [users] = useState<User[]>(MOCK_USERS);

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <span className="capitalize">{row.original.role}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => console.log('Edit user:', row.original.id)}
            className="btn-ghost btn-sm"
            title="Edit user"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => console.log('Delete user:', row.original.id)}
            className="text-error-600 hover:text-error-800 transition-colors btn-sm btn-ghost"
            title="Delete user"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage system users and their roles</p>
        </div>
        <button
          onClick={() => console.log('Add new user')}
          className="btn-primary btn-md inline-flex items-center"
        >
          <UserPlus size={16} className="mr-2" />
          Add New User
        </button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Search users..."
      />
    </div>
  );
};

export default UserManagementPage;