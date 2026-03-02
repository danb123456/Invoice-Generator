import React, { useState } from 'react';
import { RecurringInvoice, RecurringFrequency, InvoiceData } from '../types';
import { Plus, Trash2, Play, Calendar, Edit2 } from 'lucide-react';

interface Props {
  recurringInvoices: RecurringInvoice[];
  onUpdate: (invoice: RecurringInvoice) => void;
  onDelete: (id: string) => void;
  onGenerate: (template: InvoiceData) => void;
}

export default function RecurringManager({ recurringInvoices, onUpdate, onDelete, onGenerate }: Props) {
  const handleDelete = (id: string) => {
    onDelete(id);
  };

  const toggleStatus = (profile: RecurringInvoice) => {
    onUpdate({ ...profile, isActive: !profile.isActive });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Recurring Invoices</h2>
        <p className="text-sm text-gray-500">
          Save an invoice as a recurring profile from the "New Invoice" tab.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recurringInvoices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No recurring invoices found. Create an invoice and click "Save as Recurring".
                </td>
              </tr>
            )}
            {recurringInvoices.map(profile => (
              <tr key={profile.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{profile.profileName}</div>
                  <div className="text-xs text-gray-500">Next: {profile.nextIssueDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {profile.template.customer.name || 'Unknown Client'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-1">
                  <Calendar size={14} /> {profile.frequency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleStatus(profile)}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      profile.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {profile.isActive ? 'Active' : 'Paused'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onGenerate(profile.template)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    title="Generate Invoice Now"
                  >
                    <Play size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Profile"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
