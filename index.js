const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./graphql/schema");

const app = express();

//  Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log(" MongoDB connected successfully");
});

//  GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true, // Enable GraphiQL IDE
  })
);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(` Server ready at http://localhost:${PORT}/graphql`);
});
