import React, { useEffect, useRef } from 'react';
import { Business } from '../utils/mockData';

declare global {
  interface Window {
    google: any;
  }
}

interface MapViewProps {
  businesses: Business[];
  userLocation: { lat: number; lng: number };
}

const MapView: React.FC<MapViewProps> = ({ businesses, userLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 13,
        styles: [
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }]
          }
        ],
      });
    }

    const map = mapInstance.current;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const userMarker = new window.google.maps.Marker({
      position: userLocation,
      map,
      title: "Your Location",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeColor: "#FFF",
        strokeWeight: 2,
      },
    });
    markersRef.current.push(userMarker);

    businesses.forEach((business) => {
      const position = { lat: business.lat, lng: business.lng };
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: business.name,
      });
      markersRef.current.push(marker);

      const roundedRating = Math.round(business.rating);
      const fullStars = '★'.repeat(roundedRating);
      const emptyStars = '☆'.repeat(5 - roundedRating);

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold;">${business.name}</h3>
            <p style="margin: 0 0 6px 0;">${business.address}</p>
            <div>
              <span style="color: #FBBF24; font-size: 18px;">${fullStars}</span>
              <span style="color: #D1D5DB; font-size: 18px;">${emptyStars}</span>
              <span style="margin-left: 8px; color: #6B7280;">(${business.reviewCount})</span>
            </div>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });

    map.setCenter(userLocation);

  }, [businesses, userLocation]);

  return <div ref={mapRef} className="w-full h-96 rounded-lg shadow-md" />;
};

export default MapView;