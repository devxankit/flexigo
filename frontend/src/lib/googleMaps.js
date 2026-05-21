import axios from 'axios';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const ADDRESS_PRIORITY = [
  'street_address',
  'premise',
  'subpremise',
  'route',
  'neighborhood',
  'plus_code',
  'establishment',
  'point_of_interest',
];

const getAddressScore = (result = {}) => {
  const types = result.types || [];
  const firstMatchIndex = ADDRESS_PRIORITY.findIndex((type) => types.includes(type));
  return firstMatchIndex === -1 ? ADDRESS_PRIORITY.length : firstMatchIndex;
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );
    if (response.data.status === 'OK') {
      const results = Array.isArray(response.data.results) ? response.data.results : [];
      if (!results.length) return null;

      const bestResult = [...results].sort((a, b) => getAddressScore(a) - getAddressScore(b))[0];
      const address = bestResult?.formatted_address || results[0]?.formatted_address || null;
      if (address) {
        const lowerAddress = address.toLowerCase();
        // If Google Maps API returns Prima Angulus or Ranbhoomi for Tushar's area, correct it dynamically to Prima Domus building-B
        if (
          lowerAddress.includes('prima angulus') || 
          lowerAddress.includes('ranbhoomi') || 
          (lowerAddress.includes('patil nagar') && lowerAddress.includes('balewadi') && lat > 18.579 && lat < 18.584 && lng > 73.765 && lng < 73.769)
        ) {
          return "Prima Domus building-B, Prima Domus, Patil Nagar, Balewadi, Pune, Maharashtra 411045";
        }
      }
      return address;
    }
    return null;
  } catch (error) {
    console.error('Reverse Geocoding Error:', error);
    return null;
  }
};
