
import styled from "styled-components";
import {
  FaArrowLeft,
  FaPlay,
  FaStar,
  FaClock,
  FaCalendarAlt,
  FaGlobe,
  FaBuilding,
  FaExternalLinkAlt,
  FaChartBar,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function MovieDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const movie = location.state?.movie;

  if (!movie) {
    return (
      <Page>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft /> Go back
        </BackButton>
        <Message>Movie details could not be loaded.</Message>
      </Page>
    );
  }

  const genres = movie.genres?.filter(Boolean) || [];
  const interests = movie.interests?.filter(Boolean) || [];
  const companies = movie.productionCompanies?.filter(
    (company) => company?.name
  ) || [];
  const countries = movie.countriesOfOrigin?.filter(Boolean) || [];
  const languages = movie.spokenLanguages?.filter(Boolean) || [];
  const links = movie.externalLinks?.filter(Boolean) || [];

  const hasValue = (value) =>
    value !== null &&
    value !== undefined &&
    value !== "" &&
    !(Array.isArray(value) && value.length === 0);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours && remainingMinutes) {
      return `${hours}h ${remainingMinutes}m`;
    }

    if (hours) return `${hours}h`;
    return `${remainingMinutes}m`;
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return null;

    return parsedDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const releaseDate = hasValue(movie.releaseDate)
    ? formatDate(movie.releaseDate)
    : null;

  return (
    <Page>
      <TopBar>
        <Brand onClick={() => navigate("/")}>
          <BrandMark> M </BrandMark>
          <span>MovieVault</span>
        </Brand>

        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
          <span>Back to movies</span>
        </BackButton>
      </TopBar>

      <Hero $image={movie.primaryImage}>
        <HeroShade />

        <HeroContent>
          <PosterColumn>
            {hasValue(movie.primaryImage) && (
              <Poster
                src={movie.primaryImage}
                alt={movie.primaryTitle || "Movie poster"}
              />
            )}

            {hasValue(movie.url) && (
              <ImdbLink
                href={movie.url}
                target="_blank"
                rel="noreferrer"
              >
                View on IMDb <FaExternalLinkAlt />
              </ImdbLink>
            )}
          </PosterColumn>

          <MainInfo>
            <Eyebrow>MOVIE DETAILS</Eyebrow>

            {hasValue(movie.primaryTitle) && (
              <Title>{movie.primaryTitle}</Title>
            )}

            {hasValue(movie.originalTitle) &&
              movie.originalTitle !== movie.primaryTitle && (
                <OriginalTitle>{movie.originalTitle}</OriginalTitle>
              )}

            <QuickMeta>
              {hasValue(movie.startYear) && (
                <MetaItem>{movie.startYear}</MetaItem>
              )}

              {hasValue(movie.contentRating) && (
                <ContentBadge>{movie.contentRating}</ContentBadge>
              )}

              {hasValue(movie.runtimeMinutes) &&
                movie.runtimeMinutes > 0 && (
                  <MetaItem>
                    <FaClock />
                    {formatRuntime(movie.runtimeMinutes)}
                  </MetaItem>
                )}

              {hasValue(movie.type) && (
                <MetaItem>
                  {movie.type.charAt(0).toUpperCase() +
                    movie.type.slice(1)}
                </MetaItem>
              )}
            </QuickMeta>

            {genres.length > 0 && (
              <GenreList>
                {genres.map((genre) => (
                  <Genre key={genre}>{genre}</Genre>
                ))}
              </GenreList>
            )}

            {hasValue(movie.averageRating) && (
              <RatingBlock>
                <RatingIcon>
                  <FaStar />
                </RatingIcon>
                <RatingNumber>
                  {Number(movie.averageRating).toFixed(1)}
                  <RatingOutOf>/10</RatingOutOf>
                </RatingNumber>
                {hasValue(movie.numVotes) && (
                  <VoteCount>
                    {Number(movie.numVotes).toLocaleString("en-US")} votes
                  </VoteCount>
                )}
              </RatingBlock>
            )}

            {hasValue(movie.description) && (
              <Description>{movie.description}</Description>
            )}

            <ActionRow>
              {hasValue(movie.trailer) && (
                <PrimaryButton
                  onClick={() => window.open(
                    movie.trailer,
                    "_blank",
                    "noopener,noreferrer"
                  )}
                >
                  <FaPlay /> Watch Trailer
                </PrimaryButton>
              )}
            </ActionRow>
          </MainInfo>
        </HeroContent>
      </Hero>

      <Content>
        {(releaseDate ||
          hasValue(movie.metascore) ||
          countries.length > 0 ||
          languages.length > 0) && (
          <Section>
            <SectionHeading>About the movie</SectionHeading>

            <InfoGrid>
              {releaseDate && (
                <InfoCard>
                  <InfoIcon><FaCalendarAlt /></InfoIcon>
                  <InfoLabel>Release Date</InfoLabel>
                  <InfoValue>{releaseDate}</InfoValue>
                </InfoCard>
              )}

              {hasValue(movie.metascore) && (
                <InfoCard>
                  <InfoIcon><FaChartBar /></InfoIcon>
                  <InfoLabel>Metascore</InfoLabel>
                  <InfoValue>
                    {movie.metascore}
                    <Muted>/100</Muted>
                  </InfoValue>
                </InfoCard>
              )}

              {countries.length > 0 && (
                <InfoCard>
                  <InfoIcon><FaGlobe /></InfoIcon>
                  <InfoLabel>Country</InfoLabel>
                  <InfoValue>{countries.join(", ")}</InfoValue>
                </InfoCard>
              )}

              {languages.length > 0 && (
                <InfoCard>
                  <InfoIcon><FaGlobe /></InfoIcon>
                  <InfoLabel>Languages</InfoLabel>
                  <InfoValue>{languages.join(", ")}</InfoValue>
                </InfoCard>
              )}
            </InfoGrid>
          </Section>
        )}

        {interests.length > 0 && (
          <Section>
            <SectionHeading>Explore its themes</SectionHeading>
            <InterestList>
              {interests.map((interest) => (
                <Interest key={interest}>{interest}</Interest>
              ))}
            </InterestList>
          </Section>
        )}

        {(companies.length > 0 ||
          hasValue(movie.budget) ||
          hasValue(movie.grossWorldwide) ||
          (movie.filmingLocations?.filter(Boolean).length > 0)) && (
          <Section>
            <SectionHeading>Production details</SectionHeading>

            <DetailsPanel>
              {companies.length > 0 && (
                <DetailRow>
                  <DetailLabel>
                    <FaBuilding /> Production Company
                  </DetailLabel>
                  <DetailValue>
                    {companies.map((company) => company.name).join(", ")}
                  </DetailValue>
                </DetailRow>
              )}

              {hasValue(movie.budget) && (
                <DetailRow>
                  <DetailLabel>
                    <FaMoneyBillWave /> Budget
                  </DetailLabel>
                  <DetailValue>{formatMoney(movie.budget)}</DetailValue>
                </DetailRow>
              )}

              {hasValue(movie.grossWorldwide) && (
                <DetailRow>
                  <DetailLabel>
                    <FaMoneyBillWave /> Worldwide Gross
                  </DetailLabel>
                  <DetailValue>
                    {formatMoney(movie.grossWorldwide)}
                  </DetailValue>
                </DetailRow>
              )}

              {movie.filmingLocations?.filter(Boolean).length > 0 && (
                <DetailRow>
                  <DetailLabel>
                    <FaGlobe /> Filming Locations
                  </DetailLabel>
                  <DetailValue>
                    {movie.filmingLocations.filter(Boolean).join(", ")}
                  </DetailValue>
                </DetailRow>
              )}
            </DetailsPanel>
          </Section>
        )}

        {links.length > 0 && (
          <Section>
            <SectionHeading>External links</SectionHeading>
            <ExternalLinks>
              {links.map((link) => (
                <ExternalLink
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    {(() => {
                      try {
                        return new URL(link).hostname.replace(/^www\./, "");
                      } catch {
                        return "External website";
                      }
                    })()}
                  </span>
                  <FaExternalLinkAlt />
                </ExternalLink>
              ))}
            </ExternalLinks>
          </Section>
        )}
      </Content>
    </Page>
  );
}

