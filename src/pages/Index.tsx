import React, { useState, useEffect } from 'react';
import { MapPin, Filter, Star, Navigation } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import BusinessCard from '../components/BusinessCard';
import MapView from '../components/MapView';
import { Business, mockBusinesses } from '../utils/mockData';

const Index = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('');
  const [maxRating, setMaxRating] = useState<number>(3.5);
  const [location, setLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    filterBusinesses();
  }, [businesses, selectedBusinessType, maxRating]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setIsLoading(false);
          setLocation('Current Location');
          searchNearby(location.lat, location.lng);
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation({ lat: 37.7749, lng: -122.4194 });
          setLocation('San Francisco');
          setIsLoading(false);
          setBusinesses(mockBusinesses);
        }
      );
    } else {
      console.error('Geolocation not supported');
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
      setLocation('San Francisco');
      setIsLoading(false);
      setBusinesses(mockBusinesses);
    }
  };

  const searchPlaces = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setSearchPerformed(true);

    try {
      const geoRes = await fetch(`http://localhost:5000/api/geocode?address=${encodeURIComponent(query)}`);
      const geoData = await geoRes.json();

      if (geoData.status !== 'OK') throw new Error('Geocoding failed');

      const loc = geoData.results[0].geometry.location;
      setUserLocation(loc);
      searchNearby(loc.lat, loc.lng);
    } catch (err) {
      console.error('Failed to search places:', err);
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchNearby = async (lat: number, lng: number) => {
    setIsLoading(true);
    setSearchPerformed(true);

    try {
      const res = await fetch(`http://localhost:5000/api/nearby?lat=${lat}&lng=${lng}`);
      const data = await res.json();

      if (data.status === 'OK') {
        const places = data.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          type: place.types?.[0] || 'business',
          rating: place.rating || 0,
          reviewCount: place.user_ratings_total || 0,
          address: place.vicinity,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          reviews: [],
        }));
        setBusinesses(places);
      } else {
        console.error('API error:', data.status);
        setBusinesses([]);
      }
    } catch (err) {
      console.error('Failed to fetch nearby places:', err);
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (location.trim() && location !== 'Current Location') {
        const query =
          selectedBusinessType.trim() !== ''
            ? `${selectedBusinessType} in ${location}`
            : location;

        searchPlaces(query);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [location, selectedBusinessType]);

  const filterBusinesses = () => {
    let filtered = [...businesses];

    if (selectedBusinessType.trim()) {
      filtered = filtered.filter((b) =>
        b.type ? b.type.toLowerCase().includes(selectedBusinessType.toLowerCase()) : false
      );
    }

    filtered = filtered.filter((b) => {
      const rating = typeof b.rating === 'number' ? b.rating : 0;
      return rating <= maxRating;
    });

    setFilteredBusinesses(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Business Finder</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Navigation className="h-4 w-4" />
                <span>{isLoading ? 'Locating...' : 'Use My Location'}</span>
              </button>
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <MapPin className="h-4 w-4" />
                <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar
          location={location}
          onLocationChange={setLocation}
          selectedType={selectedBusinessType}
          onTypeChange={setSelectedBusinessType}
          maxRating={maxRating}
          onRatingChange={setMaxRating}
        />

        {showMap && userLocation && (
          <div className="mb-8">
            <MapView businesses={filteredBusinesses} userLocation={userLocation} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {searchPerformed
                  ? `Found ${filteredBusinesses.length} businesses in ${location} with ${maxRating} stars or below`
                  : 'Enter a location to find businesses'}
              </h2>
              <p className="text-gray-600 mt-1">
                Discover hidden gems and support local businesses in your area
              </p>
            </div>
            <div className="flex items-center space-x-2 text-blue-600">
              <Star className="h-5 w-5" />
              <span className="font-medium">Max {maxRating} stars</span>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-lg font-medium text-gray-700">Searching businesses...</span>
            </div>
          </div>
        )}

        {!isLoading && filteredBusinesses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}

        {!isLoading && searchPerformed && filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-8">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
              <p className="text-gray-600">Try adjusting your filters or location to find more businesses.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;