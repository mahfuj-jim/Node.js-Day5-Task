const fs = require("fs");
const path = require("path");

function writeToLogFile() {
  const logFilePath = path.join(__dirname, "..", "logs", "app.log");

  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}\n`;

  fs.appendFile(logFilePath, logMessage, (error) => {
    if (error) {
      console.error("Error writing to log file:", error);
    } else {
      console.log("Log entry added to log file.");
    }
  });
}

class Product {
  async getAllData() {
    try {
      const dataFilePath = path.join(__dirname, "..", "data", "manga.json");
      const content = await fs.promises.readFile(dataFilePath, "utf8");
      return JSON.parse(content);
    } catch (error) {
      return false;
    }
  }

  async addProductData(newProduct) {
    try {
      const dataFilePath = path.join(__dirname, "..", "data", "manga.json");
      const existingData = await this.getAllData();

      newProduct = {id: existingData[existingData.length - 1].id + 1, ...newProduct};
      existingData.push(newProduct);

      await fs.promises.writeFile(
        dataFilePath,
        JSON.stringify(existingData),
        "utf8"
      );
      writeToLogFile();
      
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = new Product();
