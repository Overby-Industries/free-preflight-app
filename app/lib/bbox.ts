// AWC's bbox-based endpoints (obstacle, feature) take "lat0,lon0,lat1,lon1".
// Convert a center point + radius (nautical miles) into that box.
export const radiusToBbox = (lat: number, lon: number, radiusNm: number): string => {
    const latDelta = radiusNm / 60;
    const lonDelta = radiusNm / (60 * Math.cos((lat * Math.PI) / 180) || 1);
    return `${lat - latDelta},${lon - lonDelta},${lat + latDelta},${lon + lonDelta}`;
};
