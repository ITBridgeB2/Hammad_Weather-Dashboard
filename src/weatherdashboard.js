import React, { useState } from "react";
import api from "./weatherdetails";
import { useNavigate } from 'react-router-dom';
import "./styles.css";

const WeatherSearch = () => {
  const [formData, setFormData] = useState({ city: "" });
  const [weatherDisplay, setWeatherDisplay] = useState(null);
  const navigate = useNavigate();  

  const handleChange = (e) => {
    setFormData({ city: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/weather", { city: formData.city });
      setWeatherDisplay(res.data);
      setFormData({ city: "" });
    } catch (error) {
      console.error("Weather fetch error", error);
    }
  };

  const goToHistory = () => {
    navigate("/history");  
  };

  return (
    <div className="weather-container">
      <h1>Weather Dashboard</h1>

      <form onSubmit={handleSubmit} className="weather-form">
        <input
          type="text"
          name="city"
          placeholder="Enter a city"
          value={formData.city}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={goToHistory}>History</button>  
      </form>


      {weatherDisplay && (
        <div className="weather-card">
            <h2>Current Weather In </h2>
          <h2>{weatherDisplay.city}</h2>
          <p><strong>Temperature:</strong> {weatherDisplay.temperature}°C</p>
          <p><strong>Humidity:</strong> {weatherDisplay.humidity}</p>
          <p><strong>Description:</strong> {weatherDisplay.description}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherSearch;
