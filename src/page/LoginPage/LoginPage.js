import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./style/login.style.css";
import { loginWithEmail, loginWithGoogle } from "../../features/user/userSlice";
import { clearErrors } from "../../features/user/userSlice";
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loginError } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (loginError) {
      dispatch(clearErrors());
    }
  }, [navigate]);
  const handleLoginWithEmail = (event) => {
    event.preventDefault();
    dispatch(loginWithEmail({ email, password }));
  };

  const handleGoogleLogin = async (googleData) => {
    //구글 로그인 하기
  };

  if (user) {
    navigate("/");
  }
  return (
    <>
      <Container className="login-area">
        <h2>로그인</h2>
        {loginError && (
          <div className="error-message">
            <Alert variant="danger">{loginError}</Alert>
          </div>
        )}
        <Form className="login-form" onSubmit={handleLoginWithEmail}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="이메일을 입력해주세요"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호를 입력해주세요"
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>
          <Button variant="dark" type="submit">
            로그인
          </Button>

          <div className="register-link">
            아직 계정이 없으세요? <Link to="/register">회원가입 하기</Link>
          </div>

          <div className="google-login-section">
            <p>-외부 계정으로 로그인하기-</p>
            <div className="display-center">
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default Login;
