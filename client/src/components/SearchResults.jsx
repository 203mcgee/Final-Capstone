

import React from 'react';
import { Result } from './Result';

export const SearchResults = ({ results }) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="relative w-full z-30">
      <div className="absolute top-0 left-0 right-0 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto mt-1 divide-y divide-gray-100">
        {results.map((result, index) => (
          <Result 
            key={result.id || result.name || index} 
            result={result} 
          />
        ))}
      </div>
    </div>
  );
};