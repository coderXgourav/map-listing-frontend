// utils/googleMaps.ts

export const getCoordinatesFromAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDnwBHYVZjvlrU2FHW5ZxTs1VFPzNxXDWE`
  );

  const data = await response.json();

  if (data.status !== 'OK' || data.results.length === 0) {
    throw new Error('Location not found');
  }

  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
};
