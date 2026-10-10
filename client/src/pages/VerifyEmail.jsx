import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { verifyEmail, resendOtp } from "../api/auth";
import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaFilm, FaEnvelope, FaArrowRight } from "react-icons/fa";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setTimeout(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email address is missing. Please sign up again.");
      navigate("/signup");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid six-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await verifyEmail({ email, otp });

      toast.success("Email verified successfully!");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email address is missing. Please sign up again.");
      navigate("/signup");
      return;
    }

    if (resendTimer > 0) {
      toast.info(`Please wait ${resendTimer} seconds before resending.`);
      return;
    }

    try {
      setResending(true);

      await resendOtp({ email });

      setOtp("");
      setResendTimer(60);
      toast.success("A new OTP has been sent to your email.");
    } catch (error) {
      toast.error(error.message || "Could not resend OTP.");
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  return (
    <PageWrapper>
      <Brand>
        <Logo>
          <FaFilm />
        </Logo>
        <BrandName>MovieVault</BrandName>
      </Brand>

      <VerifyCard>
        <IconCircle>
          <FaEnvelope />
        </IconCircle>

        <Heading>Verify your email</Heading>

        <Description>
          Enter the six-digit verification code sent to your email address.
        </Description>

        {email && <EmailText>{email}</EmailText>}

        <Form onSubmit={handleSubmit} noValidate>
          <OtpInput
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength={6}
            required
          />

          <VerifyButton
            type="submit"
            disabled={loading || resending || otp.length !== 6}
          >
            <span>{loading ? "Verifying..." : "Verify Email"}</span>
            {!loading && <FaArrowRight />}
          </VerifyButton>
        </Form>

        <ResendText>
          Didn't receive the code?{" "}
          <ResendButton
            type="button"
            onClick={handleResendCode}
            disabled={resending || resendTimer > 0}
          >
            {resending ? "Sending..." : "Resend Code"}
          </ResendButton>
          {resendTimer > 0 && <span> ({formatTime(resendTimer)})</span>}
        </ResendText>

        <Divider />

        <BackLink to="/login">Back to Sign In</BackLink>
      </VerifyCard>

      <Footer>Discover your next favourite movie.</Footer>
    </PageWrapper>
  );
}

export default VerifyEmail;

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse at top, #21153c 0%, transparent 55%), #090910;
  color: #ffffff;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
`;

const Logo = styled.div`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #a855f7, #6d28d9);
  font-size: 20px;
`;

const BrandName = styled.h1`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.8px;
`;

const VerifyCard = styled.div`
  width: 100%;
  max-width: 440px;
  box-sizing: border-box;
  padding: 36px;
  border: 1px solid #302742;
  border-radius: 20px;
  background: #161422e8;
  box-shadow: 0 20px 60px #00000040;

  @media (max-width: 480px) {
    padding: 26px 20px;
  }
`;

const IconCircle = styled.div`
  width: 58px;
  height: 58px;
  margin: 0 auto 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #8b5cf626;
  color: #c4a5ff;
  font-size: 23px;
`;

const Heading = styled.h2`
  margin: 0 0 12px;
  text-align: center;
  font-size: 27px;
`;

const Description = styled.p`
  margin: 0 0 18px;
  color: #aaa5ba;
  text-align: center;
  font-size: 14px;
  line-height: 1.6;
`;

const EmailText = styled.p`
  margin: 0 0 24px;
  color: #c4a5ff;
  text-align: center;
  font-size: 14px;
  overflow-wrap: anywhere;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OtpInput = styled.input`
  padding: 15px;
  border: 1px solid #39334b;
  border-radius: 10px;
  outline: none;
  background: #0e0c17;
  color: #ffffff;
  font-size: 24px;
  letter-spacing: 10px;
  text-align: center;

  &::placeholder {
    color: #504961;
  }

  &:focus {
    border-color: #a855f7;
    box-shadow: 0 0 0 3px #a855f71c;
  }
`;

const VerifyButton = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #9333ea, #6d28d9);
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    filter: brightness(1.12);
  }
`;

const ResendText = styled.p`
  margin: 24px 0;
  color: #aaa5ba;
  text-align: center;
  font-size: 13px;
`;

const ResendButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  color: #c4a5ff;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #302742;
`;

const BackLink = styled(Link)`
  display: block;
  margin-top: 22px;
  color: #c4a5ff;
  text-align: center;
  font-size: 14px;
  text-decoration: none;

  &:hover {
    color: #ffffff;
  }
`;

const Footer = styled.p`
  margin: 28px 0 0;
  color: #777185;
  text-align: center;
  font-size: 12px;
`;
