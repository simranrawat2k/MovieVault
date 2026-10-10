const mongoose = require("mongoose");

const saveMovieSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    movieId: {
      type: String,
      required: true,
    },

    movie: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

saveMovieSchema.index(
  { user: 1, movieId: 1 },
  { unique: true }
);

module.exports = mongoose.model("SaveMovie", saveMovieSchema);
