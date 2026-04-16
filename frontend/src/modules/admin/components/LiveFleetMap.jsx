import React, { useEffect, useRef } from 'react';

export default function LiveFleetMap({ vehicles }) {
  const mapRef = useRef(null);
  const googleMap = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    if (window.google && mapRef.current && !googleMap.current) {
      googleMap.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 12.9716, lng: 77.5946 }, // Bangalore
        zoom: 12,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c' }]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }]
          }
        ],
        disableDefaultUI: true,
      });
    }
  }, []);

  useEffect(() => {
    if (googleMap.current && vehicles.length > 0) {
      // Clear existing markers
      markers.current.forEach(m => m.setMap(null));
      markers.current = [];

      const bounds = new window.google.maps.LatLngBounds();

      vehicles.forEach(vehicle => {
        // Since we don't have real lat/lng in DB yet, I'll mock some around Bangalore center
        // In a real app, vehicle.location would be { lat: number, lng: number }
        const mockLat = 12.9716 + (Math.random() - 0.5) * 0.1;
        const mockLng = 77.5946 + (Math.random() - 0.5) * 0.1;
        const position = { lat: mockLat, lng: mockLng };

        const marker = new window.google.maps.Marker({
          position,
          map: googleMap.current,
          title: vehicle.id,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#10b981',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 7,
          },
        });

        markers.current.push(marker);
        bounds.extend(position);
      });

      if (vehicles.length > 1) {
        googleMap.current.fitBounds(bounds);
      } else if (vehicles.length === 1) {
        googleMap.current.setCenter(markers.current[0].getPosition());
        googleMap.current.setZoom(15);
      }
    }
  }, [vehicles]);

  return <div ref={mapRef} className="w-full h-full rounded-2xl" />;
}
