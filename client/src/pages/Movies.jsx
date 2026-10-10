import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import moviesData from "../data/movies";
import MovieList from "../components/MovieList";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Movies() {
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const navigate = useNavigate();

  const [savedMovies, setSavedMovies] = useState([]);

  const [movies, setMovies] = useState(moviesData);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      // Reuse cached movies when returning to the list
      const cachedMovies = sessionStorage.getItem("movievault_movies");

      if (cachedMovies) {
        try {
          const parsedMovies = JSON.parse(cachedMovies);

          if (Array.isArray(parsedMovies) && parsedMovies.length > 0) {
            setMovies(parsedMovies);
            setLoading(false);
            return;
          }
        } catch {
          sessionStorage.removeItem("movievault_movies");
        }
      }

      try {
        const response = await axiosInstance.get("/movies/top250");

        const apiMovies = Array.isArray(response.data) ? response.data : [];

        const moviesToDisplay = apiMovies.length > 0 ? apiMovies : moviesData;

        setMovies(moviesToDisplay);

        // Cache only successful API results
        if (apiMovies.length > 0) {
          sessionStorage.setItem(
            "movievault_movies",
            JSON.stringify(apiMovies),
          );
        }
      } catch (err) {
        console.error("Movie API failed. Using dummy data:", err.message);
        setMovies(moviesData);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchSavedMovies = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axiosInstance.get("/saved-movies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const movies = response.data.savedMovies.map((item) => item.movie);

        setSavedMovies(movies);
      } catch (error) {
        console.error(
          "Unable to fetch saved movies:",
          error.response?.data?.message || error.message,
        );
      }
    };

    fetchSavedMovies();
  }, [navigate]);

  const handleSearch = useCallback(async (query) => {
    if (!query) {
      setSearchResults(null);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    try {
      const response = await axiosInstance.get("/movies/search", {
        params: { query },
      });

      setSearchResults(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(
        "Movie search failed:",
        error.response?.data?.message || error.message,
      );

      setSearchResults([]);
      toast.error("Unable to search movies. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleToggleSave = useCallback(
    async (movieId) => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const movie = [...(searchResults || []), ...movies].find(
        (item) => String(item.id) === String(movieId),
      );

      if (!movie) return;

      const isSaved = savedMovies.some(
        (item) => String(item.id) === String(movieId),
      );

      try {
        if (isSaved) {
          await axiosInstance.delete(
            `/saved-movies/${encodeURIComponent(movieId)}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          setSavedMovies((previous) =>
            previous.filter((item) => String(item.id) !== String(movieId)),
          );

          toast.success("Movie removed from your collection!");
        } else {
          await axiosInstance.post(
            "/saved-movies",
            { movie },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          setSavedMovies((previous) => [...previous, movie]);

          toast.success("Movie saved to your collection!");
        }
      } catch (error) {
        console.error(
          "Unable to update saved movies:",
          error.response?.data?.message || error.message,
        );

        toast.error(
          isSaved
            ? "Failed to remove movie. Please try again."
            : "Failed to save movie. Please try again.",
        );
      }
    },
    [savedMovies, movies, searchResults, navigate],
  );

  return (
    <PageContainer>
      <Navbar
        showSavedOnly={showSavedOnly}
        onToggleCollection={(show) => setShowSavedOnly(show)}
      />

      <Hero />

      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <p>Loading movies...</p>
      ) : searchLoading ? (
        <p>Searching movies...</p>
      ) : (
        <MovieList
          movies={
            searchResults !== null
              ? searchResults
              : showSavedOnly
                ? savedMovies
                : movies
          }
          savedMovies={savedMovies}
          onToggleSave={handleToggleSave}
        />
      )}
      <Footer />
    </PageContainer>
  );
}

export default Movies;

const PageContainer = styled.main`
  display: flex;
  flex-direction: column;
  gap: 24px;

  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;

  background-color: #000000;
  color: #ffffff;

  padding-inline: 3%;

  @media (max-width: 768px) {
    padding-inline: 20px;
  }

  @media (max-width: 480px) {
    padding-inline: 14px;
  }
`;
