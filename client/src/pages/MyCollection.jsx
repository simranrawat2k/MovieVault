import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaBookmark, FaFilm } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";

function MyCollection() {
  const [savedMovies, setSavedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchSavedMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const response = await axiosInstance.get("/saved-movies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const movies = response.data.savedMovies.map((item) => item.movie);

      setSavedMovies(movies);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your collection. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    Promise.resolve().then(() => fetchSavedMovies());
  }, [fetchSavedMovies]);

  const handleRemoveMovie = async (movieId) => {
    try {
      const token = localStorage.getItem("token");

      await axiosInstance.delete(
        `/saved-movies/${encodeURIComponent(movieId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSavedMovies((previous) =>
        previous.filter((movie) => String(movie.id) !== String(movieId)),
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to remove this movie. Please try again.",
      );
    }
  };

  return (
    <PageContainer>
      <Navbar />

      <Main>
        <Header>
          <Heading>My Collection</Heading>

          <Subtitle>
            Your personal collection of movies worth remembering.
          </Subtitle>

          {!loading && !error && (
            <MovieCount>
              {savedMovies.length}{" "}
              {savedMovies.length === 1 ? "movie" : "movies"} saved
            </MovieCount>
          )}
        </Header>

        {loading ? (
          <StatusMessage>Loading your collection...</StatusMessage>
        ) : error ? (
          <EmptyState>
            <StateIcon>
              <FaFilm />
            </StateIcon>
            <StateTitle>Couldn't load your collection</StateTitle>
            <StateDescription>{error}</StateDescription>
            <RetryButton onClick={fetchSavedMovies}>Try again</RetryButton>
          </EmptyState>
        ) : savedMovies.length === 0 ? (
          <EmptyState>
            <StateIcon>
              <FaBookmark />
            </StateIcon>
            <StateTitle>Your collection is empty</StateTitle>
            <StateDescription>
              Save movies you love, and they'll appear here.
            </StateDescription>
            <RetryButton onClick={() => navigate("/movies")}>
              <FaFilm />
              Explore movies
            </RetryButton>
          </EmptyState>
        ) : (
          <MovieGrid>
            {savedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isSaved={true}
                onToggleSave={handleRemoveMovie}
                onClick={() =>
                  navigate(`/movie/${movie.id}`, {
                    state: { movie },
                  })
                }
              />
            ))}
          </MovieGrid>
        )}
      </Main>

      <Footer />
    </PageContainer>
  );
}

export default MyCollection;

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #0b0b12;
  color: #ffffff;
`;

const Main = styled.main`
  width: 100%;
  max-width: 1400px;
  box-sizing: border-box;
  padding: 48px 6% 64px;
  margin: 0 auto;
  flex: 1;

  @media (max-width: 600px) {
    padding: 32px 18px 48px;
  }
`;

const Header = styled.header`
  margin-bottom: 36px;
`;

const Heading = styled.h1`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 750;
  letter-spacing: -1px;

  svg {
    color: #a78bfa;
    font-size: 27px;
  }
`;

const Subtitle = styled.p`
  margin: 12px 0 0;
  color: #a1a1b0;
  font-size: 15px;
  line-height: 1.7;
`;

const MovieCount = styled.p`
  margin: 18px 0 0;
  color: #c4b5fd;
  font-size: 13px;
  font-weight: 600;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 28px 20px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 850px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 12px;
  }

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
  }
`;

const StatusMessage = styled.p`
  padding: 60px 16px;
  color: #a1a1b0;
  text-align: center;
`;

const EmptyState = styled.div`
  min-height: 300px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
`;

const StateIcon = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: rgba(124, 58, 237, 0.15);
  color: #a78bfa;
  font-size: 25px;
  margin-bottom: 22px;
`;

const StateTitle = styled.h2`
  margin: 0;
  font-size: 21px;
  font-weight: 700;
`;

const StateDescription = styled.p`
  max-width: 420px;
  margin: 12px 0 22px;
  color: #a1a1b0;
  font-size: 14px;
  line-height: 1.7;
`;

const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  background: #7c3aed;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #6d28d9;
  }
`;
