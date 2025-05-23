import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../style/ComponentLayout.css'

const API_KEY = "c3540be547721be3d08cf1f24a83a1e1";

export default function Meteo({ location }) {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();

        if (data.cod !== "200") {
          setError(`Weather error: ${data.message}`);
          return;
        }

        const dailyGroups = {};
        data.list.forEach((item) => {
          const dateKey = item.dt_txt.split(" ")[0];
          if (!dailyGroups[dateKey]) dailyGroups[dateKey] = [];
          dailyGroups[dateKey].push(item);
        });

        const groupedForecast = Object.entries(dailyGroups)
          .slice(0, 5)
          .map(([date, items]) => {
            const avgTemp =
              items.reduce((sum, i) => sum + i.main.temp, 0) / items.length;
            const desc = items[0].weather[0].description;
            const icon = items[0].weather[0].icon;
            return {
              date,
              temp: avgTemp.toFixed(1),
              desc,
              icon,
            };
          });

        setForecast(groupedForecast);
      } catch (err) {
        setError("Error fetching weather data.");
        console.error(err);
      }
    };

    fetchWeather();
  }, [location]);

  if (error) return <div className="text-danger">{error}</div>;
  if (!forecast.length) return <div className="text-muted">Loading weather...</div>;

  return (
    <div className="weather-container">
      {forecast.map((day) => (
        <WeatherCard
          key={day.date}
          title={new Date(day.date).toLocaleDateString(undefined, {
            weekday: "short",
            day: "numeric",
          })}
          data={day}
        />
      ))}
    </div>
  );
}

function WeatherCard({ title, data }) {
  return (
    <div className="card text-center weather-card">
      <div className="card-body p-1">
        <h6 className="card-title mb-1">{title}</h6>
        <img
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt="weather icon"
          className="mb-1 weather-icon"
        />
        <p className="mb-1 fw-semibold">{data.temp}°C</p>
        <p className="mb-0 text-muted">{data.desc}</p>
      </div>
    </div>
  );
}
