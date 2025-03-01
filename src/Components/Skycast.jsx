import sunny from '../assets/images/sunny.png'
//import cloudy from '../assets/cloudy.png'
//import rainy from '../assets/rainy.png'
//import snowy from '../assets/snowy.png'
import { useState } from 'react';

const Skycast = () => {
    const [data, setData] = useState({})
    const api_key = "2d1295eddc118f32074dcd1bbcbba698";

    const search = async () => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=New%20Delhi&units=Metric&appid=${api_key}`
        const response = await fetch(url)
        const searchData = await response.json()
        console.log(searchData)
        setData(searchData)
    }
  return (
    <div className="container">
      <div className="Skycast-app">
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot"></i>
            <div className="location">New Delhi</div>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Enter the Location" />
            <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
          </div>
        </div>
        <div className="weather">
            <img src={sunny} alt="sunny"  />
            <div className="weather-type">Clear</div>
            <div className="temp">20°C</div>
        </div>
        <div className="weather-date">
            <p>Thursday, 27 February</p>
        </div>
        <div className="weather-data">
            <div className="humidity">
                <div className="data-name">Humidity</div>
                <i className="fa-solid fa-droplet">
                    <div className="data-value">47%</div>
                </i>
            </div>

            <div className="wind">
                <div className="data-name">Wind</div>
                <i className="fa-solid fa-wind">
                    <div className="data-value">11 kmph</div>
                </i>
            </div>

        </div>

      </div>
    </div>
  );
};

export default Skycast;
