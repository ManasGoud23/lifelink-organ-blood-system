const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware and other configurations can be added here

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});