// pages/User.jsx
import { useState, useEffect } from 'react';
import { getSkills } from '../api.js';
import LikeButton from '../components/LikeButton.jsx';

export default function User() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Optional: Update the parent skill list count if needed
  function handleLikeUpdated(skillId, newCount) {
    setSkills((prev) =>
      prev.map((skill) => {
        const id = skill._id || skill.id;
        if (id === skillId) {
          return { ...skill, likeCount: newCount };
        }
        return skill;
      })
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Explore & Endorse Skills
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Discover skills shared across the platform and endorse your favorites.
            </p>
          </div>

          <div className="relative min-w-[280px]">
            <input
              type="text"
              placeholder="Search skills or categories..."
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

        {/* Global Error Notice */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Skill Catalog */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500 dark:text-gray-400">
              <svg className="animate-spin h-8 w-8 text-blue-600 mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm font-medium">Loading skills catalog...</p>
            </div>
          ) : skills.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <p className="text-base font-medium">No skills found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {skills.map((skill, index) => {
                const skillId = skill._id || skill.id;
                const uniqueKey = skillId || `skill-${index}`;

                return (
                  <div
                    key={uniqueKey}
                    className="p-5 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                          {skill.title || skill.name || 'Untitled Skill'}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {skill.category || 'Uncategorized'}
                        </span>
                      </div>
                      {skill.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {skill.description}
                        </p>
                      )}
                    </div>

                    {/* Integrated Like / Endorse Button */}
                    <div>
                      <LikeButton
                        itemId={skillId}
                        initialLikes={skill.likes || []}
                        onLikeUpdated={(newCount) => handleLikeUpdated(skillId, newCount)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}