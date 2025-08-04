import React, { useState } from "react";
import { Offcanvas, Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleSelectMenu = (url) => {
    setShow(false);
    navigate(url);
  };

  const NavbarContent = () => {
    return (
      <div className="admin-sidebar-content">
        <Link to="/" className="admin-logo-link">
          <span className="brand-logo">core</span>
        </Link>
        <div className="admin-account-title">Admin Account</div>
        <ul className="admin-sidebar-menu">
          <li
            className="admin-sidebar-item"
            onClick={() => handleSelectMenu("/admin/product?page=1")}
          >
            상품 관리
          </li>
          <li
            className="admin-sidebar-item"
            onClick={() => handleSelectMenu("/admin/order?page=1")}
          >
            주문 관리
          </li>
        </ul>
      </div>
    );
  };
  return (
    <>
      <div className="sidebar-toggle">{NavbarContent()}</div>

      <Navbar bg="light" expand={false} className="mobile-sidebar-toggle">
        <Container fluid>
          <Link to="/" className="admin-logo-link">
            <span className="brand-logo">core</span>
          </Link>
          <Navbar.Brand href="#"></Navbar.Brand>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand`}
            onClick={() => setShow(true)}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand`}
            aria-labelledby={`offcanvasNavbarLabel-expand`}
            placement="start"
            className="sidebar"
            show={show}
          >
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>{NavbarContent()}</Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Sidebar;