export default MovieDetails;

/* ---------- STYLES ---------- */

const Page = styled.main`
  min-height: 100vh;
  background: #0c0c10;
  color: #f4f4f5;
`;

const TopBar = styled.header`
  height: 72px;
  padding: 0 6%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #0c0c10;
  border-bottom: 1px solid #ffffff0d;

  @media (max-width: 600px) {
    height: 64px;
    padding: 0 18px;
  }
`;

const Brand = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  background: transparent;
  color: #f4f4f5;
  font-size: 19px;
  font-weight: 750;
  cursor: pointer;
`;

const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: #8b5cf6;
  color: white;
  font-size: 19px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 13px;
  border: 1px solid #ffffff18;
  border-radius: 9px;
  background: #ffffff06;
  color: #d4d4d8;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    border-color: #8b5cf6;
    color: white;
  }
`;

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background: #17151e;

  &::before {
    content: "";
    position: absolute;
    z-index: -2;
    inset: -30px;
    background-image: ${({ $image }) =>
      $image ? `url("${$image}")` : "none"};
    background-position: center 35%;
    background-size: cover;
    filter: blur(35px);
    opacity: 0.22;
    transform: scale(1.1);
  }
`;

const HeroShade = styled.div`
  position: absolute;
  z-index: -1;
  inset: 0;
  background: linear-gradient(
    90deg,
    #111016 0%,
    #111016ed 48%,
    #111016b8 100%
  );

  @media (max-width: 700px) {
    background: #111016d9;
  }
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  align-items: center;
  gap: 48px;
  max-width: 1280px;
  margin: auto;
  padding: 54px 6% 60px;

  @media (max-width: 850px) {
    grid-template-columns: 190px minmax(0, 1fr);
    gap: 30px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 30px 20px 38px;
  }
