// Client ID and API key from the Developer Console
// var CLIENT_ID = '763758807601-b94fq7jcr0qupvp1abuirl7nk5ualsvs.apps.googleusercontent.com';
// var API_KEY = 'AIzaSyD_hq1BF7cKtjwpZ6lx_ciOmcaWThQiyWU';

const BIRTHDAY_CALENDER = apiKeys.calender.birthdayCalender;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: apiKeys.calender.apiKey,
    clientId: apiKeys.calender.clientId,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
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

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var p = document.getElementById('calender');
  var textContent = document.createTextNode(message + '\n');
  p.appendChild(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    let today = new Date();
    today.setHours(0,0,0,0);

    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0,0,0,0);

  gapi.client.calendar.events.list({
    'calendarId': BIRTHDAY_CALENDER,
    'timeMin': today.toISOString(),
    'timeMax': tomorrow.toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    

    if (events.length > 0) {
        if (events.length == 1) {
            document.getElementById('birthday-title').innerHTML = 'Heute hat';
        } else {
            document.getElementById('birthday-title').innerHTML = 'Heute haben';
        }
      
        for (i = 0; i < events.length; i++) {
            document.getElementById('birthdays').innerHTML += events[i].summary + '\n';
        }
        document.getElementById('birthday-footer').innerHTML = 'Geburtstag' + String.fromCodePoint(0x1F389);
    } else {
        document.getElementById('birthday-footer').innerHTML = 'Heute hat niemand Geburtstag';
    }
  });
}