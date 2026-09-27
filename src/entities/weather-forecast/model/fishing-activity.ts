import type { FishingActivity, WeatherConditionKey, WeatherForecastDay } from "./types";

export function getWeatherConditionKey(weatherCode: number): WeatherConditionKey {
  if (weatherCode === 0 || weatherCode === 1) return "clear";
  if (weatherCode === 2 || weatherCode === 3) return "cloudy";
  if (weatherCode === 45 || weatherCode === 48) return "fog";
  if (weatherCode >= 51 && weatherCode <= 57) return "drizzle";
  if (weatherCode >= 61 && weatherCode <= 67) return "rain";
  if (weatherCode >= 71 && weatherCode <= 77) return "snow";
  if (weatherCode >= 80 && weatherCode <= 82) return "showers";
  return "thunderstorm";
}

export function getWeatherIcon(weatherCode: number) {
  switch (getWeatherConditionKey(weatherCode)) {
    case "clear": return "☀";
    case "cloudy": return "☁";
    case "fog": return "≋";
    case "drizzle":
    case "rain":
    case "showers": return "☂";
    case "snow": return "❄";
    case "thunderstorm": return "ϟ";
  }
}

export function getFishingActivity(day: WeatherForecastDay): FishingActivity {
  const month = new Date(`${day.date}T12:00:00`).getMonth() + 1;
  const averageTemperature = (day.temperatureMax + day.temperatureMin) / 2;
  let score = 48;

  if (month >= 3 && month <= 5) score += 10;
  else if (month >= 6 && month <= 8) score += 5;
  else if (month >= 9 && month <= 11) score += 8;
  else score -= 9;

  if (averageTemperature >= 8 && averageTemperature <= 24) score += 12;
  else if (averageTemperature >= 4 && averageTemperature <= 30) score += 4;
  else score -= 10;

  if (day.windSpeedMax <= 18) score += 8;
  else if (day.windSpeedMax <= 30) score += 2;
  else if (day.windSpeedMax > 45) score -= 14;

  if (day.precipitationProbability <= 30) score += 4;
  else if (day.precipitationProbability >= 70) score -= 9;

  if (getWeatherConditionKey(day.weatherCode) === "thunderstorm") score -= 20;

  score = Math.max(15, Math.min(95, Math.round(score)));
  if (score >= 75) return { level: "excellent", score };
  if (score >= 60) return { level: "good", score };
  if (score >= 45) return { level: "fair", score };
  return { level: "low", score };
}
