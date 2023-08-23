const http = require("http");
const product = require("./product/product.js");

const success = (message, data) => {
  return {
    success: true,
    message: message,
    data: data,
  };
};

const failure = (message) => {
  return {
    success: false,
    message: message,
  };
};

const server = http.createServer(async function (req, res) {
  if (req.url === "/products/create" && req.method === "POST") {
    let body = "";
    req.on("data", (buffer) => {
      body += buffer;
    });

    req.on("end", async () => {
      try {
        const newProduct = JSON.parse(body);
        const result = await product.addProductData(newProduct);
        
        if (result) {
          res.writeHead(200, { "Content-Type": "text/json" });
          res.write(JSON.stringify(success("New product added.", newProduct)));
          return res.end();
        } else {
          res.writeHead(500, { "Content-Type": "text/json" });
          res.write(JSON.stringify(failure("Failed to add product.")));
          return res.end();
        }
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.writeHead(400, { "Content-Type": "text/json"});
        res.write(JSON.stringify(failure("Invalid JSON data.")));
        return res.end();
      }
    });
  } else if (req.url === "/products/all" && req.method === "GET") {
    try {
      const allData = await product.getAllData();
      res.writeHead(200, { "Content-Type": "text/json" });
      res.write(JSON.stringify(success("All product data.", allData)));
      return res.end();
    } catch (error) {
      console.error("Error getting all data:", error);
      res.writeHead(500, { "Content-Type": "text/json" });
      res.write(JSON.stringify(failure("Failed to get product data.")));
      return res.end();
    }
  }
});

server.listen(8000, () => {
  console.log("Server is running on 8000.....");
});