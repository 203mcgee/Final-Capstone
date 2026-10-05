// pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../api.js';

export default function AdminPage() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  // State for holding values while editing a row inline
  const [editFormData, setEditFormData] = useState({ title: '', category: '' });

  async function loadSkills(searchTerm = search) {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getSkills(searchTerm);

      let skillsArray = [];
      if (Array.isArray(data)) {
        skillsArray = data;
      } else if (data && Array.isArray(data.skills)) {
        skillsArray = data.skills;
      } else if (data && Array.isArray(data.data)) {
        skillsArray = data.data;
      }

      setSkills(skillsArray);
    } catch (err) {
      setError(err.message || 'Failed to fetch skills');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSkills(search);
  }, [search]);

  // Start inline editing for a row
  function startEditing(skill) {
    const id = skill._id || skill.id;
    setEditingId(id);
    setEditFormData({
      title: skill.title || skill.name || '',
      category: skill.category || '',
    });
  }

  // Cancel inline editing
  function cancelEditing() {
    setEditingId(null);
    setEditFormData({ title: '', category: '' });
  }

  // Submit update to API
  async function handleUpdate(id) {
    if (!id) return;
    try {
      setError(null);
      await updateSkill(id, editFormData);
      await loadSkills();
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Failed to update skill');
    }
  }

  // Delete skill
  async function handleDelete(id) {
    if (!id) {
      setError('Cannot delete skill: missing valid ID.');
      return;
    }

    if (!window.confirm('Delete this skill permanently?')) return;

    try {
      setError(null);
      await deleteSkill(id);
      await loadSkills();
    } catch (err) {
      setError(err.message || 'Failed to delete skill');
      await loadSkills();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Search Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Skill Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage system skills, categories, and administrative controls.
            </p>
          </div>

          <div className="relative min-w-[280px]">
            <input
              type="text"
              placeholder="Search skills by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-300 font-semibold text-xs uppercase"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Form Error Banner */}
        {formError && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-300 text-sm">
            {formError}
          </div>
        )}

        {/* Content Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500 dark:text-gray-400">
              <svg className="animate-spin h-8 w-8 text-blue-600 mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm font-medium">Loading skill catalog...</p>
            </div>
          ) : skills.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <p className="text-base font-medium">No skills found.</p>
              <p className="text-sm mt-1">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">ID / Code</th>
                    <th className="py-3.5 px-6">Skill Name</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  {skills.map((skill, index) => {
                    const skillId = skill._id || skill.id;
                    const uniqueKey = skillId || `skill-${index}`;
                    const isEditing = editingId === skillId;

                    return (
                      <tr
                        key={uniqueKey}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="py-4 px-6 font-mono text-xs text-gray-500 dark:text-gray-400">
                          {skillId || 'N/A'}
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData.title}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, title: e.target.value })
                              }
                              className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            skill.title || skill.name || 'Untitled Skill'
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData.category}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, category: e.target.value })
                              }
                              className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              {skill.category || 'Uncategorized'}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleUpdate(skillId)}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(skill)}
                                className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-md border border-blue-200 dark:border-blue-800 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(skillId)}
                                className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md border border-red-200 dark:border-red-800 transition-colors"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}