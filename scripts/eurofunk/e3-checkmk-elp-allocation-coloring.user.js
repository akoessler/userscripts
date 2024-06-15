// ==UserScript==
// @name         ELP Allocation Coloring
// @description  Colors availability in checkmk ELP allocation list.
// @namespace    https://github.com/akoessler/userscripts
// @version      2.0
// @author       akoessler
// @match        https://cmk.e3.local/*
// @match        https://ef-ksnmpsrv01/ef_project/check_mk/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/akoessler/userscripts/main/scripts/eurofunk/e3-checkmk-elp-allocation-coloring.user.js
// @updateURL    https://raw.githubusercontent.com/akoessler/userscripts/main/scripts/eurofunk/e3-checkmk-elp-allocation-coloring.user.js
// ==/UserScript==

// Changelog:
// - 2.0    2024-06-15  Move to new github repository

function colorAvailability() {
  let dataContainers = document.getElementsByClassName("data");
  let dataContainersIdx;
  for (dataContainersIdx = 0; dataContainersIdx < dataContainers.length; dataContainersIdx++) {
    let dataContainer = dataContainers[dataContainersIdx];

    let cells = dataContainer.querySelectorAll("td");
    for (let cellsIdx = 0; cellsIdx < cells.length; cellsIdx++) {
      let cell = cells[cellsIdx];

      if (cell.innerText.startsWith("USED")) {
        cell.parentNode.style.backgroundColor = "lightPink";
      } else if (cell.innerText.startsWith("IDLE")) {
        cell.parentNode.style.backgroundColor = "peachPuff";
      } else if (cell.innerText.startsWith("AVAILABLE")) {
        cell.parentNode.style.backgroundColor = "lightGreen";
      }
    }
  }
}

setInterval(colorAvailability, 3000);
