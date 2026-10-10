import { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFilm,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { login } from "../api/auth";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await login({
        email: cleanEmail,
        password,
      });

      if (!data?.token || !data?.user) {
        throw new Error("Invalid response from server. Please try again.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!");
      navigate("/movies", { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
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
          <Eyebrow>WELCOME BACK</Eyebrow>

          <Heading>
            Lights. Camera. <span>You.</span>
          </Heading>

          <Description>
            Sign in to discover your next favourite movie.
          </Description>

          <Form onSubmit={handleSubmit} noValidate>
            <Field>
              <Label htmlFor="email">Email</Label>

              <InputBox>
                <FaEnvelope />

                <input
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

            <Field>
              <PasswordLabel>
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password">Forgot password?</Link>
              </PasswordLabel>

              <InputBox>
                <FaLock />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <TogglePassword
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </TogglePassword>
              </InputBox>
            </Field>

            <SignInButton type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <FaArrowRight />}
            </SignInButton>
          </Form>

          <Divider>YOUR NEXT MOVIE AWAITS</Divider>

          <SignupText>
            New to MovieVault? <Link to="/signup">Create an account</Link>
          </SignupText>
        </Card>

        <Footer>
          MADE FOR MOVIE LOVERS <span>✦</span> POWERED BY YOUR PASSION
        </Footer>
      </Main>
    </Page>
  );
}

export default Login;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 12% 45%, #49207755, transparent 42%),
    radial-gradient(ellipse at 90% 10%, #4632a522, transparent 35%), #090910;
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
  margin: 12px 0 30px;
  color: #a5a1b4;
  font-size: 14px;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const Label = styled.label`
  color: #e4e0ef;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
`;

const PasswordLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  a {
    color: #b58aff;
    font-size: 12px;
    text-decoration: none;

    &:hover {
      color: #d2b8ff;
    }
  }
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
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus-within {
    border-color: #9760ed;
    box-shadow: 0 0 0 3px #9760ed1f;
  }

  input {
    width: 100%;
    min-width: 0;
    padding: 14px 0;
    border: none;
    outline: none;
    background: transparent;
    color: white;
    font: inherit;
    font-size: 13px;
  }

  input::placeholder {
    color: #6f6a7e;
  }
`;

const TogglePassword = styled.button`
  display: grid;
  place-items: center;
  padding: 6px;
  border: none;
  background: transparent;
  color: #8e899e;
  cursor: pointer;

  &:hover {
    color: #c7aaff;
  }
`;

const SignInButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 52px;
  margin-top: 4px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(110deg, #9858f3, #7040d7);
  box-shadow: 0 8px 25px #7741d838;
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px #7741d859;
  }

  &:active {
    transform: translateY(0);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 28px 0 22px;
  color: #777186;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
  white-space: nowrap;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #302b3d;
  }
`;

const SignupText = styled.p`
  margin: 0;
  color: #a5a1b4;
  font-size: 13px;
  text-align: center;

  a {
    color: #b58aff;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      color: #d2b8ff;
    }
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
