const { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLString, GraphQLList } = require("graphql");
const { CustomerSpendingType, TopProductType, SalesAnalyticsType } = require("./types");
const { getCustomerSpending, getTopSellingProducts, getSalesAnalytics } = require("./resolvers");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getCustomerSpending: {
      type: CustomerSpendingType,
      args: { customerId: { type: GraphQLID } },
      resolve: getCustomerSpending,
    },
    getTopSellingProducts: {
      type: new GraphQLList(TopProductType),
      args: { limit: { type: GraphQLInt } },
      resolve: getTopSellingProducts,
    },
    getSalesAnalytics: {
      type: SalesAnalyticsType,
      args: {
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString },
      },
      resolve: getSalesAnalytics,
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
