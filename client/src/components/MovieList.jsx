import React, { useState } from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MovieCard from "./MovieCard";
import { useNavigate } from "react-router-dom";

const MOVIES_PER_PAGE = 10;

function MovieList({ movies, savedMovies, onToggleSave }) {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));

  const startIndex = (safePage - 1) * MOVIES_PER_PAGE;
  const currentMovies = movies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  const getPageNumbers = () => {
    const pages = new Set([
      1,
      totalPages,
      safePage - 1,
      safePage,
      safePage + 1,
    ]);

    return [...pages]
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  if (movies.length === 0) {
    return <EmptyMessage>No movies found.</EmptyMessage>;
  }

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Popular Movies</SectionTitle>
        <SectionSubtitle>Trending now, handpicked by you.</SectionSubtitle>
      </SectionHeader>
      <MovieGrid>
        {currentMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() =>
              navigate(`/movie/${movie.id}`, {
                state: { movie },
              })
            }
            isSaved={savedMovies.some(
              (item) => String(item.id) === String(movie.id),
            )}
            onToggleSave={onToggleSave}
          />
        ))}
      </MovieGrid>

      {totalPages > 1 && (
        <Pagination>
          <PageButton
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
            aria-label="Previous page"
          >
            <FaChevronLeft />
          </PageButton>
          {pageNumbers.map((page, index) => (
            <React.Fragment key={page}>
              {index > 0 && page - pageNumbers[index - 1] > 1 && (
                <span>...</span>
              )}

              <PageButton
                type="button"
                $active={safePage === page}
                onClick={() => setCurrentPage(page)}
                aria-current={safePage === page ? "page" : undefined}
              >
                {page}
              </PageButton>
            </React.Fragment>
          ))}
          <PageButton
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
            aria-label="Next page"
          >
            <FaChevronRight />
          </PageButton>
        </Pagination>
      )}
    </Section>
  );
}

export default MovieList;

const Section = styled.section`
  width: 100%;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 22px 18px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px 10px;
  }

  @media (max-width: 420px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 32px;
`;

const PageButton = styled.button`
  display: grid;
  place-items: center;
  min-width: 38px;
  height: 38px;
  padding: 0 10px;
  border: 1px solid ${({ $active }) => ($active ? "#7540bc" : "#29283e")};
  border-radius: 9px;
  background: ${({ $active }) =>
    $active ? "linear-gradient(110deg, #5420c9, #3214a0)" : "#11111d"};
  color: ${({ $active }) => ($active ? "#ffffff" : "#c0bbd7")};
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: #a95cff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const EmptyMessage = styled.p`
  padding: 40px 0;
  color: #c0bbd7;
  text-align: center;
`;
const SectionHeader = styled.div`
  margin-bottom: 28px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 6px;
  color: #f4f4f5;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.8px;
`;

const SectionSubtitle = styled.p`
  margin: 0;
  color: #92929d;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
`;
