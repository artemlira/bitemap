import "server-only";
import type { SpotWeatherForecast } from "@/entities/weather-forecast";

const FORECAST_DAYS = 7;

type OpenMeteoResponse = {
  current?: { temperature_2m?: unknown; time?: unknown; weather_code?: unknown; wind_speed_10m?: unknown };
  daily?: {
    precipitation_probability_max?: unknown;
    temperature_2m_max?: unknown;
    temperature_2m_min?: unknown;
    time?: unknown;
    weather_code?: unknown;
    wind_speed_10m_max?: unknown;
  };
};

function parseCoordinate(value: string | null, minimum: number, maximum: number) {
  if (!value) return null;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) && coordinate >= minimum && coordinate <= maximum ? coordinate : null;
}

function getNumberArray(value: unknown): number[] | null {
  return Array.isArray(value) && value.every((item) => typeof item === "number" && Number.isFinite(item)) ? value : null;
}

function getStringArray(value: unknown): string[] | null {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : null;
}

function parseForecast(data: OpenMeteoResponse): SpotWeatherForecast | null {
  const current = data.current;
  const daily = data.daily;
  if (!current || !daily || typeof current.temperature_2m !== "number" || typeof current.time !== "string" || typeof current.weather_code !== "number" || typeof current.wind_speed_10m !== "number") return null;

  const dates = getStringArray(daily.time);
  const temperatureMax = getNumberArray(daily.temperature_2m_max);
  const temperatureMin = getNumberArray(daily.temperature_2m_min);
  const weatherCodes = getNumberArray(daily.weather_code);
  const precipitationProbability = getNumberArray(daily.precipitation_probability_max);
  const windSpeedMax = getNumberArray(daily.wind_speed_10m_max);
  if (!dates || !temperatureMax || !temperatureMin || !weatherCodes || !precipitationProbability || !windSpeedMax) return null;

  const daysCount = Math.min(FORECAST_DAYS, dates.length, temperatureMax.length, temperatureMin.length, weatherCodes.length, precipitationProbability.length, windSpeedMax.length);
  if (daysCount === 0) return null;

  return {
    current: { temperature: current.temperature_2m, time: current.time, weatherCode: current.weather_code, windSpeed: current.wind_speed_10m },
    daily: Array.from({ length: daysCount }, (_, index) => ({
      date: dates[index], precipitationProbability: precipitationProbability[index], temperatureMax: temperatureMax[index], temperatureMin: temperatureMin[index], weatherCode: weatherCodes[index], windSpeedMax: windSpeedMax[index],
    })),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = parseCoordinate(searchParams.get("latitude"), -90, 90);
  const longitude = parseCoordinate(searchParams.get("longitude"), -180, 180);
  if (latitude === null || longitude === null) return Response.json({ error: "invalid-coordinates" }, { status: 400 });

  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.search = new URLSearchParams({
    current: "temperature_2m,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
    forecast_days: String(FORECAST_DAYS), latitude: String(latitude), longitude: String(longitude), timezone: "auto", wind_speed_unit: "kmh",
  }).toString();

  try {
    const response = await fetch(weatherUrl, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) return Response.json({ error: "weather-unavailable" }, { status: 502 });
    const forecast = parseForecast((await response.json()) as OpenMeteoResponse);
    if (!forecast) return Response.json({ error: "weather-unavailable" }, { status: 502 });
    return Response.json(forecast, { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } });
  } catch {
    return Response.json({ error: "weather-unavailable" }, { status: 502 });
  }
}
