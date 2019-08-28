const electron = require("electron");
const { ipcRenderer } = electron;

console.log("working!");

document.getElementById("fileLoc").addEventListener("click", e => {
  const path = document.getElementById("SaveLoc").files[0].path;
  ipcRenderer.send("fileLocation", [path]);
});
