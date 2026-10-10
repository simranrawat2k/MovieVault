import styled from "styled-components";
import { FaStar, FaBookmark } from "react-icons/fa";

function MovieCard({ movie, isSaved, onToggleSave, onClick }) {
  const rating = Number(movie.averageRating);

  return (
    <Card
      onClick={onClick}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") onClick?.();
      }}
      aria-label={`View details for ${movie.primaryTitle}`}
    >
      <PosterWrapper>
        <Poster
          src={movie.primaryImage}
          alt={movie.primaryTitle}
          loading="lazy"
        />

        <PosterOverlay />

        <SaveButton
          type="button"
          $isSaved={isSaved}
          onClick={(event) => {
            event.stopPropagation();
            onToggleSave?.(movie.id);
          }}
          aria-label={isSaved ? "Remove saved movie" : "Save movie"}
          title={isSaved ? "Remove from saved" : "Save movie"}
        >
          <FaBookmark />
        </SaveButton>

        {Number.isFinite(rating) && (
          <Rating>
            <FaStar />
            {rating.toFixed(1)}
          </Rating>
        )}
      </PosterWrapper>

      <MovieInfo>
        <MovieTitle title={movie.primaryTitle}>{movie.primaryTitle}</MovieTitle>

        <MovieMeta>
          {movie.startYear && <Year>{movie.startYear}</Year>}

          {movie.startYear && movie.genres?.[0] && <Separator />}

          {movie.genres?.[0] && <Genre>{movie.genres[0]}</Genre>}
        </MovieMeta>
      </MovieInfo>
    </Card>
  );
}

export default MovieCard;

const Card = styled.article`
  min-width: 0;
  background: transparent;
  transition: transform 0.25s ease;

  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #8b5cf6;
    outline-offset: 4px;
  }

  &:hover {
    transform: translateY(-4px);
  }

  &:hover img {
    transform: scale(1.04);
  }
`;

const PosterWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  border-radius: 10px;
  background: #18181b;
`;

const Poster = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
`;

const PosterOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    #00000035,
    transparent 25%,
    transparent 75%,
    #00000025
  );
`;

const SaveButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid #ffffff45;
  border-radius: 50%;
  background: ${({ $isSaved }) => ($isSaved ? "#8b5cf6" : "#111111b8")};
  color: white;
  font-size: 12px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: background 0.2s ease;

  &:hover {
    background: #8b5cf6;
  }
`;

const Rating = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 8px;
  border-radius: 6px;
  background: #111111d9;
  color: #facc15;
  font-size: 12px;
  font-weight: 600;

  svg {
    font-size: 10px;
  }
`;

const MovieInfo = styled.div`
  padding: 12px 2px 4px;
  text-align: center;
`;

const MovieTitle = styled.h3`
  margin: 0 0 10px;
  overflow: hidden;
  color: #f4f4f5;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;

  ${Card}:hover & {
    color: #c4b5fd;
  }
`;

const MovieMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 0;
`;

const Year = styled.span`
  color: #a1a1aa;
  font-size: 12px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
`;

const Separator = styled.span`
  width: 4px;
  height: 4px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #8b5cf6;
`;

const Genre = styled.span`
  overflow: hidden;
  color: #c4b5fd;
  font-size: 11px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
