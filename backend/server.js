const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const parkingRoutes = require("./routes/parkingRoutes");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/parkings", parkingRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Parking Management API",
    version: "1.0.0",
    endpoints: {
      getAllParkings: "GET /api/parkings",
      getParkingById: "GET /api/parkings/:id",
      createParking: "POST /api/parkings",
      updateParking: "PUT /api/parkings/:id",
      deleteParking: "DELETE /api/parkings/:id",
      updateAvailability: "PATCH /api/parkings/:id/availability",
    },
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
