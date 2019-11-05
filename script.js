const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function checkTime(digit) {
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
  minutes = checkTime(minutes);
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
    let year = today.getFullYear();

    document.getElementById('date').innerHTML = days[day] + ". " + date + ". " + months[month] + ".";
}

startTime();
setDate();