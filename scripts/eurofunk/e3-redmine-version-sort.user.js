// ==UserScript==
// @name         Redmine version sort
// @description  Redmine version sort
// @namespace    https://github.com/akoessler/userscripts
// @version      2.0
// @author       akoessler
// @match        https://redmine-e3.eurofunk.com/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/akoessler/userscripts/main/scripts/eurofunk/e3-redmine-version-sort.user.js
// @updateURL    https://raw.githubusercontent.com/akoessler/userscripts/main/scripts/eurofunk/e3-redmine-version-sort.user.js
// ==/UserScript==

// Changelog:
// - 2.0    2024-06-15  Move to new github repository

//Any <select> control that contains an <option> with the text '2.0.2' is considered to be a version dropdown list
let selector = "select:contains('2.0.2')";
let multiselectSelector = "select[multiple]";
let versionNumberRegex = /^(\d+)\.(\d+)\.(\d+)(.*)/;
let regexVersionPart1Group = 1;
let regexVersionPart2Group = 2;
let regexVersionPart3Group = 3;
let regexVersionHfAndSpGroup = 4;

let versionPrefixRegex = /^Eldis 3 - /;

let dropdowns = [];
let multiselectDropdowns = [];
let ownModification = false;

function parseVersionNumber(versionString) {
  let match = versionNumberRegex.exec(versionString);
  return [
    parseInt(match[regexVersionPart1Group], 10),
    parseInt(match[regexVersionPart2Group], 10),
    parseInt(match[regexVersionPart3Group], 10),
    match[regexVersionHfAndSpGroup],
  ];
}

function compareVersionNumber(version1, version2) {
  for (let i = 0; i < 4; ++i) {
    if (version1[i] < version2[i]) {
      return -1;
    }
    if (version1[i] > version2[i]) {
      return -1;
    }
  }
  return 0;
}

function sort(a, b) {
  let result, aSort, bSort, aIsNumeric, bIsNumeric;
  aSort = a.text;
  bSort = b.text;

  // empty line should be first
  if (!aSort) {
    result = -3;
  } else if (!bSort) {
    result = 3;
  } else {
    aSort = aSort.replace(versionPrefixRegex, "");
    bSort = bSort.replace(versionPrefixRegex, "");
    aIsNumeric = versionNumberRegex.test(aSort);
    bIsNumeric = versionNumberRegex.test(bSort);

    // Non-Matching version numbers should be last
    if (!aIsNumeric && bIsNumeric) {
      result = 2;
    } else if (!bIsNumeric && aIsNumeric) {
      // Non-Matching version numbers should be last
      result = -2;
    } else if (!aIsNumeric && !bIsNumeric) {
      // No matching version number, just do string compare
      result = bSort.localeCompare(aSort);
    } else {
      // Both version numbers match, so parse and compare
      result = compareVersionNumber(parseVersionNumber(bSort), parseVersionNumber(aSort));
    }
  }
  //console.log("sort " + aSort + "   /   " + bSort + "  /  " + result);
  return result;
}

function sortVersionFields() {
  let i, container, selected, myOptions;

  //console.log("  sortVersionFields");
  dropdowns = $(selector);

  ownModification = true;

  for (i = 0; i < dropdowns.length; i++) {
    container = $(dropdowns[i]);
    selected = container.val();
    myOptions = $("option", dropdowns[i]);

    myOptions.sort(sort);

    container.empty().append(myOptions);
    selected = container.val(selected);
  }

  multiselectDropdowns = $(multiselectSelector);
  for (i = 0; i < multiselectDropdowns.length; i++) {
    container = $(multiselectDropdowns[i]);
    if (container.attr("multiple")) {
      container.attr("size", 10);
    } else {
      container.removeAttr("size");
    }
  }

  ownModification = false;
}

function sortVersionFieldsEvent() {
  //console.log("sortVersionFieldsEvent");
  if (!ownModification) {
    sortVersionFields();
  }
}

function registerTrackerChangeEvent() {
  //console.log("  registerTrackerChangeEvent");
  let trackerSelectors, i, selector;
  trackerSelectors = ["#all_attributes"];

  for (i = 0; i < trackerSelectors.length; i++) {
    selector = $(trackerSelectors[i]);
    selector.bind("DOMSubtreeModified", sortVersionFieldsEvent);
  }
}

function checkDOMChange() {
  let tempDropdowns;

  tempDropdowns = $(selector);
  // console.log("checkDOMChange: "+tempDropdowns.length);

  if (tempDropdowns.length !== dropdowns.length) {
    //console.log("Count has changed! Before = "+dropdowns.length+", after = "+tempDropdowns.length);
    sortVersionFields();
  }
  setTimeout(checkDOMChange, 100);
}

function toggleSize(el) {
  if (el.attr("size")) {
    el.removeAttr("size");
  } else {
    el.attr("size", 10);
  }
}

$(document).ready(function () {
  //console.log("window load");
  registerTrackerChangeEvent();
  checkDOMChange();
  sortVersionFields();

  $("body").on("click", ".toggle-multiselect", function () {
    toggleSize($(this).siblings("select"));
  });
});
