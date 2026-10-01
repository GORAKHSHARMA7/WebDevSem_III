const express = require('express');
const app = express();
const PORT = 3000;

// Middleware: Parse incoming JSON request bodies
app.use(express.json());

// ─────────────────────────────────────────────
//  In-memory Product Data Store
// ─────────────────────────────────────────────
let products = [
  { id: 1, name: 'Laptop',       category: 'Electronics', price: 75000, quantity: 10 },
  { id: 2, name: 'Headphones',   category: 'Electronics', price: 2500,  quantity: 50 },
  { id: 3, name: 'Desk Chair',   category: 'Furniture',   price: 8000,  quantity: 15 },
  { id: 4, name: 'Coffee Mug',   category: 'Kitchen',     price: 350,   quantity: 100 },
  { id: 5, name: 'Bookshelf',    category: 'Furniture',   price: 5500,  quantity: 8  },
];

// Auto-incrementing ID counter
let nextId = 6;

// ─────────────────────────────────────────────
//  ROOT ROUTE: GET /
//  API Documentation & Overview
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Product Management REST API',
    endpoints: {
      getAllProducts: 'GET /products',
      getProductById: 'GET /products/:id',
      filterByCategory: 'GET /products/category/:category',
      addProduct: 'POST /products',
      updateProduct: 'PUT /products/:id',
      deleteProduct: 'DELETE /products/:id'
    }
  });
});

// ─────────────────────────────────────────────
//  ROUTE 1: GET /products
//  Display ALL products
// ─────────────────────────────────────────────
app.get('/products', (req, res) => {
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// ─────────────────────────────────────────────
//  ROUTE 2: GET /products/category/:category
//  Filter Products by Category
//  NOTE: Must be defined BEFORE /products/:id
//        to avoid 'category' being treated as an id
// ─────────────────────────────────────────────
app.get('/products/category/:category', (req, res) => {
  const category = req.params.category.toLowerCase();

  const filtered = products.filter(
    (p) => p.category.toLowerCase() === category
  );

  if (filtered.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No products found in category: '${req.params.category}'`
    });
  }

  res.json({
    success: true,
    category: req.params.category,
    count: filtered.length,
    data: filtered
  });
});

// ─────────────────────────────────────────────
//  ROUTE 3: GET /products/:id
//  Display a Particular Product
// ─────────────────────────────────────────────
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${id} not found`
    });
  }

  res.json({
    success: true,
    data: product
  });
});

// ─────────────────────────────────────────────
//  ROUTE 4: POST /products
//  Add a New Product
// ─────────────────────────────────────────────
app.post('/products', (req, res) => {
  const { name, category, price, quantity } = req.body;

  // Validate required fields
  if (!name || !category || price === undefined || quantity === undefined) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required: name, category, price, quantity'
    });
  }

  const newProduct = {
    id: nextId++,
    name,
    category,
    price,
    quantity
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: 'Product added successfully',
    data: newProduct
  });
});

// ─────────────────────────────────────────────
//  ROUTE 5: PUT /products/:id
//  Update an Existing Product
// ─────────────────────────────────────────────
app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${id} not found`
    });
  }

  const { name, category, price, quantity } = req.body;

  // Merge existing fields with updated fields
  products[productIndex] = {
    ...products[productIndex],
    ...(name     !== undefined && { name }),
    ...(category !== undefined && { category }),
    ...(price    !== undefined && { price }),
    ...(quantity !== undefined && { quantity })
  };

  res.json({
    success: true,
    message: `Product with ID ${id} updated successfully`,
    data: products[productIndex]
  });
});

// ─────────────────────────────────────────────
//  ROUTE 6: DELETE /products/:id
//  Delete a Product
// ─────────────────────────────────────────────
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${id} not found`
    });
  }

  const deleted = products.splice(productIndex, 1)[0];

  res.json({
    success: true,
    message: `Product with ID ${id} deleted successfully`,
    data: deleted
  });
});

// ─────────────────────────────────────────────
//  404 Fallback & Error Handling Middleware
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload provided'
    });
  }
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// ─────────────────────────────────────────────
//  Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Product Management API running at http://localhost:${PORT}`);
  console.log('\n📋 Available Routes:');
  console.log('  GET    /products                     → Get all products');
  console.log('  GET    /products/:id                 → Get product by ID');
  console.log('  POST   /products                     → Add new product');
  console.log('  PUT    /products/:id                 → Update product by ID');
  console.log('  DELETE /products/:id                 → Delete product by ID');
  console.log('  GET    /products/category/:category  → Filter by category');
});
