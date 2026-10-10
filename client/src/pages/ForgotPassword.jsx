
import { useState } from "react";
import styled from "styled-components";
import {
  FaFilm,
  FaEnvelope,
  FaArrowLeft,
  FaPaperPlane,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../api/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword({ email: cleanEmail });

      toast.success("Password reset OTP sent to your email!");

      navigate("/reset-password", {
        state: { email: cleanEmail },
      });
    } catch (error) {
      toast.error(error.message || "Could not send the reset code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Header>
        <Brand to="/login">
          <BrandIcon>
            <FaFilm />
          </BrandIcon>
          Movie<span>Vault</span>
        </Brand>

        <Tagline>Your cinema, your collection.</Tagline>
      </Header>

      <Main>
        <Card>
          <Eyebrow>ACCOUNT RECOVERY</Eyebrow>

          <Heading>
            Forgot your <span>password?</span>
          </Heading>

          <Description>
            Enter your email to receive a password reset code.
          </Description>

          <Form onSubmit={handleSubmit} noValidate>
            <Field>
              <Label htmlFor="email">Email address</Label>

              <InputBox>
                <FaEnvelope />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputBox>
            </Field>

            <SubmitButton type="submit" disabled={loading}>
              <FaPaperPlane />
              {loading ? "Sending Code..." : "Send Verification Code"}
            </SubmitButton>
          </Form>

          <BackLink to="/login">
            <FaArrowLeft />
            Back to Sign In
          </BackLink>
        </Card>

        <Footer>
          MADE FOR MOVIE LOVERS <span>✦</span> POWERED BY YOUR PASSION
        </Footer>
      </Main>
    </Page>
  );
}

export default ForgotPassword;


// Styled-components

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 12% 45%, #49207755, transparent 42%),
    radial-gradient(ellipse at 90% 10%, #4632a522, transparent 35%),
    #090910;
  color: #f7f5ff;
  font-family: "DM Sans", sans-serif;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 7%;

  @media (max-width: 600px) {
    padding: 20px 6%;
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 11px;
  color: white;
  text-decoration: none;
  font-family: "Outfit", sans-serif;
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -1px;

  span:last-child {
    color: #b58aff;
  }

  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

const BrandIcon = styled.span`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #a56aff, #6935ce);
  box-shadow: 0 5px 22px #864cee4d;
`;

const Tagline = styled.p`
  color: #9895a8;
  font-size: 13px;

  @media (max-width: 360px) {
    display: none;
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px 18px;
`;

const Card = styled.section`
  width: 100%;
  max-width: 450px;
  box-sizing: border-box;
  padding: 42px;
  border: 1px solid #c4b1ff29;
  border-radius: 24px;
  background: #161422d9;
  box-shadow: 0 25px 80px #00000059;
  backdrop-filter: blur(18px);

  @media (max-width: 600px) {
    padding: 30px 23px;
    border-radius: 20px;
  }
`;

const Eyebrow = styled.p`
  margin: 0 0 10px;
  color: #b58aff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
`;

const Heading = styled.h1`
  margin: 0;
  font-family: "Outfit", sans-serif;
  font-size: clamp(28px, 4vw, 35px);
  line-height: 1.2;
  letter-spacing: -1px;

  span {
    color: #b58aff;
  }
`;

const Description = styled.p`
  margin: 14px 0 28px;
  color: #a5a1b4;
  font-size: 14px;
  line-height: 1.7;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 9px;
`;

const Label = styled.label`
  display: block;
  width: 100%;
  text-align: left;
  color: #e4e0ef;
  font-size: 13px;
  font-weight: 600;
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 51px;
  box-sizing: border-box;
  padding: 0 15px;
  border: 1px solid #343044;
  border-radius: 12px;
  background: #0a09118c;
  color: #888197;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus-within {
    border-color: #9760ed;
    box-shadow: 0 0 0 3px #9760ed1f;
  }
`;

const Input = styled.input`
  width: 100%;
  min-width: 0;
  padding: 14px 0;
  border: none;
  outline: none;
  background: transparent;
  color: white;
  font: inherit;
  font-size: 13px;

  &::placeholder {
    color: #6f6a7e;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  min-height: 52px;
  margin-top: 3px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(110deg, #9858f3, #7040d7);
  box-shadow: 0 8px 25px #7741d838;
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px #7741d859;
  }

  &:active {
    transform: translateY(0);
  }
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-top: 27px;
  color: #aaa4bb;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #c7aaff;
  }
`;

const Footer = styled.p`
  margin: 30px 0 0;
  color: #6f6a7e;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.5px;
  line-height: 2;
  text-align: center;

  span {
    margin: 0 8px;
    color: #a879ff;
  }
`;
