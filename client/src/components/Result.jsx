
import React from 'react';

export const Result = ({ result }) => {
  // Gracefully handle if result is a GitHub repo object or a string
  const repoName = typeof result === 'object' ? result.name : result;
  const repoUrl = typeof result === 'object' ? result.html_url : '#';

  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full text-left py-3 px-4 text-black font-semibold hover:bg-gray-100 border-b border-gray-100 last:border-none transition-colors"
    >
      {repoName} <span className="text-gray-400 font-normal ml-1">↗</span>
    </a>
  );
};