import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import './LocationDisplay.css';

const LocationDisplay = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Function to get current position using Geolocation API
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('User denied the request for Geolocation.'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Location information is unavailable.'));
              break;
            case error.TIMEOUT:
              reject(new Error('The request to get user location timed out.'));
              break;
            default:
              reject(new Error('An unknown error occurred.'));
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  // Function to reverse geocode coordinates to address
  const reverseGeocode = async (latitude, longitude) => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=vi`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        // Extract relevant parts of the address
        const address = data.display_name;
        const parts = address.split(', ');
        
        // Try to get district/city information
        let locationText = '';
        if (parts.length >= 2) {
          // Get the last few parts which usually contain district, city, country
          const relevantParts = parts.slice(-3, -1); // Skip country
          locationText = relevantParts.join(', ');
        } else {
          locationText = address;
        }
        
        return {
          fullAddress: address,
          shortAddress: locationText,
          city: data.address?.city || data.address?.town || data.address?.village || '',
          district: data.address?.suburb || data.address?.district || data.address?.county || '',
          country: data.address?.country || 'Việt Nam'
        };
      }
      
      throw new Error('No location data found');
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  };

  // Function to get and display location
  const fetchLocation = async () => {
    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    try {
      const position = await getCurrentPosition();
      const locationData = await reverseGeocode(position.latitude, position.longitude);
      
      setLocation({
        ...position,
        ...locationData
      });
    } catch (error) {
      console.error('Location error:', error);
      
      if (error.message.includes('denied')) {
        setPermissionDenied(true);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load location on component mount
  useEffect(() => {
    fetchLocation();
  }, []);

  const handleRefresh = () => {
    fetchLocation();
  };

  const handleRequestPermission = () => {
    setPermissionDenied(false);
    fetchLocation();
  };

  return (
    <div className="location-display">
      {loading ? (
        <div className="location-loading">
          <RefreshCw size={16} className="spinning" />
          <span>Đang tải vị trí...</span>
        </div>
      ) : error ? (
        <div className="location-error">
          <AlertCircle size={16} />
          <span>Không thể lấy vị trí</span>
          <button onClick={handleRefresh} className="retry-button">
            <RefreshCw size={14} />
          </button>
        </div>
      ) : permissionDenied ? (
        <div className="location-permission">
          <AlertCircle size={16} />
          <span>Cần quyền truy cập vị trí</span>
          <button onClick={handleRequestPermission} className="permission-button">
            Cho phép
          </button>
        </div>
      ) : location ? (
        <div className="location-info">
          <MapPin size={16} />
          <div className="location-text">
            <span className="location-main">{location.shortAddress}</span>
            {location.city && (
              <span className="location-detail">{location.city}</span>
            )}
          </div>
          <button onClick={handleRefresh} className="refresh-button" title="Làm mới vị trí">
            <RefreshCw size={14} />
          </button>
        </div>
      ) : (
        <div className="location-placeholder">
          <MapPin size={16} />
          <span>Vị trí không xác định</span>
        </div>
      )}
    </div>
  );
};

export default LocationDisplay;
