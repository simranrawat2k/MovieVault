const express = require("express");

const router = express.Router();

router.get("/top250", async (req, res) => {
  try {
    const response = await fetch(
      "https://imdb236.p.rapidapi.com/api/imdb/top250-movies",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": process.env.RAPIDAPI_HOST,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Failed to fetch movies from IMDb API",
      });
    }

    const movies = await response.json();

    res.status(200).json(movies);
  } catch (error) {
    console.error("Movie API error:", error.message);

    res.status(500).json({
      message: "Unable to fetch movies",
    });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const response = await fetch(
      "https://imdb236.p.rapidapi.com/api/imdb/search?" +
        new URLSearchParams({
          primaryTitleAutocomplete: query.trim(),
          type: "movie",
          rows: "25",
        }),
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": process.env.RAPIDAPI_HOST,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Failed to search movies",
      });
    }

    const data = await response.json();

    res.status(200).json(data.results || []);
  } catch (error) {
    console.error("Movie search error:", error.message);

    res.status(500).json({
      message: "Unable to search movies",
    });
  }
});

module.exports = router;