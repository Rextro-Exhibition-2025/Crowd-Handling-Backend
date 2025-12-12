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
  if (this.availableSlots > this.totalSlots) {
    return next(new Error("Available slots cannot exceed total slots"));
  }
  this.isAvailable = this.availableSlots > 0;
  next();
});

// Validate on findOneAndUpdate
parkingSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const docToUpdate = await this.model.findOne(this.getQuery());

  if (!docToUpdate) {
    return next();
  }

  const totalSlots =
    update.totalSlots !== undefined
      ? update.totalSlots
      : docToUpdate.totalSlots;
  const availableSlots =
    update.availableSlots !== undefined
      ? update.availableSlots
      : docToUpdate.availableSlots;

  if (availableSlots > totalSlots) {
    return next(new Error("Available slots cannot exceed total slots"));
  }

  // Auto-update isAvailable based on availableSlots
  if (update.availableSlots !== undefined || update.totalSlots !== undefined) {
    this.setUpdate({ ...update, isAvailable: availableSlots > 0 });
  }

  next();
});

module.exports = mongoose.model("Parking", parkingSchema);
