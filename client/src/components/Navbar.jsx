import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaFilm,
  FaUserCircle,
  FaBookmark,
  FaChevronDown,
  FaCompass,
} from "react-icons/fa";
import { useState } from "react";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fullName =
    user.name?.trim() || user.email?.split("@")[0] || "Movie Lover";

  const firstName = fullName.split(/\s+/)[0];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isCollectionPage = location.pathname === "/my-collection";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const handleNavigation = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  return (
    <Nav>
      <NavInner>
        <Brand to="/movies">
          <Logo>
            <FaFilm />
          </Logo>
          <BrandName>
            Movie<span>Vault</span>
          </BrandName>
        </Brand>

        <NavLinks>
          <NavItem
            type="button"
            $active={!isCollectionPage}
            onClick={() => handleNavigation("/movies")}
          >
            <FaCompass />
            Discover
          </NavItem>

          <NavItem
            type="button"
            $active={isCollectionPage}
            onClick={() => handleNavigation("/my-collection")}
          >
            <FaBookmark />
            My Collection
          </NavItem>
        </NavLinks>

        <UserMenu>
          <UserArea
            type="button"
            title={`Hi, ${firstName}`}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
          >
            <Avatar>
              <FaUserCircle />
            </Avatar>
            <UserName>Hi, {firstName}</UserName>
            <Chevron />
          </UserArea>

          {isDropdownOpen && (
            <Dropdown>
              <MobileNavItem
                type="button"
                $active={!isCollectionPage}
                onClick={() => handleNavigation("/movies")}
              >
                <FaCompass />
                Discover
              </MobileNavItem>

              <MobileNavItem
                type="button"
                $active={isCollectionPage}
                onClick={() => handleNavigation("/my-collection")}
              >
                <FaBookmark />
                My Collection
              </MobileNavItem>

              <MobileDivider />

              <LogoutButton type="button" onClick={handleLogout}>
                Logout
              </LogoutButton>
            </Dropdown>
          )}
        </UserMenu>
      </NavInner>
    </Nav>
  );
}

export default Navbar;

/* ---------- STYLES ---------- */

const Nav = styled.header`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavInner = styled.div`
  width: min(1060px, calc(100% - 48px));
  min-height: 70px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 20px;

  @media (max-width: 700px) {
    width: calc(100% - 28px);
    grid-template-columns: 1fr auto;
    gap: 12px;
    padding: 12px 0;
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 11px;
  width: fit-content;
  text-decoration: none;
  color: #f8f7ff;
`;

const Logo = styled.div`
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 12px;
  color: white;
  font-size: 21px;
  background: linear-gradient(140deg, #b44aff, #6524ed);
  box-shadow: 0 4px 20px #782eea35;

  @media (max-width: 400px) {
    width: 36px;
    height: 36px;
    font-size: 18px;
    border-radius: 10px;
  }
`;

const BrandName = styled.span`
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -1.1px;
  white-space: nowrap;

  span {
    color: #a95cff;
  }

  @media (max-width: 400px) {
    font-size: 21px;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;

  @media (max-width: 700px) {
    display: none;
  }
`;

const NavItem = styled.button`
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 20px;
  border: 1px solid ${({ $active }) => ($active ? "#4e27c9" : "#9990e1")};
  border-radius: 999px;
  color: ${({ $active }) => ($active ? "#fff" : "#d0cde7")};
  background: ${({ $active }) =>
    $active ? "linear-gradient(110deg, #5420c9, #3214a0)" : "transparent"};
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background-color: #1b1933;
    border-color: #40306e;
  }

  svg {
    font-size: 15px;
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  color: #f2eaff;
  font-size: 25px;

  @media (max-width: 400px) {
    width: 30px;
    height: 30px;
    font-size: 21px;
  }
`;

const UserName = styled.span`
  max-width: 125px;
  overflow: hidden;
  color: #f4f1ff;
  font-size: 13px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 400px) {
    max-width: 75px;
    font-size: 12px;
  }
`;

const Chevron = styled(FaChevronDown)`
  flex-shrink: 0;
  color: #b5afcf;
  font-size: 10px;
  margin-left: 10px;

  @media (max-width: 360px) {
    display: none;
  }
`;

const UserMenu = styled.div`
  position: relative;
  justify-self: end;
  min-width: 0;
`;

const UserArea = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: none;
  background: transparent;
  color: #f4f1ff;
  font-family: inherit;
  cursor: pointer;

  @media (max-width: 400px) {
    gap: 6px;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  min-width: 190px;
  padding: 6px;
  background: #111329;
  border: 1px solid #292c49;
  border-radius: 10px;
  box-shadow: 0 8px 24px #00000050;
  z-index: 200;
`;

const MobileNavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 11px 12px;
  border: none;
  border-radius: 6px;
  background: ${({ $active }) =>
    $active ? "linear-gradient(110deg, #5420c9, #3214a0)" : "transparent"};
  color: ${({ $active }) => ($active ? "#ffffff" : "#d0cde7")};
  font-family: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;

  svg {
    font-size: 15px;
  }

  &:hover {
    background-color: #292039;
    color: #ffffff;
  }

  @media (min-width: 700px) {
    display: none;
  }
`;

const MobileDivider = styled.div`
  height: 1px;
  margin: 6px 4px;
  background: #292c49;

  @media (min-width: 700px) {
    display: none;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #ff7777;
  font-family: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #292039;
  }
`;
