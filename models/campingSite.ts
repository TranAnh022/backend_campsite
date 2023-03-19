import mongoose, { Schema } from "mongoose";

const CampingSiteSchema = new Schema({
  title: String,
  images: {
    url: String,
    fileName: String,
  },

  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

export const CampSite = mongoose.model("CampSite", CampingSiteSchema);
