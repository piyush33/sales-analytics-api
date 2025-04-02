# 📊 Sales & Revenue Analytics API (GraphQL + MongoDB + Node.js)

This project is a GraphQL API for analyzing customer spending, product sales, and revenue analytics for an e-commerce platform. It uses MongoDB for data storage and Node.js with Express and GraphQL for the server.

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/piyush33/sales-analytics-api.git
cd DelightTree
```

### 2. Install Dependencies

```javascript
npm install
```

Make sure MongoDB is running locally on default port, and it is loaded with data:

```javascript
node scripts/importData.js
```

### 3. Start the Server

```javascript
node index.js
```

### 4. Running Queries

Go to http://localhost:4000/graphql in your browser.

Use sample queries from the queries/queries.graphql file. For example:

```javascript
query {
  getCustomerSpending(customerId: "your-customer-id") {
    customerId
    totalSpent
    averageOrderValue
    lastOrderDate
  }
}
```
