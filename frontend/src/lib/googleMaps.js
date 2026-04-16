import axios from 'axios';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );
    if (response.data.status === 'OK') {
      return response.data.results[0].formatted_address;
    }
    return null;
  } catch (error) {
    console.error('Reverse Geocoding Error:', error);
    return null;
  }
};
