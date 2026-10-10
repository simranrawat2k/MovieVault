import styled from "styled-components";
import movieHero from "../assets/movie_image.jpg";

const Hero = () => {
  return (
    <HeroContainer>
      <HeroContent>
        <HeroText>
          <Eyebrow>
            YOUR NEXT MOVIE NIGHT STARTS HERE
          </Eyebrow>

          <Heading>
            <span>Discover your next</span>
            <Highlight>favourite film.</Highlight>
          </Heading>

          <Description>
            Explore movies, find hidden gems, and keep your
            favourites all in one place.
          </Description>
        </HeroText>

        <HeroImageWrapper>
          <HeroImage
            src={movieHero}
            alt="Movie-themed hero illustration"
          />
        </HeroImageWrapper>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;

// Styled Components

const HeroContainer = styled.section`
  width: 100%;
  background: linear-gradient(
    to right,
    #1a094b 0%,
    #040404 50%,
    #250c67 100%
  );
  color: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

const Eyebrow = styled.p`
  display: flex;
  align-items: center;
  margin: 0 0 6px;
  color: #d0cde7;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 1.6;

  svg {
    flex-shrink: 0;
    color: #a95cff;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    justify-content: center;
    font-size: 9px;
    letter-spacing: 1.2px;
    margin-bottom: 16px;
  }
`;

const Heading = styled.h1`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0;
  font-size: clamp(30px, 3.5vw, 48px);
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -1.5px;

  /* First line stays white */
  > span:first-child {
    color: #ffffff;
    white-space: nowrap;
  }

  /* Second line stays purple */
  > span:last-child {
    color: #a95cff;
  }

  @media (max-width: 1050px) {
    font-size: clamp(28px, 3.4vw, 38px);
    letter-spacing: -1px;
  }

  @media (max-width: 768px) {
    align-items: center;
    font-size: clamp(28px, 5.5vw, 40px);
  }

  @media (max-width: 380px) {
    font-size: 27px;
    letter-spacing: -0.8px;
  }
`;

const Highlight = styled.span`
  color: #a95cff;
`;


const Description = styled.p`
  max-width: 440px;
  margin: 10px 0 0;
  color: #d0cde7;
  font-size: 15px;
  line-height: 1.8;

  @media (max-width: 768px) {
    margin-top: 18px;
    max-width: 420px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    line-height: 1.7;
  }
`;




const HeroContent = styled.div`
  width: 100%;
  height: 280px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  box-sizing: border-box;

  @media (max-width: 1050px) and (min-width: 769px) {
    height: 220px;
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 0;
    padding: 28px 22px;
    justify-content: center;
  }
`;

const HeroText = styled.div`
  flex: 1;
  min-width: 0;
  padding: 20px 0 20px 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  position: relative;
  z-index: 1;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0;
    align-items: center;
    text-align: center;
  }
`;

const HeroImageWrapper = styled.div`
  flex: 0 0 43%;
  min-width: 0;
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const HeroImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: cover;
  object-position: center;
`;

