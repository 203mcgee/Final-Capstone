

import React, { useState } from 'react';

export const SearchBar = ({ setResults, repos }) => {
  const [input, setInput] = useState('');

  const handleChange = (value) => {
    setInput(value);
    
    if (!value.trim()) {
      setResults([]);
      return;
    }

    // Filter repo objects matching the search query
    const filtered = (repos || []).filter((repo) =>
      repo.name.toLowerCase().includes(value.toLowerCase())
    );

    setResults(filtered);
  };

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Type to search projects..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-4 py-3 text-black bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
      />
    </div>
  );
};
