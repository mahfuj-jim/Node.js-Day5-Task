const events = require("events");
const fs = require("fs");
const path = require("path");

const emitter = new events();
const backupEvent = "backup";

function createFile(fileDir, filePath) {
  try {
    fs.mkdirSync(fileDir);
    fs.writeFileSync(filePath, "[]", "utf-8");
    console.log(`${filePath} file created.`);
  } catch (error) {
    console.error(error);
  }
}

function updateHistoryFile(time) {
  const historyDir = path.join(__dirname, "history");
  const historyFilePath = path.join(historyDir, "history.json");

  if (!fs.existsSync(historyFilePath)) {
    createFile(historyDir, historyFilePath);
  }

  const historyData = fs.readFileSync(historyFilePath, "utf-8");
  const jsonHistoryData = JSON.parse(historyData);

  let newData = { time: time };
  
  try{
    newData = {id: jsonHistoryData[jsonHistoryData.length - 1].id + 1, ...newData};
  }catch(err){
    newData = {id: 0, ...newData};
  }

  jsonHistoryData.push(newData);

  fs.writeFileSync(historyFilePath, JSON.stringify(jsonHistoryData), "utf-8");
}

function printUpdateMessage() {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  console.log(
    `Bckup file updated at ${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  );

  updateHistoryFile(`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`);
}

emitter.on(backupEvent, () => {
  const backupDir = path.join(__dirname, "backup");
  const backupFilePath = path.join(backupDir, "manga.json");

  const dataDir = path.join(__dirname, 'data');
  const dataFilePath = path.join(dataDir, "manga.json");

  if (!fs.existsSync(backupFilePath)) {
    createFile(backupDir, backupFilePath);
  }

  const data = fs.readFileSync(dataFilePath, "utf-8");
  const jsonData = JSON.parse(data);

  const backupData = fs.readFileSync(backupFilePath, "utf-8");
  const backupJsonData = JSON.parse(backupData);

  if (JSON.stringify(jsonData) !== JSON.stringify(backupJsonData)) {
    fs.writeFileSync(backupFilePath, JSON.stringify(jsonData), "utf-8");
    printUpdateMessage();
  }
});

setInterval(() => {
  emitter.emit(backupEvent, "OutPut");
}, 2000);
