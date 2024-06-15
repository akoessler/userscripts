// ==UserScript==
// @name         Toggl: Color time errors
// @description  Colors errornous time entries in Toggl timer. Inconsecutive entries are colored blue, days with over 10 hours are colored orange, days with over 20 hours are colored red.
// @namespace    https://github.com/akoessler/userscripts
// @version      2.0
// @author       akoessler
// @match        https://track.toggl.com/timer
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/akoessler/userscripts/main/scripts/toggl/color-time-record-errors.user.js
// @updateURL    https://raw.githubusercontent.com/akoessler/userscripts/main/scripts/toggl/color-time-record-errors.user.js
// ==/UserScript==

// Changelog:
// - 1.9    2023-09-28  Update css class selector to changes by toggl "e1n8js470" and "EnhancedTotalTime". Rename some variables to be clearer what they contain.
// - 2.0    2024-06-15  Move to new github repository

// eslint-disable-next-line no-unused-vars
function log(text) {
  //console.log(text);
}

function colorTotalTime() {
  // selector must find the exact div element of the total day sum number
  let dayTotalTimeEntries = document.querySelectorAll("div[class*=TotalTimeCounter]");
  log("§§§§§ Day Total Time Entries: " + dayTotalTimeEntries.length);
  let dayTotalTimeEntryIdx;
  for (dayTotalTimeEntryIdx = 0; dayTotalTimeEntryIdx < dayTotalTimeEntries.length; dayTotalTimeEntryIdx++) {
    let dayTotalTimeEntry = dayTotalTimeEntries[dayTotalTimeEntryIdx];

    let hours = parseFloat(dayTotalTimeEntry.innerText);
    let fgColor = "";
    let bgColor = "";
    if (hours >= 20) {
      fgColor = "white";
      bgColor = "red";
    } else if (hours >= 10) {
      bgColor = "orange";
    } else {
      bgColor = "white";
    }
    log("§§§§§   '" + dayTotalTimeEntry.innerText + "' => " + hours + " => '" + bgColor + "'");

    dayTotalTimeEntry.style.backgroundColor = bgColor;
    dayTotalTimeEntry.style.color = fgColor;
  }
}

function colorTimeEntries() {
  // selector must find the elements for the whole day (where inside are the single time booking entries of one day)
  let timeBookingDays = document.getElementsByClassName("e1n8js470");
  log("§§§§§ Time Booking Days: " + timeBookingDays.length);
  let timeBookingDayIdx;
  for (timeBookingDayIdx = 0; timeBookingDayIdx < timeBookingDays.length; timeBookingDayIdx++) {
    let timeBookingOneDay = timeBookingDays[timeBookingDayIdx];

    // selector must find the div that is around the start-/end-time text, e.g. "15:00 - 16:00"
    let timeBookingEntries = timeBookingOneDay.querySelectorAll("div[class*=EnhancedTotalTime]");
    log("§§§§§   Time Booking Entries: " + timeBookingEntries.length);
    let timeBookingEntryIdx;
    for (timeBookingEntryIdx = 0; timeBookingEntryIdx < timeBookingEntries.length; timeBookingEntryIdx++) {
      if (timeBookingEntryIdx <= 0) {
        continue;
      }

      let prevElement = timeBookingEntries[timeBookingEntryIdx];
      let element = timeBookingEntries[timeBookingEntryIdx - 1];

      if (prevElement === undefined || element === undefined) {
        continue;
      }

      log("§§§§§   " + prevElement.innerText + " / " + element.innerText);

      let timeRegex = /(\d?\d:\d\d) - (\d?\d:\d\d)/;
      let endTimeMatch = prevElement.innerText.match(timeRegex);
      let startTimeMatch = element.innerText.match(timeRegex);

      if (endTimeMatch === null) {
        log("endTimeMatch is null");
        continue;
      }
      if (startTimeMatch === null) {
        log("startTimeMatch is null");
        continue;
      }

      let endTime = endTimeMatch[2];
      let startTime = startTimeMatch[1];

      if (endTime.length === 4) {
        endTime = "0" + endTime;
      }
      if (startTime.length === 4) {
        startTime = "0" + startTime;
      }

      log("§§§§§     END: " + endTime + " / START: " + startTime);

      let endDate = new Date("1970-01-01T" + endTime + "Z");
      let startDate = new Date("1970-01-01T" + startTime + "Z");

      log("§§§§§     END: " + endDate + " / START: " + startDate);

      let fgColor = "";
      let bgColor = "";
      if (startDate.getTime() < endDate.getTime()) {
        fgColor = "white";
        bgColor = "red";
        log("§§§§§       start < end  => new color: " + bgColor);
      } else if (startDate.getTime() !== endDate.getTime()) {
        fgColor = "black";
        bgColor = "lightskyblue";
        log("§§§§§       start != end  => new color: " + bgColor);
      } else {
        log("§§§§§       reset");
      }

      element.firstChild.style.backgroundColor = bgColor;
      element.firstChild.style.color = fgColor;
    }
  }
}

function colorAllErrors() {
  colorTotalTime();
  colorTimeEntries();
}

setInterval(colorAllErrors, 5000);
