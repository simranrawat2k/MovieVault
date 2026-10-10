import { useEffect, useState } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
  const timer = setTimeout(() => {
    onSearch?.(searchTerm.trim());
  }, 1000);

  return () => clearTimeout(timer);
}, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <SearchContainer>
      <SearchIcon>
        <FaSearch />
      </SearchIcon>

      <SearchInput
        type="text"
        placeholder="Search for movies..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        aria-label="Search movies"
      />

      {searchTerm && (
        <ClearButton
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
        >
          &times;
        </ClearButton>
      )}
    </SearchContainer>
  );
};

export default SearchBar;

// Styled Components

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 54px;
  padding: 6px 12px;
  box-sizing: border-box;

  background: #0b0b16;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 25px;

  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: #a95cff;
    box-shadow: 0 0 0 3px rgba(169, 92, 255, 0.12);
  }
`;

const SearchIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  color: #ffffff;
  font-size: 16px;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 8px;

  background: transparent;
  border: none;
  outline: none;

  color: #ffffff;
  font-size: 14px;
  font-family: inherit;

  &::placeholder {
    color: #858398;
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: #d0cde7;
  font-size: 23px;
  cursor: pointer;
  padding: 4px 10px;

  &:hover {
    color: #ffffff;
  }
`;
