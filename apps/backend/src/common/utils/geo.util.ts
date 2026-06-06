export class GeoUtil {
  private static readonly EARTH_RADIUS_KM = 6371;
  private static readonly SRI_LANKA_BOUNDS = {
    north: 9.86,
    south: 5.92,
    east: 81.89,
    west: 79.65,
  };

  static haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.EARTH_RADIUS_KM * c;
  }

  static toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  static toDeg(rad: number): number {
    return (rad * 180) / Math.PI;
  }

  static isWithinRadius(
    centerLat: number,
    centerLon: number,
    pointLat: number,
    pointLon: number,
    radiusKm: number,
  ): boolean {
    return this.haversineDistance(centerLat, centerLon, pointLat, pointLon) <= radiusKm;
  }

  static isInSriLanka(lat: number, lon: number): boolean {
    return (
      lat >= this.SRI_LANKA_BOUNDS.south &&
      lat <= this.SRI_LANKA_BOUNDS.north &&
      lon >= this.SRI_LANKA_BOUNDS.west &&
      lon <= this.SRI_LANKA_BOUNDS.east
    );
  }

  static boundingBox(lat: number, lon: number, radiusKm: number): {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  } {
    const latDelta = (radiusKm / this.EARTH_RADIUS_KM) * (180 / Math.PI);
    const lonDelta =
      ((radiusKm / this.EARTH_RADIUS_KM) * (180 / Math.PI)) / Math.cos(this.toRad(lat));

    return {
      minLat: lat - latDelta,
      maxLat: lat + latDelta,
      minLon: lon - lonDelta,
      maxLon: lon + lonDelta,
    };
  }

  static calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLon = this.toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(this.toRad(lat2));
    const x =
      Math.cos(this.toRad(lat1)) * Math.sin(this.toRad(lat2)) -
      Math.sin(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.cos(dLon);
    const bearing = (this.toDeg(Math.atan2(y, x)) + 360) % 360;
    return bearing;
  }

  static getCardinalDirection(bearing: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  }
}
