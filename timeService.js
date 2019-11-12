const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const THIRTY_SECONDS = 30000;

function startTime() {
    let today = new Date();
    let hour = today.getHours();
    let minutes = today.getMinutes();
    minutes = addZero(minutes);
    
    document.getElementById('time').innerHTML = hour + ":" + minutes;
    
    setTimeout(function() {
        startTime()
    }, THIRTY_SECONDS);
}

function setDate() {
    let today = new Date();
    let day = today.getDay();
    let date = today.getDate();
    let month = today.getMonth();

    document.getElementById('date').innerHTML = `${days[day]}. ${date}. ${months[month]}.`;
    
    setTimeout(function() {
        setDate()
    }, THIRTY_SECONDS);
}

startTime();
setDate();