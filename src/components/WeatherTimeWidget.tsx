import React, { useState, useEffect } from "react";

export default function WeatherTimeWidget() {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch weather for Laguna, Philippines (approx 14.2146° N, 121.1633° E)
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=14.2146&longitude=121.1633&current_weather=true"
        );
        const data = await res.json();
        if (data && data.current_weather) {
          setWeather({
            temp: data.current_weather.temperature,
            code: data.current_weather.weathercode,
          });
        }
      } catch (err) {
        console.error("Failed to fetch weather", err);
      }
    };
    fetchWeather();
    // Refresh weather every hour
    const weatherTimer = setInterval(fetchWeather, 3600000);
    return () => clearInterval(weatherTimer);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center space-x-3 transition-all hover:scale-105 pointer-events-auto">
      <div className="flex flex-col text-right">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Laguna, PH
        </span>
      </div>
      {weather && (
        <div className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 rounded-full px-3 py-1.5 shadow-inner">
          <span className="text-sm font-bold text-blue-600 dark:text-blue-300">
            {weather.temp}°C
          </span>
        </div>
      )}
    </div>
  );
}
