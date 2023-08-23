const http = require("http");
const product = require("./product/product.js");

const success = (message, data) => {
  return {
    success: true,
    message: message,
    data: data,
  };
};

const failure = (res, code, message) => {
  res.writeHead(code, { "Content-Type": "text/json" });
  res.write(
    JSON.stringify({
      success: false,
      message: message,
    })
  );
  return res.end();
};

const validateProduct = (product) => {
  if (
    !product.hasOwnProperty("name") ||
    !product.hasOwnProperty("price") ||
    !product.hasOwnProperty("stock") ||
    !product.hasOwnProperty("author") ||
    product.hasOwnProperty("id")
  ) {
    return false;
  }

  return true;
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

        if (validateProduct(newProduct)) {
          const result = await product.addProductData(newProduct);

          if (result) {
            res.writeHead(200, { "Content-Type": "text/json" });
            res.write(
              JSON.stringify(success("New product added.", newProduct))
            );
            return res.end();
          } else {
            failure(res, 500, "Failed to add product.");
          }
        } else {
          failure(res, 400, "Invalid Data.");
        }
      } catch (error) {
        failure(res, 400, "Invalid JSON data.");
      }
    });
  } else if (req.url === "/products/all" && req.method === "GET") {
    try {
      const result = await product.getAllData();
      if (result != false) {
        res.writeHead(200, { "Content-Type": "text/json" });
        res.write(JSON.stringify(success("All product data.", result)));
        return res.end();
      } else {
        failure(res, 500, "Failed to get product data.");
      }
    } catch (error) {
      failure(res, 500, "Failed to get product data.");
    }
  } else {
    failure(res, 500, "Invalid Request.");
  }
});

server.listen(8000, () => {
  console.log("Server is running on 8000.....");
});
