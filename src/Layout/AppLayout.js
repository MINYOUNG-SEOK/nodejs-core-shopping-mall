import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../common/component/Sidebar";
import Navbar from "../common/component/Navbar";
import ToastMessage from "../common/component/ToastMessage";
import { loginWithToken } from "../features/user/userSlice";
import { getCartQty } from "../features/cart/cartSlice";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  // 메인페이지인지 확인
  const isMainPage =
    location.pathname === "/" || location.pathname === "/products";

  useEffect(() => {
    dispatch(loginWithToken());
  }, [dispatch]);
  useEffect(() => {
    if (user) {
      dispatch(getCartQty());
    }
  }, [user, dispatch]);

  return (
    <div className={isMainPage ? "main-page" : ""}>
      <ToastMessage />
      {location.pathname.includes("admin") ? (
        <Row className="vh-100">
          <Col xs={12} md={3} className="sidebar mobile-sidebar">
            <Sidebar />
          </Col>
          <Col xs={12} md={9}>
            {children}
          </Col>
        </Row>
      ) : (
        <>
          <Navbar user={user} />
          <div className="main-content">{children}</div>
        </>
      )}
    </div>
  );
};

export default AppLayout;
