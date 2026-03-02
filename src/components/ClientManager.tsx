import React, { useState } from 'react';
import { Client } from '../types';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface Props {
  clients: Client[];
  onAdd: (client: Client) => void;
  onUpdate: (client: Client) => void;
  onDelete: (id: string) => void;
}

export default function ClientManager({ clients, onAdd, onUpdate, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Client>>({});

  const handleAdd = () => {
    const newClient: Client = {
      id: Math.random().toString(36).substring(2, 9),
      name: 'New Client',
      address: '',
      contact: '',
      vatNumber: '',
      regNumber: '',
    };
    onAdd(newClient);
    setEditingId(newClient.id);
    setEditForm(newClient);
  };

  const handleSave = () => {
    if (editingId && editForm) {
      onUpdate(editForm as Client);
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Client Management</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          Add Client
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VAT / Reg No</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No clients found. Add a client to get started.
                </td>
              </tr>
            )}
            {clients.map(client => (
              <tr key={client.id}>
                {editingId === client.id ? (
                  <td colSpan={4} className="px-6 py-4">
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Company Name</label>
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Contact Info</label>
                        <input
                          type="text"
                          value={editForm.contact || ''}
                          onChange={e => setEditForm({ ...editForm, contact: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700">Address</label>
                        <textarea
                          value={editForm.address || ''}
                          onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">VAT Number</label>
                        <input
                          type="text"
                          value={editForm.vatNumber || ''}
                          onChange={e => setEditForm({ ...editForm, vatNumber: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Company Reg No</label>
                        <input
                          type="text"
                          value={editForm.regNumber || ''}
                          onChange={e => setEditForm({ ...editForm, regNumber: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          <X size={16} /> Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          <Save size={16} /> Save
                        </button>
                      </div>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{client.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.contact || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{client.vatNumber ? `VAT: ${client.vatNumber}` : ''}</div>
                      <div>{client.regNumber ? `Reg: ${client.regNumber}` : ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingId(client.id);
                          setEditForm(client);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
