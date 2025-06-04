import React from 'react';
import { Filter, Star, MapPin } from 'lucide-react';

interface FilterBarProps {
  location: string;
  onLocationChange: (loc: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  maxRating: number;
  onRatingChange: (rating: number) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  location,
  onLocationChange,
  selectedType,
  onTypeChange,
  maxRating,
  onRatingChange,
}) => {
  const ratingOptions = [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Filter className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filter Businesses</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <input
              type="text"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Enter city, area or address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
          <input
            type="text"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            placeholder="e.g. bar, restaurant, other"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Rating</label>
          <div className="flex items-center space-x-3">
            <select
              value={maxRating}
              onChange={(e) => onRatingChange(parseFloat(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {ratingOptions.map((rating) => (
                <option key={rating} value={rating}>
                  {rating} stars or below
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium text-gray-600">{maxRating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;