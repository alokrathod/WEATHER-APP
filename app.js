const api_key = '72cc4a77db8bc6543f6fe2c62d720d8c';

let cityInput = document.querySelector('#city_input');
let searchBtn = document.querySelector('#searchBtn');
let locationBtn = document.querySelector('#locationBtn');
let currentWeatherCard = document.querySelectorAll('.weather-left .card')[0];
let fiveDaysForecastCard = document.querySelector('.day-forecast');
let aqiCard = document.querySelectorAll('.highlight .card')[0];
let sunriseCard = document.querySelectorAll('.highlight .card')[1];
let aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
let humidityVal = document.querySelector('#humidityVal');
let presurreVal = document.querySelector('#pressureVal');
let visibilityVal = document.querySelector('#visibilityVal');
let windspeedVal = document.querySelector('#windSpeedVal');
let feelslikeVal = document.querySelector('#feelsLikeVal');
let hourlyForecastCard = document.querySelector('.hourly-forecast');

const getWeatherDetails = (name, lat, lon, country) => {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;

    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&cnt=${country}&appid=${api_key}`;

    let AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`

    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        //console.log(data);

        let date = new Date();

        currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${(data.weather[0].description)}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${(data.weather[0].icon)}@2x.png" alt="">
                </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="fa-regular fa-calendar"></i>${(days[date.getDay()])}, ${(date.getDate())}, ${(months[date.getMonth()])}, ${(date.getFullYear())}</p>
                    <p><i class="fa-solid fa-location-dot"></i>${(name)}, ${(country)}</p>
            </div>
        `;

        let {sunrise, sunset} = data.sys,
        {timezone, visibility} = data,
        {humidity, pressure, feels_like} = data.main,
        {speed} = data.wind;
        sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:m A'),
        sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:m A');

        sunriseCard.innerHTML = `
            <div class="card-head">
                <p>Sunrise & Sunset</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunrise fa-6x"></i>
                    </div>
                    <div>
                        <p>Sunrise</p>
                        <h2>${sRiseTime}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunset fa-6x"></i>
                    </div>
                    <div>
                        <p>Sunset</p>
                        <h2>${sSetTime}</h2>
                    </div>
                </div>
            </div>
        `;

        humidityVal.innerHTML = `${humidity}%`;
        presurreVal.innerHTML = `${pressure}hPa`;
        visibilityVal.innerHTML = `${visibility / 1000}km`;
        windspeedVal.innerHTML = `${speed}m/s`;
        feelslikeVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
        
    }).catch((error) => {
        console.error('Error fetching weather data:', error);
        alert(`Failed to fetch current weather`);
    });

    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        //console.log(data);
        let hourlyForecast = data.list;
        hourlyForecastCard.innerHTML = '';
        for(i = 0; i <= 7; i++) {
            let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
            let hr = hrForecastDate.getHours();
            let a = 'PM';
            if(hr < 12) a = 'AM';
            if(hr == 0) hr = 12;
            if(hr > 12) hr = hr - 12;
            hourlyForecastCard.innerHTML += `
                <div class="card">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                    <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                </div>
            `
        }
        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });
        //console.log(fiveDaysForecast);
        fiveDaysForecastCard.innerHTML = ``;
        for(let i = 1; i < fiveDaysForecast.length; i++) {
            let date = new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${(fiveDaysForecast[i].weather[0].icon)}.png" alt="">
                        <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>
                    <p>${(date.getDate())}  ${months[date.getMonth()]}</p>
                    <p>${(days[date.getDay()])}</p>
                </div>
            `;
        }
    }).catch(() => {
        alert(`Failed to fetch weather forecast`);
    });


    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
        let {co, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;

        //console.log(data);
        aqiCard.innerHTML = `
            <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
            </div>
            <div class="air-indices">
                <i class="fa-regular fa-wind fa-3x"></i>
                <div class="item">
                    <p>PM 2.5</p>
                    <h2>${pm2_5}</h2>
                </div>
                <div class="item">
                    <p>PM 10</p>
                    <h2>${pm10}</h2>
                </div>
                <div class="item">
                    <p>S02</p>
                    <h2>${so2}</h2>
                </div>
                <div class="item">
                    <p>CO</p>
                    <h2>${co}</h2>
                </div>
                <div class="item">
                    <p>O3</p>
                    <h2>${o3}</h2>
                </div>
                <div class="item">
                    <p>NO2</p>
                    <h2>${no2}</h2>
                </div>
                <div class="item">
                    <p>NH3</p>
                    <h2>${nh3}</h2>
                </div>
            </div>
        `;
    }).catch((error) => {
        console.error("Failed to fetch air quality index details", error);
        alert(`Failed to fetch air quality index details`);
    });

}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    //console.log(cityName);
    cityInput.value = '';
    if(!cityName) {
        return;
    }
    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        // console.log(data);
        let {name, lat, lon, country, state} = data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch(() => {
        alert(`Failed to fetch coordinates of ${cityName}`);
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords;
        //console.log(latitude, longitude);
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
            //console.log(data);
            let {name, country} = data[0];
            getWeatherDetails(name, latitude, longitude, country);
        }).catch(() => {
            alert(`Failed to fetch your coordinates`);
        });
    }, error => {
        if(error.code === error.PERMISSION_DENIED) {
            alert(`Geoloaction permission denied. Please reset your location permission to grant access again`);
        }
    });
}

searchBtn.addEventListener('click', getCityCoordinates);

cityInput.addEventListener('keydown', (event) => {
    if(event.key == 'Enter') {
        getCityCoordinates();
    }
});

locationBtn.addEventListener('click', getUserCoordinates);

window.addEventListener('load', getUserCoordinates);
