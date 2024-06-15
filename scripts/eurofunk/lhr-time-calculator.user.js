// ==UserScript==
// @name         LHR time calculator
// @description  Calculate time sum of time entries and days, including sum of the current day bookings and projected end of working day, in "LHR SelfService".
// @namespace    https://github.com/akoessler/userscripts
// @version      2.1
// @author       akoessler
// @match        https://lohnselfservice/Self/zeiterfassung/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/akoessler/userscripts/main/scripts/eurofunk/lhr-time-calculator.user.js
// @updateURL    https://raw.githubusercontent.com/akoessler/userscripts/main/scripts/eurofunk/lhr-time-calculator.user.js
// ==/UserScript==

// Changelog:
// - 2.0    2024-06-15  Move to new github repository
// - 2.1    2024-06-15  Fix problems introduced in 2.0 with strict comparison using let

// eslint-disable-next-line no-unused-vars
function log(text) {
  //console.log(text);
}

function error(text) {
  console.error("ERROR in userscript: " + text);
}

function formatAsTime(totalMinutes) {
  if (isNaN(totalMinutes)) {
    error("TotalMinutes is not a number: " + totalMinutes);
    return "NaN";
  }

  let hours = 100 + Math.floor(totalMinutes / 60);
  let minutes = 100 + Math.floor(totalMinutes % 60);

  let time = "";
  time += String(hours).substring(1);
  time += ":";
  time += String(minutes).substring(1);
  return time;
}

function calculate() {
  "use strict";
  let table, rows, row, timeSumMinutes = 0;

  table = $("table.tabelle").first();
  rows = table.children("tbody").children("tr");

  rows.each(function () {
    row = $(this);

    if (row.attr("data-zdl-aus-zeile") === "1") {
      // a new day begins
      timeSumMinutes = 0;
      log("$$$ reset day");
    }
    log("$$$ timeSumMinutes: " + timeSumMinutes);

    let timeElement1 = row.children("td.td_zeitdaten").children("span.td_text1_isDate").children("a").first();
    let timeElement2 = row.children("td.td_zeitdaten").children("span.td_text2_isDate").children("a").first();

    if (timeElement1.length === 0 || timeElement2.length === 0) {
      return;
    }

    let openEnd = false;
    let time1 = timeElement1.text().trim();
    let time2 = timeElement2.text().trim();

    if (time2.includes("?")) {
      openEnd = true;
      let now = new Date();
      time2 = now.getHours() + ":" + now.getMinutes();
    }

    let timesplit1 = time1.replace(/[^0-9:]/gi, "").split(":");
    log("$$$ timesplit 1: " + timesplit1);
    let timesplit2 = time2.replace(/[^0-9:]/gi, "").split(":");
    log("$$$ timesplit 2: " + timesplit2);
    let minsToday1 = parseInt(timesplit1[0], 10) * 60 + parseInt(timesplit1[1], 10);
    let minsToday2 = parseInt(timesplit2[0], 10) * 60 + parseInt(timesplit2[1], 10);
    let minsdiff = minsToday2 - minsToday1;
    log("$$$ minsdiff: " + minsdiff);
    timeSumMinutes += minsdiff;
    log("$$$ timeSumMinutes: " + timeSumMinutes);

    let isLastRowOfDay = false;
    if (row.attr("data-zdl-aus-zeile") === row.attr("data-zdl-aus-anz-zeilen-tag")) {
      isLastRowOfDay = true;
    }

    // add saldo to table
    let htmlToAdd = "&nbsp;&nbsp;&nbsp;<span style='font-style:italic;font-size:0.8em;";
    htmlToAdd += openEnd ? "color:steelblue;" : "color:silver;";
    htmlToAdd += isLastRowOfDay ? "font-weight:bold;" : "";
    htmlToAdd += "'>(";

    htmlToAdd += formatAsTime(timeSumMinutes);

    if (openEnd) {
      let minUntil742Hours = 7.7 * 60 - timeSumMinutes;
      let minsDiffUntil742Hours = minsdiff + minUntil742Hours;
      let minsEnd742Hours = minsToday1 + minsDiffUntil742Hours;
      htmlToAdd += " ~ 7,42=";
      htmlToAdd += formatAsTime(minsEnd742Hours);

      let minUntilTenHours = 10 * 60 - timeSumMinutes;
      let minsDiffUntilTenHours = minsdiff + minUntilTenHours;
      let minsEndTenHours = minsToday1 + minsDiffUntilTenHours;
      htmlToAdd += " ~ 10=";
      htmlToAdd += formatAsTime(minsEndTenHours);
    }

    htmlToAdd += ")</span> &nbsp;";
    timeElement2.after(htmlToAdd);
  });
}

$(document).ready(function () {
  setTimeout(calculate, 500);
});
