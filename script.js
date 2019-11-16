const ONE_HOUR = 3600000;

function getHour(dateTime) {
  let date = new Date(dateTime);
  return addZero(date.getHours());
}

function getMinutes(dateTime) {
  let date = new Date(dateTime);
  return addZero(date.getMinutes());
}

function addZero(digit) {
  if (digit < 10) {
    digit = "0" + digit;
  }
  return digit;
}
