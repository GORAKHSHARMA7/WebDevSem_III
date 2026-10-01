# Assignment 1: Product Management REST API

A complete Product Management REST API built with **Node.js** and **Express.js**.

## Setup & Run

```bash
npm install
node index.js
```

Server starts at: `http://localhost:3000`

---

## Product Schema

| Field    | Type   | Description         |
|----------|--------|---------------------|
| id       | Number | Auto-generated ID   |
| name     | String | Product name        |
| category | String | Product category    |
| price    | Number | Product price       |
| quantity | Number | Stock quantity      |

---

## API Routes

### 1. GET all products
```
GET http://localhost:3000/products
```

### 2. GET product by ID
```
GET http://localhost:3000/products/1
```

### 3. POST – Add new product
```
POST http://localhost:3000/products
Content-Type: application/json

{
  "name": "Keyboard",
  "category": "Electronics",
  "price": 1500,
  "quantity": 30
}
```

### 4. PUT – Update a product
```
PUT http://localhost:3000/products/1
Content-Type: application/json

{
  "price": 80000,
  "quantity": 5
}
```

### 5. DELETE – Delete a product
```
DELETE http://localhost:3000/products/1
```

### 6. GET – Filter by Category
```
GET http://localhost:3000/products/category/Electronics
```

---

## Error Responses

| Scenario              | Status | Message                                  |
|-----------------------|--------|------------------------------------------|
| ID not found          | 404    | `Product with ID X not found`            |
| Category not found    | 404    | `No products found in category: 'X'`     |
| Missing POST fields   | 400    | `All fields are required: ...`           |
