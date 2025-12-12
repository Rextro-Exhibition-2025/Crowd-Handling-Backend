const express = require("express");
const router = express.Router();
const {
  getAllParkings,
  getParkingById,
  createParking,
  updateParking,
  deleteParking,
  updateAvailability,
} = require("../controllers/parkingController");

// CRUD routes
router.get("/", getAllParkings);
router.get("/:id", getParkingById);
router.post("/", createParking);
router.put("/:id", updateParking);
router.delete("/:id", deleteParking);

// Special endpoint to update availability
router.patch("/:id/availability", updateAvailability);

module.exports = router;
