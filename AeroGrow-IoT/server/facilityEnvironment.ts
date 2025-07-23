// Facility-specific environmental data based on real-world conditions
export interface FacilityEnvironment {
  baseTemperature: number;
  baseHumidity: number;
  temperatureRange: { min: number; max: number };
  humidityRange: { min: number; max: number };
  seasonalVariation: number;
  climateType: 'controlled' | 'semi-controlled' | 'ambient';
}

export const facilityEnvironments: Record<string, FacilityEnvironment> = {
  'greenhouse': {
    baseTemperature: 24,
    baseHumidity: 65,
    temperatureRange: { min: 18, max: 30 },
    humidityRange: { min: 50, max: 80 },
    seasonalVariation: 3,
    climateType: 'controlled'
  },
  'warehouse': {
    baseTemperature: 20,
    baseHumidity: 45,
    temperatureRange: { min: 15, max: 25 },
    humidityRange: { min: 35, max: 55 },
    seasonalVariation: 5,
    climateType: 'semi-controlled'
  },
  'processing': {
    baseTemperature: 18,
    baseHumidity: 40,
    temperatureRange: { min: 16, max: 22 },
    humidityRange: { min: 35, max: 50 },
    seasonalVariation: 2,
    climateType: 'controlled'
  },
  'research': {
    baseTemperature: 22,
    baseHumidity: 50,
    temperatureRange: { min: 20, max: 26 },
    humidityRange: { min: 45, max: 60 },
    seasonalVariation: 1,
    climateType: 'controlled'
  }
};

export const locationFactors: Record<string, { tempOffset: number; humidityOffset: number }> = {
  'San Francisco, CA': { tempOffset: -2, humidityOffset: 15 },
  'Austin, TX': { tempOffset: 4, humidityOffset: -10 },
  'Seattle, WA': { tempOffset: -3, humidityOffset: 20 },
  'Denver, CO': { tempOffset: -1, humidityOffset: -15 },
  'Phoenix, AZ': { tempOffset: 8, humidityOffset: -25 },
  'Portland, OR': { tempOffset: -2, humidityOffset: 18 },
  'Miami, FL': { tempOffset: 6, humidityOffset: 25 },
  'Boston, MA': { tempOffset: -4, humidityOffset: 5 },
  'Chicago, IL': { tempOffset: -3, humidityOffset: 0 },
  'Los Angeles, CA': { tempOffset: 2, humidityOffset: -5 }
};

export function calculateFacilityEnvironment(
  facilityType: string,
  location: string,
  towerId?: number
): { temperature: number; humidity: number; co2Level: number; lightLevel: number } {
  const envConfig = facilityEnvironments[facilityType] || facilityEnvironments['greenhouse'];
  const locationFactor = locationFactors[location] || { tempOffset: 0, humidityOffset: 0 };
  
  // Calculate base values with location factors
  let temperature = envConfig.baseTemperature + locationFactor.tempOffset;
  let humidity = envConfig.baseHumidity + locationFactor.humidityOffset;
  
  // Add controlled variation based on facility type
  const tempVariation = Math.random() * 4 - 2; // ±2°C
  const humidityVariation = Math.random() * 10 - 5; // ±5%
  
  temperature += tempVariation;
  humidity += humidityVariation;
  
  // Apply seasonal variation (simulated)
  const seasonalTemp = Math.sin(Date.now() / (1000 * 60 * 60 * 24 * 30)) * envConfig.seasonalVariation;
  temperature += seasonalTemp;
  
  // Ensure values stay within realistic ranges
  temperature = Math.max(envConfig.temperatureRange.min, Math.min(envConfig.temperatureRange.max, temperature));
  humidity = Math.max(envConfig.humidityRange.min, Math.min(envConfig.humidityRange.max, humidity));
  
  // Calculate CO2 levels based on facility type
  let co2Level = 400; // Base atmospheric level
  switch (facilityType) {
    case 'greenhouse':
      co2Level = 800 + Math.random() * 400; // Enhanced CO2 for plant growth
      break;
    case 'processing':
      co2Level = 350 + Math.random() * 100; // Lower due to ventilation
      break;
    case 'research':
      co2Level = 400 + Math.random() * 200; // Controlled environment
      break;
    default:
      co2Level = 400 + Math.random() * 150;
  }
  
  // Calculate light levels based on facility type and time
  let lightLevel = 300; // Base level
  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour <= 18;
  
  switch (facilityType) {
    case 'greenhouse':
      lightLevel = isDay ? 600 + Math.random() * 400 : 200 + Math.random() * 100;
      break;
    case 'warehouse':
      lightLevel = 200 + Math.random() * 100; // Consistent artificial lighting
      break;
    case 'processing':
      lightLevel = 400 + Math.random() * 200; // Bright work environment
      break;
    case 'research':
      lightLevel = 500 + Math.random() * 300; // Controlled lighting
      break;
  }
  
  return {
    temperature: Math.round(temperature * 10) / 10,
    humidity: Math.round(humidity),
    co2Level: Math.round(co2Level),
    lightLevel: Math.round(lightLevel)
  };
}