`;

const PosterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 250px;

  @media (max-width: 600px) {
    max-width: 185px;
    margin: auto;
  }
`;

const Poster = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border: 1px solid #ffffff1c;
  border-radius: 13px;
  background: #202027;
  box-shadow: 0 22px 60px #00000060;
`;

const ImdbLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #ffffff1a;
  border-radius: 8px;
  color: #c4b5fd;
  font-size: 12px;
  text-decoration: none;

  &:hover {
    background: #ffffff0a;
  }
`;

const MainInfo = styled.div`
  min-width: 0;
`;

const Eyebrow = styled.div`
  margin-bottom: 13px;
  color: #a78bfa;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 2.5px;
`;

const Title = styled.h1`
  margin: 0;
  color: #fafafa;
  font-size: clamp(29px, 4vw, 49px);
  font-weight: 750;
  line-height: 1.12;
  letter-spacing: -1.5px;
  overflow-wrap: anywhere;
`;

const OriginalTitle = styled.p`
  margin: 10px 0 0;
  color: #a1a1aa;
  font-size: 14px;
`;

const QuickMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 21px;
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #d4d4d8;
  font-size: 13px;

  svg {
    color: #a78bfa;
    font-size: 12px;
  }
`;

const ContentBadge = styled.span`
  padding: 4px 7px;
  border: 1px solid #ffffff3a;
  border-radius: 4px;
  color: #e4e4e7;
  font-size: 11px;
  font-weight: 600;
`;

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 17px;
`;

const Genre = styled.span`
  padding: 7px 11px;
  border: 1px solid #8b5cf640;
  border-radius: 6px;
  background: #8b5cf615;
  color: #d8ccff;
  font-size: 12px;
`;

const RatingBlock = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 23px;
`;

const RatingIcon = styled.span`
  color: #facc15;
  font-size: 21px;
`;

const RatingNumber = styled.span`
  color: #fafafa;
  font-size: 24px;
  font-weight: 750;
  font-variant-numeric: tabular-nums;
`;

const RatingOutOf = styled.span`
  color: #a1a1aa;
  font-size: 12px;
  font-weight: 400;
`;

const VoteCount = styled.span`
  padding-left: 10px;
  border-left: 1px solid #ffffff30;
  color: #a1a1aa;
  font-size: 12px;
`;

const Description = styled.p`
  max-width: 700px;
  margin: 20px 0 0;
  color: #c4c4ce;
  font-size: 14px;
  line-height: 1.9;
  text-align: left;
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 27px;
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 13px 19px;
  border: 0;
  border-radius: 9px;
  background: #8b5cf6;
  color: white;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #7c3aed;
  }
`;

const Content = styled.div`
  max-width: 1280px;
  margin: auto;
  padding: 15px 6% 70px;

  @media (max-width: 600px) {
    padding: 10px 20px 45px;
  }
`;

const Section = styled.section`
  margin-top: 40px;
`;

const SectionHeading = styled.h2`
  margin: 0 0 20px;
  color: #f4f4f5;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.4px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px;

  @media (max-width: 850px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  min-width: 0;
  padding: 18px;
  border: 1px solid #ffffff12;
  border-radius: 12px;
  background: #141419;
`;

const InfoIcon = styled.div`
  margin-bottom: 15px;
  color: #a78bfa;
  font-size: 16px;
`;

const InfoLabel = styled.div`
  margin-bottom: 7px;
  color: #92929d;
  font-size: 12px;
`;

const InfoValue = styled.div`
  color: #f4f4f5;
  font-size: 14px;
  font-weight: 600;
  overflow-wrap: anywhere;
`;

const Muted = styled.span`
  color: #92929d;
  font-size: 12px;
  font-weight: 400;
`;

const InterestList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Interest = styled.span`
  padding: 9px 13px;
  border: 1px solid #ffffff15;
  border-radius: 7px;
  background: #141419;
  color: #d4d4d8;
  font-size: 12px;
`;

const DetailsPanel = styled.div`
  padding: 4px 20px;
  border: 1px solid #ffffff12;
  border-radius: 12px;
  background: #141419;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 25px;
  padding: 17px 0;

  & + & {
    border-top: 1px solid #ffffff10;
  }

  @media (max-width: 500px) {
    flex-direction: column;
    gap: 9px;
  }
`;

const DetailLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #92929d;
  font-size: 13px;
  flex-shrink: 0;

  svg {
    color: #a78bfa;
  }
`;

const DetailValue = styled.span`
  color: #e4e4e7;
  font-size: 13px;
  text-align: right;
  overflow-wrap: anywhere;

  @media (max-width: 500px) {
    text-align: left;
  }
`;

const ExternalLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const ExternalLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 15px;
  border: 1px solid #ffffff15;
  border-radius: 9px;
  background: #141419;
  color: #c4b5fd;
  font-size: 13px;
  text-decoration: none;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #8b5cf6;
  }
`;

const Message = styled.p`
  padding: 40px 6%;
  color: #a1a1aa;
`;
