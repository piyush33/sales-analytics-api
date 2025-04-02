const { GraphQLObjectType, GraphQLID, GraphQLFloat, GraphQLString, GraphQLList, GraphQLInt } = require("graphql");

// Type: CustomerSpending
const CustomerSpendingType = new GraphQLObjectType({
  name: "CustomerSpending",
  fields: () => ({
    customerId: { type: GraphQLID },
    totalSpent: { type: GraphQLFloat },
    averageOrderValue: { type: GraphQLFloat },
    lastOrderDate: { type: GraphQLString },
  }),
});

// Type: TopProduct
const TopProductType = new GraphQLObjectType({
  name: "TopProduct",
  fields: () => ({
    productId: { type: GraphQLID },
    name: { type: GraphQLString },
    totalSold: { type: GraphQLInt },
  }),
});

// Type: Category Breakdown
const CategoryBreakdownType = new GraphQLObjectType({
  name: "CategoryBreakdown",
  fields: () => ({
    category: { type: GraphQLString },
    revenue: { type: GraphQLFloat },
  }),
});

// Type: SalesAnalytics
const SalesAnalyticsType = new GraphQLObjectType({
  name: "SalesAnalytics",
  fields: () => ({
    totalRevenue: { type: GraphQLFloat },
    completedOrders: { type: GraphQLInt },
    categoryBreakdown: { type: new GraphQLList(CategoryBreakdownType) },
  }),
});

module.exports = {
  CustomerSpendingType,
  TopProductType,
  SalesAnalyticsType,
};
