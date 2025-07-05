// Load environment variables from a .env file into process.env
// This allows you to securely manage secrets like your MongoDB URI or API keys
require('dotenv').config();

// Core dependencies
const express = require('express');         // Express is a minimal and flexible Node.js web application framework
const mongoose = require('mongoose');       // Mongoose is an ODM for MongoDB (helps structure and query MongoDB easily)
const path = require('path');               // Native Node.js module for working with file and directory paths

// Middleware for enhancing security, performance, and logging
const helmet = require('helmet');           // Helps secure your app by setting various HTTP headers
const compression = require('compression'); // Compresses response bodies to improve load times and bandwidth usage
const morgan = require('morgan');           // Logs HTTP requests in the console, useful for debugging and monitoring

const app = express();                      // Creates an Express application instance
const PORT = process.env.PORT || 5000;      // Sets the port for the app (uses environment variable or defaults to 5000)

// Check for essential environment variables before starting the server
if (!process.env.MONGO_URI) {
    console.error("Missing MONGO_URI");     // Warns the developer about missing MongoDB URI
    process.exit(1);                        // Stops the app from running — fails fast to prevent undefined behavior
}

// Security middleware - sets HTTP headers to protect against common vulnerabilities
app.use(helmet());

// Compression middleware - reduces the size of response bodies
app.use(compression());

// Logging middleware - logs all incoming requests in the console
app.use(morgan('dev'));

// Body parsers
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data (e.g., form submissions)
app.use(express.json());                         // Parses JSON bodies (e.g., API POST requests)

// Serves static files from the "public" folder with a caching policy
app.use(express.static('public', { maxAge: '1d' }));

// Templating engine configuration
// EJS lets you embed JavaScript in your HTML — useful for rendering server-side pages
app.set('view engine', 'ejs');

// This tells Express where to look for the EJS template files
app.set('views', path.join(__dirname, 'views'));

// Mounts admin-specific routes from an external file
// The routes in './routes/admin.js' will be prefixed with '/admin' (e.g., /admin/login, /admin/dashboard)
app.use('/admin', require('./routes/admin'));

// A basic route handler for the home page
// Responds with plain text — useful for checking if the server is running
app.get('/', (req, res) => {
    res.send('Job Affair Website Home');
});

// 404 Error Handler — catches any request that didn't match any route above
// Should always be placed after all routes
app.use((req, res) => {
    res.status(404).send('404: Not Found');
});

// Global Error Handler — catches any unhandled errors from routes or middleware
// Always include this to ensure server doesn't crash due to uncaught errors
app.use((err, req, res, next) => {
    console.error(err.stack);               // Logs detailed error stack trace to the console
    res.status(500).send('Something broke!'); // Responds with a 500 Internal Server Error
});

// Async function to start the server
// Used to ensure MongoDB is connected before Express starts listening for requests
async function startServer() {
    try {
        // useNewUrlParser and useUnifiedTopology are best practices to handle MongoDB connection deprecations
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');

        // Starts the Express server and listens on the defined port
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        // If MongoDB fails to connect, log the error and terminate the app
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); // Exiting is a good practice to prevent a broken app from running
    }
}

// Initiates the server startup process
startServer();
