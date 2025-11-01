// API Key : 214c1edf66184abf8db200615252910
// 	http://api.weatherapi.com/v1/current.json?key=214c1edf66184abf8db200615252910&q=${searchLocation}
//  http://api.weatherapi.com/v1/forecast.json?key=214c1edf66184abf8db200615252910&q=${searchLocation}&days=2

// On loading the page
window.addEventListener("load", () => {
    getWeather();
});


window.addEventListener("load", getUserLocation);


function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        getWeather("Egypt");
    }
}

function success(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    getWeather(lat + "," + lon);
}

function error() {
    getWeather("Egypt");
}

// When user starts to type a city/country name 
// it starts to change the weather to whatever corresponds

// Variables 
var searchInput = document.getElementById("searchInput");

// User event 
searchInput.addEventListener("input", function (){
    // console.log(searchInput.value)
    getWeather(searchInput.value)
})

async function getWeather( searchLocation = "egypt") {
    try {  
        // Making only one request as the weather forecast api returns the data of the current day too 
        // var response = await fetch(`http://api.weatherapi.com/v1/current.json?key=214c1edf66184abf8db200615252910&q=${searchLocation}`)
        var forecastResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=214c1edf66184abf8db200615252910&q=${searchLocation}&days=3`)
        // var data = await response.json()
        var forecastData = await forecastResponse.json()
        // console.log(data)
        console.log(forecastData);
        displayWeatherToday(forecastData);
        displayWeatherForecast(forecastData);
    }
    catch (error) {
        console.log(error)
    }
}


function displayWeatherToday(forecastData) {
    // Working on Date
    var lastUpdated = forecastData.current.last_updated; 
    var date = new Date(lastUpdated);

    // Format 
    var dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    var dayNumber = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
    
    // Getting the data required from API
    var cityName    = forecastData.location.name;
    var temperature = forecastData.current.temp_c;
    var condition   = forecastData.current.condition.text;
    var icon        = "https:" + forecastData.current.condition.icon;
    var humidity    = forecastData.current.humidity;
    var windSpeed   = forecastData.current.wind_kph;
    var windDir     = forecastData.current.wind_dir;

    // Getting HTML elements
    var headerDay    = document.querySelector(".weather-today");
    var locationEl   = document.querySelector(".weather-today .location");
    var degreeEl     = document.querySelector(".weather-today .degree");
    var customEl     = document.querySelector(".weather-today .custom");
    var iconEl       = document.querySelector(".weather-today .forecast-icon img");
    var restInfo     = document.querySelector(".weather-today .rest-of-info");
    
    // Updating Default data with the dynamic API ones
    // headerDay.firstChild.textContent = dayName;
    // headerDate.textContent = `${monthName} ${dayNumber}`;
    headerDay.querySelector(".card-header").innerHTML = `
            ${dayName}
            <span>${dayNumber}</span>
        `;

    locationEl.innerHTML = `<i class="ri-map-pin-line me-1"></i> ${cityName}`;
    degreeEl.textContent = `${temperature}°C`;
    customEl.textContent = condition;
    iconEl.src = icon;
    iconEl.alt = condition;

    restInfo.innerHTML = `
        <span><img src="imgs/icon-umberella.png" class="m-1" alt="humidity">${humidity}%</span> 
        <span><img src="imgs/icon-wind.png" class="m-1" alt="wind">${windSpeed} km/h</span> 
        <span><img src="imgs/icon-compass.png" class="m-1" alt="compass">${windDir}</span> `;

}

function displayWeatherForecast (forecastData) {

    // Get forecast array
    var forecastDays = forecastData.forecast.forecastday;

    // Select all forecast cards
    var forecastCards = document.querySelectorAll(".weather-forecasting");

     // Loop through the 2nd and 3rd day only
    for (let i = 1; i <= 2; i++) {
        var card = forecastCards[i - 1]; // 0 for 2nd day, 1 for 3rd day
        var dayData = forecastDays[i];
        
        // Extract info
        var date = new Date(dayData.date);
        var dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        var dayNumber = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
        var maxTemp = dayData.day.maxtemp_c;
        var minTemp = dayData.day.mintemp_c;
        var icon = dayData.day.condition.icon;
        var condition = dayData.day.condition.text;

        // Update card header
        card.querySelector(".card-header").innerHTML = `
            ${dayName}
            <span>${dayNumber}</span>
        `;
        // Update temps and icon
        var degreeElements = card.querySelectorAll(".degree");
        degreeElements[0].innerHTML = `${maxTemp}°C`;
        degreeElements[1].innerHTML = `${minTemp}°C`;

        card.querySelector(".custom").textContent = condition;
        card.querySelector(".forecast-icon img").src = "https:" + icon;
        card.querySelector(".forecast-icon img").alt = condition;
    }
}