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
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 px-3 py-2 transition-all pointer-events-auto"
      style={{
        background: "var(--color-canvas)",
        border: "1px solid var(--color-hairline)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 2px 8px rgba(20,20,19,0.08)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex flex-col text-right">
        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--color-ink)",
            fontFamily: "var(--font-sans)",
            lineHeight: 1.2,
          }}
        >
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
        <span
          style={{
            fontSize: "10px",
            color: "var(--color-muted-soft)",
            fontFamily: "var(--font-sans)",
            lineHeight: 1.3,
            marginTop: "1px",
          }}
        >
          Laguna, PH
        </span>
      </div>
      {weather && (
        <div
          className="flex items-center justify-center px-2 py-0.5"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-on-primary)",
            borderRadius: "var(--radius-pill)",
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: "var(--font-sans)",
          }}
        >
          {weather.temp}°C
        </div>
      )}
    </div>
  );
}
