const electron = require("electron");
const { ipcRenderer } = electron;
const { createEvent } = require("./createEvent");
const path = require("path");
const BrowserWindow = electron.remote.BrowserWindow;

let fileSaveLoc = "/Users/arpangupta/Downloads";

let tracking = false;
let startTime, settingsWindow;

document.getElementById("resetTracking").addEventListener("click", e => {
  tracking = false;
  resetFields();
  document.getElementById("diff").innerHTML = "";
});

document.getElementById("Settings").addEventListener("click", e => {
  settingsWindow = new BrowserWindow({
    frame: true,
    width: 350,
    height: 200,
    //width: 800,
    //height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });
  //settingsWindow.webContents.openDevTools();
  settingsWindow.loadURL(`file://${__dirname}/settings.html`);
});

function convertMS(milliseconds) {
  var day, hour, minute, seconds;
  seconds = Math.floor(milliseconds / 1000);
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  return {
    day: day,
    hour: hour,
    minute: minute,
    seconds: seconds
  };
}

function formatDelta(time) {
  var timeStr = "";
  if (time.day > 0) {
    console.log("Ayo");
    if (time.day > 1) {
      timeStr = timeStr.concat(`${time.day} days `);
    } else {
      timeStr = timeStr.concat(`${time.day} day `);
    }
  }

  if (time.hour > 0) {
    if (time.hour > 1) {
      timeStr = timeStr.concat(`${time.hour} hours `);
    } else {
      timeStr = timeStr.concat(`${time.hour} hour `);
    }
  } else {
    if (time.day > 0) {
      timeStr = timeStr.concat("0 hours ");
    }
  }

  if (time.minute > 0) {
    if (time.minute > 1) {
      timeStr = timeStr.concat(`${time.minute} minutes `);
    } else {
      timeStr = timeStr.concat(`${time.minute} minute `);
    }
  } else {
    if (time.day > 0 || time.hour > 0) {
      timeStr = timeStr.concat("0 minutes ");
    }
  }

  if (time.seconds === 1) {
    timeStr = timeStr.concat(`${time.seconds} second`);
  } else {
    timeStr = timeStr.concat(`${time.seconds} seconds`);
  }

  return timeStr;
}

function manageTime() {
  if (tracking === false) {
    return;
  }
  var diff = document.getElementById("diff");
  diff.innerHTML = findDifference();
  var refresh = 1000;
  setTimeout(manageTime, refresh);
}

function findDifference() {
  timeDelta = new Date() - startTime;
  return formatDelta(convertMS(timeDelta));
}

document.getElementById("now").addEventListener("click", e => {
  updateStartTime();
});

function updateStartTime() {
  var now = new Date();
  startTime = now;
  var utcString = now.toISOString().substring(0, 19);
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  var localDatetime =
    year +
    "-" +
    (month < 10 ? "0" + month.toString() : month) +
    "-" +
    (day < 10 ? "0" + day.toString() : day) +
    "T" +
    (hour < 10 ? "0" + hour.toString() : hour) +
    ":" +
    (minute < 10 ? "0" + minute.toString() : minute) +
    utcString.substring(16, 19);
  var datetimeField = document.getElementById("startTimeDate");
  datetimeField.value = localDatetime;
}

document.getElementById("startTimeDate").addEventListener("change", e => {
  startTime = new Date(e.target.value);
});

ipcRenderer.on("newStartTime", event => {
  if (tracking === false) {
    updateStartTime();
  }
});

ipcRenderer.on("fileLocation", (event, path) => {
  fileSaveLoc = path[0];
  settingsWindow.close();
});

const startButton = document.getElementById("startTracking");
startButton.addEventListener("click", e => {
  if (startTime === null) {
    updateStartTime();
  }
  tracking = true;
  manageTime();
});

function resetFields() {
  startTime = null;
  document.getElementById("startTimeDate").value = null;
  document.getElementById("eventNameText").value = null;
}

const endButton = document.getElementById("endTracking");
endButton.addEventListener("click", e => {
  console.log("Wazup");
  eventName = document.getElementById("eventNameText").value;
  var endTime = new Date();
  console.log(fileSaveLoc);
  createEvent(eventName, startTime, endTime, fileSaveLoc);
  tracking = false;
  resetFields();
});
