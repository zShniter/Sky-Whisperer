import React, { useState, useEffect } from 'react';
import SearchBar from './components/searchBar';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import { fetchCurrentWeather, fetchForecast, fetchWeatherByCoords } from './utils/api';
import './styles.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [defaultCity, setDefaultCity] = useState('London');

  const loadWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const [currentWeather, forecast] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city)
      ]);
      setWeatherData(currentWeather);
      setForecastData(forecast);
    } catch (err) {
      setError('City not found. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const currentWeather = await fetchWeatherByCoords(lat, lon);
      const forecast = await fetchForecast(currentWeather.name);
      setWeatherData(currentWeather);
      setForecastData(forecast);
    } catch (err) {
      setError('Unable to fetch weather for your location.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData(defaultCity);
  }, []);

  const handleSearch = (city) => {
    loadWeatherData(city);
  };

  const handleLocationClick = (lat, lon) => {
    loadWeatherByCoords(lat, lon);
  };

  return (
    <div className="app-container">
      <div className="weather-app">
        <div className="app-header">
          <h1>🌤️ Sky Whisperer</h1>
          <p>Your personal weather whisperer, delivering accurate forecasts with elegance</p>
        </div>

        <SearchBar 
          onSearch={handleSearch} 
          onLocationClick={handleLocationClick}
        />

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="main-content">
              <div className="current-weather">
                <WeatherCard weatherData={weatherData} />
              </div>
              <div className="forecast-container">
                <Forecast forecastData={forecastData} />
              </div>
            </div>
            
            <div className="app-footer">
              <p className="attribution">
                Weather app made by Ali Chniter & Nassim Laafif, data provided by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;