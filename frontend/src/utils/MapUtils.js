import { fromLonLat } from "ol/proj";


export const reverseGeocode = async (lon, lat) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lon=${lon}&lat=${lat}`,
    );
    const data = await response.json();

    if (data.address) {
      // Build address from available components
      const addressParts = [];
      if (data.address.road) addressParts.push(data.address.road);
      if (data.address.city) addressParts.push(data.address.city);
      if (data.address.state) addressParts.push(data.address.state);

      return addressParts.length > 0
        ? addressParts.join(", ")
        : `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    }

    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  }
};

export const getInitialCenterForAddress = async (address) => {
  try {
    const defaultCenter = fromLonLat([77.2245, 28.6139]); // New Delhi

    if (!address || address.trim() === "") {
      return defaultCenter;
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address,
      )}`,
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const { lon, lat } = data[0];
      return fromLonLat([parseFloat(lon), parseFloat(lat)]);
    }

    return defaultCenter;
  } catch (error) {
    console.error("Geocoding failed:", error);

    return fromLonLat([77.2245, 28.6139]);
  }
};
