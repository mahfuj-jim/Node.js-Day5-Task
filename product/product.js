const fs = require("fs");
const path = require("path");

class Product {
  dataFilePath = path.join(__dirname, "..", "data", "manga.json");

  async getAllData() {
    try {
      const content = await fs.promises.readFile(this.dataFilePath, "utf8");
      return JSON.parse(content);
    } catch (error) {
      console.error("Error reading data:", error);
      return [];
    }
  }

  async addProductData(newProduct) {
    try {
      const existingData = await this.getAllData();
      existingData.push(newProduct);
      await fs.promises.writeFile(this.dataFilePath, JSON.stringify(existingData, null, 2), "utf8");
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new Product();