const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const cityIdKarlsruhe = "2892794";
const appKey = "9c95291fb45642c7a4d5a64154d01206";

function addZero(digit) {
  if (digit < 10) {
    digit = "0" + digit;
  }
  return digit;
}

function startTime() {
  let today = new Date();
  let hour = today.getHours();
  let minutes = today.getMinutes();
  // add a zero in front of numbers<10
  minutes = addZero(minutes);
  document.getElementById('time').innerHTML = hour + ":" + minutes;
  t = setTimeout(function() {
    startTime()
  }, 500);
}

function setDate() {
    let today = new Date();
    let day = today.getDay();
    let date = today.getDate();
    let month = today.getMonth();

    document.getElementById('date').innerHTML = `${days[day]}. ${date}. ${months[month]}.`;
}

const setActualWeather = async () => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityIdKarlsruhe}&units=metric&lang=de&appid=${appKey}`);
  const actualWeather = await response.json(); //extract JSON from the http response
    
  const icon = actualWeather.weather[0].icon;

  document.getElementById('actual-weather').src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  document.getElementById('actual-weather-desc').innerHTML = actualWeather.weather[0].description;
  document.getElementById('actual-weather-temp').innerHTML = Math.round(actualWeather.main.temp) + '°';  
}

const setForecastWeather = async () => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityIdKarlsruhe}&units=metric&lang=de&appid=${appKey}`);
  const forecastWeather = await response.json(); //extract JSON from the http response
   
  for (let i = 0; i < 4; i++) {
    const icon = forecastWeather.list[i].weather[0].icon;
    
    let date = new Date(forecastWeather.list[i].dt_txt);
    let hour = addZero(date.getHours());

    document.getElementById(`forecast-weather${i}`).src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    document.getElementById(`forecast-weather-desc${i}`).innerHTML = forecastWeather.list[i].weather[0].description;
    document.getElementById(`forecast-weather-time${i}`).innerHTML = `${hour}:00`;
    document.getElementById(`forecast-weather-temp${i}`).innerHTML = Math.round(forecastWeather.list[i].main.temp) + '°';  
  }
  
}

startTime();
setDate();
setActualWeather();
setForecastWeather();