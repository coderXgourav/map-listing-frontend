import React, { useState } from 'react';

interface FilterBarProps {
  onSearch: (filters: {
    location: string;
    type: string;
    minRating: number;
  }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [minRating, setMinRating] = useState(3);

  const handleSubmit = () => {
    if (!location.trim()) {
      alert('Please enter a location');
      return;
    }
    onSearch({ location, type, minRating });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white shadow-md rounded-lg">
      <input
        type="text"
        placeholder="Enter Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="p-2 border border-gray-300 rounded w-48"
      />
      <input
        type="text"
        placeholder="Business Type (e.g., cafe, salon)"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="p-2 border border-gray-300 rounded w-48"
      />
      <select
        value={minRating}
        onChange={(e) => setMinRating(Number(e.target.value))}
        className="p-2 border border-gray-300 rounded w-40"
      >
        <option value={1}>1★ and up</option>
        <option value={2}>2★ and up</option>
        <option value={3}>3★ and up</option>
        <option value={4}>4★ and up</option>
        <option value={5}>5★ only</option>
      </select>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
};

export default FilterBar;
