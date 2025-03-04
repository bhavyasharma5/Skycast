import sunny from '../assets/images/sunny.png'
import cloudy from '../assets/images/cloudy.png'
import rainy from '../assets/images/rainy.png'
import snowy from '../assets/images/snowy.png'
import { useState } from 'react';

const Skycast = () => {
    const [data, setData] = useState({})
    const [location, setLocation] = useState('')
    const [error, setError] = useState('')
    const api_key = "2d1295eddc118f32074dcd1bbcbba698";
    const [isDark, setIsDark] = useState(true);
    const [isCelsius, setIsCelsius] = useState(true);
    const [forecast, setForecast] = useState([]);

    // Function to get formatted date
    const getCurrentDate = () => {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long',
            year: 'numeric'
        };
        return now.toLocaleDateString('en-US', options);
    };


    const getWeatherImage = (weatherMain) => {
        if (!weatherMain) return sunny; // default image
        
        switch(weatherMain.toLowerCase()) {
            case 'clear':
                return sunny;
            case 'clouds':
                return cloudy;
            case 'rain':
            case 'drizzle':
            case 'thunderstorm':
                return rainy;
            case 'snow':
                return snowy;
            default:
                return sunny;
        }
    }

    const handleInputChange = (e) => {
        setLocation(e.target.value)
    }

    const getForecast = async (city) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=Metric&appid=${api_key}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (response.ok) {
                // Get one forecast per day (every 24 hours)
                const dailyForecast = data.list.filter((forecast, index) => index % 8 === 0);
                setForecast(dailyForecast);
            }
        } catch (err) {
            console.error('Error fetching forecast:', err);
        }
    };

    const search = async () => {
        if(location.trim() !== "") {
            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${api_key}`;
                const response = await fetch(url);
                const searchData = await response.json();
                
                if (response.ok) {
                    setData(searchData);
                    setError('');
                    await getForecast(location);
                } else {
                    setError('Not found 😬');
                    setData({});
                    setForecast([]);
                }
                setLocation('');
            } catch (err) {
                setError('Not found 😬');
                setData({});
                setForecast([]);
            }
        }
    };

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            search()
        }
    }

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

  return (
    <div className={`container ${isDark ? 'dark' : 'light'}`}>
      <div className="Skycast-app">
        <div className="theme-toggle" onClick={toggleTheme}>
            <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
        </div>
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot"></i>
            <div className="location">
                {error ? error : data.name}
            </div>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Enter the Location" value={location} onChange={handleInputChange} onKeyDown={handleKeyDown} />
            <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
          </div>
        </div>
        <div className="weather">
            <img 
                src={getWeatherImage(data.weather ? data.weather[0].main : null)} 
                alt={data.weather ? data.weather[0].main : "weather"} 
            />
            <div className="weather-type">{data.weather ? data.weather[0].main : null}</div>
            <div className="temp" onClick={() => setIsCelsius(!isCelsius)}>
                {data.main ? 
                    isCelsius 
                        ? `${Math.floor(data.main.temp)}°C` 
                        : `${Math.floor(data.main.temp * 9/5 + 32)}°F` 
                    : null
                }
            </div>
        </div>
        <div className="weather-date">
            <p>{getCurrentDate()}</p>
        </div>
        <div className="weather-data">
            <div className="humidity">
                <div className="data-name">Humidity</div>
                <i className="fa-solid fa-droplet">
                    <div className="data-value">{data.main ? data.main.humidity : null}%</div>
                </i>
            </div>

            <div className="wind">
                <div className="data-name">Wind</div>
                <i className="fa-solid fa-wind">
                    <div className="data-value">{data.wind ? data.wind.speed : null} kmph</div>
                </i>
            </div>

        </div>

        {forecast.length > 0 && (
            <div className="forecast">
                {forecast.map((day, index) => (
                    <div key={index} className="forecast-day">
                        <div className="forecast-date">
                            {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <img 
                            src={getWeatherImage(day.weather[0].main)} 
                            alt={day.weather[0].main}
                            className="forecast-icon" 
                        />
                        <div className="forecast-temp">
                            {isCelsius 
                                ? `${Math.floor(day.main.temp)}°C`
                                : `${Math.floor(day.main.temp * 9/5 + 32)}°F`
                            }
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Skycast;
