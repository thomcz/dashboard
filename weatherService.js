const cityId = apiKeys.openWeather.cityId;
const appKey = apiKeys.openWeather.apiKey;

const setActualWeather = async () => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&lang=de&appid=${appKey}`
  );
  const actualWeather = await response.json(); //extract JSON from the http response

  const icon = actualWeather.weather[0].icon;

  document.getElementById(
    "actual-weather"
  ).src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  document.getElementById("actual-weather-desc").innerHTML =
    actualWeather.weather[0].description;
  document.getElementById("actual-weather-temp").innerHTML =
    Math.round(actualWeather.main.temp) + "°";

  setTimeout(function() {
    startTime();
  }, ONE_HOUR);
};

const setForecastWeather = async () => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&lang=de&appid=${appKey}`
  );
  const forecastWeather = await response.json(); //extract JSON from the http response

  for (let i = 0; i < 4; i++) {
    setWeather(forecastWeather.list[i], i);
  }

  setTimeout(function() {
    startTime();
  }, ONE_HOUR);
};

function setWeather(forecastWeather, index) {
  const icon = forecastWeather.weather[0].icon;

  let date = new Date(forecastWeather.dt_txt);
  let hour = getHour(date);

  document.getElementById(
    `forecast-weather${index}`
  ).src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  document.getElementById(`forecast-weather-desc${index}`).innerHTML =
    forecastWeather.weather[0].description;
  document.getElementById(
    `forecast-weather-time${index}`
  ).innerHTML = `${hour}:00`;
  document.getElementById(`forecast-weather-temp${index}`).innerHTML =
    Math.round(forecastWeather.main.temp) + "°";
}

setActualWeather();
setForecastWeather();
