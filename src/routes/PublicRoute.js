import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { user, isAuthenticating } = useSelector((state) => state.user);

  // 인증 확인이 완료되고 사용자가 로그인되어 있으면 메인 페이지로 리다이렉트
  if (!isAuthenticating && user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PublicRoute;
