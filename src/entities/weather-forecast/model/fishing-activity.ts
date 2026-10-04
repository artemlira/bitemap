import type { FishingActivity, WeatherConditionKey, WeatherForecastDay } from "./types";

export function getWeatherConditionKey(weatherCode: number): WeatherConditionKey {
  if (weatherCode === 0 || weatherCode === 1) return "clear";
  if (weatherCode === 2 || weatherCode === 3) return "cloudy";
  if (weatherCode === 45 || weatherCode === 48) return "fog";
  if (weatherCode >= 51 && weatherCode <= 57) return "drizzle";
  if (weatherCode >= 61 && weatherCode <= 67) return "rain";
  if ((weatherCode >= 71 && weatherCode <= 77) || weatherCode === 85 || weatherCode === 86) return "snow";
  if (weatherCode >= 80 && weatherCode <= 82) return "showers";
  if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) return "thunderstorm";
  return "cloudy";
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
  let score = 50;

  if (month >= 3 && month <= 5) score += 4;
  else if (month >= 6 && month <= 8) score += 2;
  else if (month >= 9 && month <= 11) score += 4;
  else score -= 4;

  if (averageTemperature >= 10 && averageTemperature <= 22) score += 8;
  else if (averageTemperature >= 5 && averageTemperature <= 28) score += 3;
  else score -= 6;

  if (day.windSpeedMax <= 15) score += 8;
  else if (day.windSpeedMax <= 25) score += 3;
  else if (day.windSpeedMax <= 40) score -= 4;
  else score -= 12;

  if (day.precipitationProbability <= 20) score += 3;
  else if (day.precipitationProbability >= 70) score -= 8;

  if (getWeatherConditionKey(day.weatherCode) === "thunderstorm") score = Math.min(score, 30);

  score = Math.max(0, Math.min(100, Math.round(score)));
  if (score >= 60) return { level: "excellent", score };
  if (score >= 48) return { level: "good", score };
  if (score >= 35) return { level: "fair", score };
  return { level: "low", score };
}
