/**
 * Simple server to serve Swagger UI documentation
 * Run with: node serve-swagger.js
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.SWAGGER_PORT || 3002;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve the Swagger UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'swagger-ui.html'));
});

// Serve the OpenAPI spec
app.get('/swagger.yaml', (req, res) => {
    res.setHeader('Content-Type', 'application/x-yaml');
    res.sendFile(path.join(__dirname, 'swagger.yaml'));
});

app.listen(PORT, () => {
    console.log(`📚 Swagger UI is running at http://localhost:${PORT}`);
    console.log(`📋 OpenAPI spec: http://localhost:${PORT}/swagger.yaml`);
    console.log(`🔗 View documentation: http://localhost:${PORT}`);
});
