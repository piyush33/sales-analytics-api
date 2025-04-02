const mongoose = require("mongoose");
const csv = require("csvtojson");
const path = require("path");

// Load Mongoose models
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Order = require("../models/Order");

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(" Connected to MongoDB");
    importData();
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
  });

// Main import function
async function importData() {
  try {
    const basePath = path.join(__dirname, "../data");

    // 1️ Import Customers
    const customers = await csv().fromFile(`${basePath}/customers.csv`);
    await Customer.deleteMany({});
    await Customer.insertMany(customers);
    console.log(` Imported ${customers.length} customers`);

    // 2️ Import Products
    const products = await csv().fromFile(`${basePath}/products.csv`);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(` Imported ${products.length} products`);

    // 3️ Import Orders
    let orders = await csv().fromFile(`${basePath}/orders.csv`);

    // Convert stringified products field to JSON
    orders = orders.map((order) => {
      let products = order.products.replace(/'/g, '"'); // replace single quotes with double quotes

      return {
        _id: order._id,
        customerId: order.customerId,
        totalAmount: parseFloat(order.totalAmount),
        orderDate: new Date(order.orderDate),
        status: order.status,
        products: JSON.parse(products).map((p) => ({
          productId: p.productId,
          quantity: parseInt(p.quantity),
          priceAtPurchase: parseFloat(p.priceAtPurchase),
        })),
      };
    });

    await Order.deleteMany({});
    await Order.insertMany(orders);
    console.log(`Imported ${orders.length} orders`);

    console.log(" All data imported successfully");
    process.exit();
  } catch (err) {
    console.error(" Error importing data:", err);
    process.exit(1);
  }
}
