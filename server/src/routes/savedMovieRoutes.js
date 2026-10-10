const express = require("express");
const SaveMovie = require("../models/SavedMovie");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Save a movie to My Collection
router.post("/", authMiddleware, async (req, res) => {
  try {
    const movie = req.body.movie;

    if (!movie || !movie.id) {
      return res.status(400).json({
        message: "A valid movie object is required",
      });
    }

    const movieId = String(movie.id);

    const savedMovie = await SaveMovie.findOneAndUpdate(
      {
        user: req.user.id,
        movieId,
      },
      {
        $setOnInsert: {
          user: req.user.id,
          movieId,
          movie,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      message: "Movie saved successfully",
      savedMovie,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Movie is already saved",
      });
    }

    console.error("Save movie error:", error);

    return res.status(500).json({
      message: "Unable to save movie",
    });
  }
});

// Get the movie list
router.get("/", authMiddleware, async (req, res) => {
  try {
    const savedMovies = await SaveMovie.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      savedMovies,
    });
  } catch (error) {
    console.error("Fetch saved movies error:", error);

    return res.status(500).json({
      message: "Unable to fetch saved movies",
    });
  }
});

// Remove a movie
router.delete("/:movieId", authMiddleware, async (req, res) => {
  try {
    const deletedMovie = await SaveMovie.findOneAndDelete({
      user: req.user.id,
      movieId: req.params.movieId,
    });

    if (!deletedMovie) {
      return res.status(404).json({
        message: "Saved movie not found",
      });
    }

    return res.status(200).json({
      message: "Movie removed from your collection",
    });
  } catch (error) {
    console.error("Remove saved movie error:", error);

    return res.status(500).json({
      message: "Unable to remove movie",
    });
  }
});

module.exports = router;
