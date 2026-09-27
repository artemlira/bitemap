export type WeatherConditionKey =
  | "clear"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "showers"
  | "thunderstorm";

export type WeatherCurrent = {
  temperature: number;
  time: string;
  weatherCode: number;
  windSpeed: number;
};

export type WeatherForecastDay = {
  date: string;
  precipitationProbability: number;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
  windSpeedMax: number;
};

export type SpotWeatherForecast = {
  current: WeatherCurrent;
  daily: WeatherForecastDay[];
};

export type FishingActivityLevel = "excellent" | "good" | "fair" | "low";

export type FishingActivity = {
  level: FishingActivityLevel;
  score: number;
};
