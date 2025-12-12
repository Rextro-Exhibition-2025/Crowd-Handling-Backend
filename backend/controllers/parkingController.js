const Parking = require("../models/Parking");

// @desc    Get all parkings
// @route   GET /api/parkings
exports.getAllParkings = async (req, res) => {
  try {
    const parkings = await Parking.find();
    res.status(200).json({
      success: true,
      count: parkings.length,
      data: parkings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get single parking
// @route   GET /api/parkings/:id
exports.getParkingById = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: parking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Create new parking
// @route   POST /api/parkings
exports.createParking = async (req, res) => {
  try {
    const { parkingName, totalSlots, availableSlots } = req.body;

    // Validation
    if (
      !parkingName ||
      totalSlots === undefined ||
      availableSlots === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide parkingName, totalSlots, and availableSlots",
      });
    }

    const parking = await Parking.create({
      parkingName,
      totalSlots,
      availableSlots,
    });

    res.status(201).json({
      success: true,
      message: "Parking created successfully",
      data: parking,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Parking with this name already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update parking
// @route   PUT /api/parkings/:id
exports.updateParking = async (req, res) => {
  try {
    // Remove parkingName from the update data to prevent name changes
    const { parkingName, ...updateData } = req.body;

    const parking = await Parking.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parking updated successfully",
      data: parking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete parking
// @route   DELETE /api/parkings/:id
exports.deleteParking = async (req, res) => {
  try {
    const parking = await Parking.findByIdAndDelete(req.params.id);

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parking deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update available slots and availability status
// @route   PATCH /api/parkings/:id/availability
exports.updateAvailability = async (req, res) => {
  try {
    const { availableSlots, isAvailable } = req.body;

    const parking = await Parking.findById(req.params.id);

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking not found",
      });
    }

    // Update available slots if provided
    if (availableSlots !== undefined) {
      if (availableSlots > parking.totalSlots) {
        return res.status(400).json({
          success: false,
          message: "Available slots cannot exceed total slots",
        });
      }
      parking.availableSlots = availableSlots;
    }

    // Update availability status if provided
    if (isAvailable !== undefined) {
      parking.isAvailable = isAvailable;
    }

    await parking.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: parking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
