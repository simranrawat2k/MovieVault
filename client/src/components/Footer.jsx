import styled from "styled-components";
import { FaFilm, FaStar } from "react-icons/fa";

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <Brand>
          <BrandIcon>
            <FaFilm />
          </BrandIcon>
          <BrandName>MovieVault</BrandName>
        </Brand>

        <Tagline>
          Made for movie lovers
          <FaStar className="star" />
          Powered by your passion
        </Tagline>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;

const FooterContainer = styled.footer`
  width: 100%;
  box-sizing: border-box;
  background-color: #000000;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 20px;
  margin-top: 10px;
`;

const FooterContent = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const BrandIcon = styled.div`
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #7c3aed;
  color: #ffffff;
  font-size: 16px;
`;

const BrandName = styled.span`
  color: #ffffff;
  font-size: 20px;
  font-weight: 750;
  letter-spacing: -0.5px;
`;

const Tagline = styled.p`
  margin: 0;
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: #a1a1b0;
  font-size: 14px;
  line-height: 1.7;
  text-align: center;

  .star {
    color: #a78bfa;
    font-size: 12px;
    flex-shrink: 0;
  }
`;
