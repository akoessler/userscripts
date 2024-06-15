// ==UserScript==
// @name         Jira board label coloring
// @description  Add colors to the labels on issue cards on a jira board
// @namespace    https://github.com/akoessler/userscripts
// @version      2.0
// @author       akoessler
// @match        https://jira.eurofunk.com/secure/RapidBoard.jspa*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/akoessler/userscripts/main/scripts/eurofunk/e3-jira-board-label-coloring.user.js
// @updateURL    https://raw.githubusercontent.com/akoessler/userscripts/main/scripts/eurofunk/e3-jira-board-label-coloring.user.js
// ==/UserScript==

// Changelog:
// - 2.0    2024-06-15  Move to new github repository

// eslint-disable-next-line no-unused-vars
function log(text) {
  //console.log(text);
}

function addLabelColors() {
  "use strict";

  log("§§§§§ addLabelColors");

  let extraFields = $(".ghx-extra-field");

  let extraFieldIdx;
  for (extraFieldIdx = 0; extraFieldIdx < extraFields.length; extraFieldIdx++) {
    let element = extraFields[extraFieldIdx];
    if (element === null || element === undefined) {
      continue;
    }
    let attribute = element.getAttribute("data-tooltip");
    if (attribute === null || attribute === undefined) {
      continue;
    }
    if (attribute.startsWith("Labels")) {
      let labelSpan = element.getElementsByClassName("ghx-extra-field-content")[0];
      log("§§§§§ #" + labelSpan.innerHTML);
      let labels = labelSpan.innerText.split(",");

      for (let labelIdx = 0; labelIdx < labels.length; labelIdx++) {
        let label = labels[labelIdx];
        let labelColor;
        log("§§§§§   ~ " + label);

        switch (label.trim().toLowerCase()) {
          case "blocked":
            labelColor = "red";
            break;
          case "to_be_verified":
            labelColor = "blue";
            break;
          case "triaged":
            labelColor = "green";
            break;
          case "dependency":
            labelColor = "darkturquoise";
            break;
          case "ranorex-run-and-analysis":
            labelColor = "darkorange";
            break;
          default:
            labelColor = "darkgray";
            break;
        }

        log("§§§§§     > " + labelColor);
        if (labelColor !== undefined) {
          labelSpan.innerHTML = labelSpan.innerHTML.replace(
            label,
            '<span style="font-weight: bold !important;color: ' + labelColor + ' !important">' + label + "</span>"
          );
        }

        log("§§§§§   => " + labelSpan.innerHTML);
      }
    }
  }
}

$(document).ready(function () {
  setTimeout(addLabelColors, 1000);
  setInterval(addLabelColors, 60000);
});
