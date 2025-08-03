import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ColorRing } from "react-loader-spinner";

import "./style/register.style.css";

import { registerUser, clearErrors } from "../../features/user/userSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);
  const { registrationError, loading } = useSelector((state) => state.user);

  // 페이지 진입 시 에러 초기화
  useEffect(() => {
    dispatch(clearErrors());
  }, []);

  const register = (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword, policy } = formData;
    const checkConfirmPassword = password === confirmPassword;
    if (!checkConfirmPassword) {
      setPasswordError("비밀번호 중복확인이 일치하지 않습니다.");
      return;
    }
    if (!policy) {
      setPolicyError(true);
      return;
    }
    setPasswordError("");
    setPolicyError(false);
    dispatch(registerUser({ name, email, password, navigate }));
  };

  const handleChange = (event) => {
    let { id, value, type, checked } = event.target;
    if (id === "confirmPassword" && passwordError) setPasswordError("");
    if (type === "checkbox") {
      if (policyError) setPolicyError(false);
      setFormData((prevState) => ({ ...prevState, [id]: checked }));
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  return (
    <Container className="register-area">
      <h2>회원가입</h2>
      {registrationError && (
        <div>
          <Alert variant="danger" className="error-message">
            {registrationError}
          </Alert>
        </div>
      )}
      <Form onSubmit={register}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="이메일을 입력해주세요"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            id="name"
            placeholder="이름을 입력해주세요"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="비밀번호를 입력해주세요"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            id="confirmPassword"
            placeholder="비밀번호를 다시 입력해주세요"
            onChange={handleChange}
            required
            isInvalid={passwordError}
          />
          <Form.Control.Feedback type="invalid">
            {passwordError}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="이용약관에 동의합니다"
            id="policy"
            onChange={handleChange}
            isInvalid={policyError}
            checked={formData.policy}
          />
        </Form.Group>
        <Button variant="dark" type="submit" disabled={loading}>
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <ColorRing
                visible={true}
                height="20"
                width="20"
                ariaLabel="loading"
                wrapperStyle={{}}
                wrapperClass=""
                colors={["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]}
              />
              회원가입 중...
            </div>
          ) : (
            "회원가입"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;
