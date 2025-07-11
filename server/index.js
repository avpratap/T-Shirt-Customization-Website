// import express from 'express';
// import * as dotenv from 'dotenv';
// import cors from 'cors';

// import dalleRoutes from './routes/dalle.routes.js';

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json({ limig: "50mb" }))

// app.use("/api/v1/dalle", dalleRoutes);

// app.get('/', (req, res) => {
//   res.status(200).json({ message: "Hello from DALL.E" })
// })

// app.listen(8080, () => console.log('Server has started on port 8080'))



import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import dalleRoutes from './routes/dalle.routes.js';

dotenv.config();

const app = express();

// Get __dirname equivalent in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || true  // Allow same origin in production
    : 'http://localhost:5173',          // Vite dev server port
  credentials: true
}));

// Middleware
app.use(express.json({ limit: "50mb" })); // Fixed typo: "limig" -> "limit"
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/v1/dalle", dalleRoutes);

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: "Server is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle React routing - send all non-API requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} else {
  // Development route
  app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello from DALL.E - Development Mode" });
  });
}

// Use PORT from environment (Railway sets this automatically)
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server has started on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});