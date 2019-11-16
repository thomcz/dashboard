const BIRTHDAY_CALENDER = apiKeys.calender.birthdayCalender;
const PRIMARY_CALENDER = apiKeys.calender.primaryCalender;
const SECONDARY_CALENDER = apiKeys.calender.secondaryCalender;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client
    .init({
      apiKey: apiKeys.calender.apiKey,
      clientId: apiKeys.calender.clientId,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .then(
      function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      },
      function(error) {
        document.getElementById("birthdays").innerHTML = JSON.stringify(
          error,
          null,
          2
        );
      }
    );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    signoutButton.style.display = "block";
    listTodaysBirthdays();
    listTodaysEvents();
  } else {
    authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
  }
  setTimeout(function() {
    startTime();
  }, ONE_HOUR);
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function listTodaysBirthdays() {
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  gapi.client.calendar.events
    .list({
      calendarId: BIRTHDAY_CALENDER,
      timeMin: today.toISOString(),
      timeMax: tomorrow.toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime"
    })
    .then(function(response) {
      showBirthdays(response.result.items);
    });
}

function showBirthdays(birthdays) {
  if (birthdays.length > 0) {
    if (birthdays.length == 1) {
      document.getElementById("birthday-title").innerHTML = "Heute hat";
    } else {
      document.getElementById("birthday-title").innerHTML = "Heute haben";
    }

    for (i = 0; i < birthdays.length; i++) {
      document.getElementById("birthdays").innerHTML +=
        birthdays[i].summary + "\n";
    }
    document.getElementById("birthday-footer").innerHTML =
      "Geburtstag" + String.fromCodePoint(0x1f389);
  } else {
    document.getElementById("birthday-footer").innerHTML =
      "Heute hat niemand Geburtstag";
  }
}

function listTodaysEvents() {
  let today = new Date();

  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  gapi.client.calendar.events
    .list({
      calendarId: PRIMARY_CALENDER,
      timeMin: today.toISOString(),
      timeMax: tomorrow.toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 5,
      orderBy: "startTime"
    })
    .then(function(primaryResponse) {
      gapi.client.calendar.events
      .list({
        calendarId: SECONDARY_CALENDER,
        timeMin: today.toISOString(),
        timeMax: tomorrow.toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 5,
        orderBy: "startTime"
      })
      .then(function(secondaryResponse) {
        let events = primaryResponse.result.items.concat(secondaryResponse.result.items);
        showEvents(events);
      });
    });
}

function showEvents(events) {
  events.sort(function(event1,event2){
    return new Date(event1.start.dateTime) - new Date(event2.start.dateTime);
  });
  for (i = 0; i < events.length; i++) {
    let item = document.createElement('div');
    item.className = 'calenderItem primary';
    let event = document.createElement('h5');
    let date = document.createElement('p');
    event.appendChild(document.createTextNode(events[i].summary));
    let start = events[i].start.dateTime;
    let end = events[i].end.dateTime;
    date.appendChild(document.createTextNode(`${getHour(start)}:${getMinutes(start)} bis ${getHour(end)}:${getMinutes(end)}`));
    item.appendChild(event);
    item.appendChild(date);
    document.getElementById("calender").appendChild(item);
  }
}
