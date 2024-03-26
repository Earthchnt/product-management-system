const express = require('express');
const app = express();

const port = 3000;

// Middleware for parsing JSON
app.use(express.json());

const products = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 1000, stock: 5 },
    { id: 2, name: 'Phone', category: 'Electronics', price: 500, stock: 10 }
];

// GET all products
app.get('/products', (req, res) => {
    res.json(products);
});

// POST new product
app.post('/products', (req, res) => {
    if (!req.body.name || !req.body.category || !req.body.price || !req.body.stock) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const newProduct = {
        id: generateUniqueId(),
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

const generateUniqueId = () => {
    let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    while (products.some(p => p.id === id)) {
        id++;
    }
    return id;
}

// PUT update product
app.put('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!req.body.name || !req.body.category || !req.body.price || !req.body.stock) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    product.name = req.body.name;
    product.category = req.body.category;
    product.price = req.body.price;
    product.stock = req.body.stock;

    res.json(product);
});

// DELETE product
app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

    const deletedProduct = products.splice(productIndex, 1);
    res.json(deletedProduct);
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})