const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

const getCustomerSpending = async (_, { customerId }) => {
  const result = await Order.aggregate([
    { $match: { customerId, status: "completed" } },
    {
      $group: {
        _id: "$customerId",
        totalSpent: { $sum: "$totalAmount" },
        averageOrderValue: { $avg: "$totalAmount" },
        lastOrderDate: { $max: "$orderDate" },
      },
    },
  ]);

  return result.length
    ? {
        customerId,
        totalSpent: result[0].totalSpent,
        averageOrderValue: result[0].averageOrderValue,
        lastOrderDate: new Date(result[0].lastOrderDate).toISOString(),
      }
    : {
        customerId,
        totalSpent: 0,
        averageOrderValue: 0,
        lastOrderDate: null,
      };
};

const getTopSellingProducts = async (_, { limit }) => {
  const result = await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.productId",
        totalSold: { $sum: "$products.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        productId: "$_id",
        name: "$product.name",
        totalSold: 1,
      },
    },
  ]);

  return result;
};

const getSalesAnalytics = async (_, { startDate, endDate }) => {
  const result = await Order.aggregate([
    {
      $match: {
        orderDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        status: "completed",
      },
    },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
              completedOrders: { $sum: 1 },
            },
          },
        ],
        categoryBreakdown: [
          { $unwind: "$products" },
          {
            $lookup: {
              from: "products",
              localField: "products.productId",
              foreignField: "_id",
              as: "product",
            },
          },
          { $unwind: "$product" },
          {
            $group: {
              _id: "$product.category",
              revenue: {
                $sum: { $multiply: ["$products.quantity", "$products.priceAtPurchase"] },
              },
            },
          },
          {
            $project: {
              category: "$_id",
              revenue: 1,
              _id: 0,
            },
          },
        ],
      },
    },
  ]);

  const summary = result[0].summary[0] || {};
  return {
    totalRevenue: summary.totalRevenue || 0,
    completedOrders: summary.completedOrders || 0,
    categoryBreakdown: result[0].categoryBreakdown,
  };
};

module.exports = {
  getCustomerSpending,
  getTopSellingProducts,
  getSalesAnalytics,
};
