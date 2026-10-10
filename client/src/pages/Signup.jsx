import { useState } from "react";
import styled from "styled-components";
import {
  FaFilm,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { signup } from "../api/auth";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(phone.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!isValidPhone(cleanPhone)) {
      toast.error("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);

      await signup({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password,
      });

      toast.success("OTP sent to your email!");

      navigate("/verify-email", {
        state: { email: cleanEmail },
      });
    } catch (error) {
      toast.error(error.message || "Signup failed. Please try again.");
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
          <Eyebrow>JOIN THE COLLECTION</Eyebrow>

          <Heading>
            Your story starts <span>here.</span>
          </Heading>

          <Description>
            Create an account and discover a world of movies.
          </Description>

          <Form onSubmit={handleSubmit}>
            <Field>
              <Label htmlFor="name">Full name</Label>
              <InputBox>
                <FaUser />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </InputBox>
            </Field>

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

            <Field>
              <Label htmlFor="phone">Phone number</Label>
              <InputBox>
                <FaPhone />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </InputBox>
            </Field>

            <Field>
              <Label htmlFor="password">Password</Label>
              <InputBox>
                <FaLock />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password (min. 8 characters)"
                  autoComplete="new-password"
                  minLength={8}
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

            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <FaArrowRight />}
            </SubmitButton>
          </Form>

          <Divider>YOUR MOVIE JOURNEY BEGINS HERE</Divider>

          <LoginText>
            Already have an account? <Link to="/login">Sign in</Link>
          </LoginText>
        </Card>

        <Footer>
          MADE FOR MOVIE LOVERS <span>✦</span> POWERED BY YOUR PASSION
        </Footer>
      </Main>
    </Page>
  );
}

export default Signup;

// Styled-components

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
  padding: 38px 42px;
  border: 1px solid #c4b1ff29;
  border-radius: 24px;
  background: #161422d9;
  box-shadow: 0 25px 80px #00000059;
  backdrop-filter: blur(18px);

  @media (max-width: 600px) {
    padding: 28px 23px;
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
  font-size: clamp(27px, 4vw, 34px);
  line-height: 1.2;
  letter-spacing: -1px;

  span {
    color: #b58aff;
  }
`;

const Description = styled.p`
  margin: 12px 0 25px;
  color: #a5a1b4;
  font-size: 13px;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 17px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
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
  min-height: 49px;
  box-sizing: border-box;
  padding: 0 14px;
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
`;

const Input = styled.input`
  width: 100%;
  min-width: 0;
  padding: 13px 0;
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

const TogglePassword = styled.button`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  padding: 6px;
  border: none;
  background: transparent;
  color: #8e899e;
  cursor: pointer;

  &:hover {
    color: #c7aaff;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 51px;
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
  gap: 12px;
  margin: 24px 0 19px;
  color: #777186;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.2px;
  white-space: nowrap;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #302b3d;
  }
`;

const LoginText = styled.p`
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
  margin: 26px 0 0;
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
