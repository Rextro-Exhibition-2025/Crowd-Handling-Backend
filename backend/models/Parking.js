const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    parkingName: {
      type: String,
      required: [true, "Please provide parking name"],
      trim: true,
      unique: true,
    },
    totalSlots: {
      type: Number,
      required: [true, "Please provide total number of slots"],
      min: [0, "Total slots cannot be negative"],
    },
    availableSlots: {
      type: Number,
      required: [true, "Please provide available slots"],
      min: [0, "Available slots cannot be negative"],
      validate: {
        validator: function (value) {
          return value <= this.totalSlots;
        },
        message: "Available slots cannot exceed total slots",
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Update isAvailable based on availableSlots
parkingSchema.pre("save", function (next) {
  this.isAvailable = this.availableSlots > 0;
  next();
});

module.exports = mongoose.model("Parking", parkingSchema);
