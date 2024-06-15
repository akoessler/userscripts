// ==UserScript==
// @name         Redmine tracker color
// @description  Redmine tracker color
// @namespace    https://github.com/akoessler/userscripts
// @version      2.0
// @author       akoessler
// @match        https://redmine-e3.eurofunk.com/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/akoessler/userscripts/main/scripts/eurofunk/e3-redmine-tracker-color.user.js
// @updateURL    https://raw.githubusercontent.com/akoessler/userscripts/main/scripts/eurofunk/e3-redmine-tracker-color.user.js
// ==/UserScript==

// Changelog:
// - 2.0    2024-06-15  Move to new github repository

function addTrackerColors() {
  let css, head, style;
  css =
    "\
      /* Feature */ \
      tr.tracker-1\
      {\
        background: #CCEE99 !important;\
      }\
      \
      /* Internal Bug */ \
      tr.tracker-2\
      {\
        background: #FFFFCC !important;\
      }\
      \
      /* Incident */ \
      tr.tracker-3\
      {\
        background: #D4BBE3 !important;\
      }\
      \
      /* Problem */ \
      tr.tracker-4\
      {\
        background: #FFCC66 !important;\
      }\
      \
      /* Documentation */ \
      tr.tracker-5\
      {\
        background: #F9FF1F !important;\
      }\
      \
      /* Task */ \
      tr.tracker-9\
      {\
        background: #c0e7ff !important;\
      }\
      \
      /* Collection */ \
      tr.tracker-10\
      {\
        background: #DEDEDE !important;\
      }\
      /* Selection */ \
      tr.context-menu-selection {\
        background-color: #507AAA !important;\
        color: #f8f8f8 !important;\
      }\
    ";

  let interruptedElements, i, element;
  interruptedElements = $(".cf_29:contains('Yes')");

  for (i = 0; i < interruptedElements.length; i++) {
    element = interruptedElements[i];
    css =
      css +
      "\
        #" +
      element.parentElement.id +
      " td\
        {\
            border: 3px solid blue !important;\
        }\
        ";
  }

  let unclearElements;
  unclearElements = $(".cf_28:contains('Yes')");

  for (i = 0; i < unclearElements.length; i++) {
    element = unclearElements[i];
    css =
      css +
      "\
        #" +
      element.parentElement.id +
      " td\
        {\
            border: 3px solid red !important;\
        }\
        ";
  }

  let mergePendingElements;
  mergePendingElements = $(".cf_62:contains('Yes')");

  for (i = 0; i < mergePendingElements.length; i++) {
    element = mergePendingElements[i];
    css =
      css +
      "\
        #" +
      element.parentElement.id +
      " td\
        {\
            border: 3px solid #FF00FF !important;\
        }\
        ";
  }

  head = document.getElementsByTagName("head")[0];
  if (!head) {
    return;
  }
  style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = css;
  head.appendChild(style);
}

$(document).ready(function () {
  addTrackerColors();
});
