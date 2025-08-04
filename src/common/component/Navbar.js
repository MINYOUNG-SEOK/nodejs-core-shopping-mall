import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBox,
  faSearch,
  faShoppingBag,
  faTimes,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { cartItemCount } = useSelector((state) => state.cart);
  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuList = ["All", "Outer", "Top", "Pants", "Acc"];
  let [width, setWidth] = useState(0);
  let navigate = useNavigate();
  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") {
        return navigate("/");
      }
      navigate(`?name=${event.target.value}`);
    }
  };

  // 현재 활성화된 메뉴 확인
  const isActiveMenu = (menu) => {
    // 현재 경로가 /products인지 확인
    if (location.pathname !== "/products") {
      return false;
    }

    const currentCategory = new URLSearchParams(location.search).get(
      "category"
    );

    // 디버깅용 로그
    console.log("Current pathname:", location.pathname);
    console.log("Current category:", currentCategory);
    console.log("Checking menu:", menu);
    console.log("Is active:", currentCategory === menu);

    // All 메뉴의 경우: category가 없거나 All인 경우
    if (menu === "All" && (!currentCategory || currentCategory === "All")) {
      return true;
    }

    // 다른 메뉴의 경우: category가 일치하는 경우
    return currentCategory === menu;
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div>
      {showSearchBox && (
        <div className="display-space-between mobile-search-box w-100">
          <div className="search display-space-between w-100">
            <div>
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
              <input
                type="text"
                placeholder="제품검색"
                onKeyPress={onCheckEnter}
              />
            </div>
            <button
              className="closebtn"
              onClick={() => setShowSearchBox(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      <div className="side-menu" style={{ width: width }}>
        <button className="closebtn" onClick={() => setWidth(0)}>
          &times;
        </button>

        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu, index) => (
            <button key={index}>{menu}</button>
          ))}
        </div>
      </div>
      <div className="nav-header">
        <div className="nav-left">
          <div
            className="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(true)}
          >
            <FontAwesomeIcon icon={faBars} />
          </div>
          <div className="nav-logo">
            <Link to="/">
              <span className="brand-logo">core</span>
            </Link>
          </div>
        </div>

        <div className="nav-right-menu">
          <div className="display-flex">
            {user ? (
              <div onClick={handleLogout} className="nav-icon">
                <span style={{ cursor: "pointer" }}>LOGOUT</span>
              </div>
            ) : (
              <div onClick={() => navigate("/login")} className="nav-icon">
                <span style={{ cursor: "pointer" }}>LOGIN</span>
              </div>
            )}
            <div
              onClick={() => navigate("/account/purchase")}
              className="nav-icon"
            >
              <span style={{ cursor: "pointer" }}>ORDER</span>
            </div>
            <div onClick={() => navigate("/cart")} className="nav-icon">
              <span style={{ cursor: "pointer" }}>{`CART ${
                cartItemCount || 0
              }`}</span>
            </div>
            <div className="nav-icon">
              <span style={{ cursor: "pointer" }}>SEARCH</span>
            </div>
            {user && user.level === "admin" && (
              <div className="nav-icon admin-icon">
                <Link to="/admin/product?page=1">
                  <FontAwesomeIcon icon={faCog} />
                  <span style={{ cursor: "pointer" }}>ADMIN</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="nav-sidebar">
        <ul className="sidebar-menu">
          {menuList.map((menu, index) => (
            <li key={index} className={isActiveMenu(menu) ? "active" : ""}>
              <Link to={`/products?category=${menu}`}>{menu}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {showMobileMenu && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="mobile-menu-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <span className="brand-logo">core</span>
              <button
                className="mobile-menu-close"
                onClick={() => setShowMobileMenu(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <ul className="mobile-menu-list">
              {menuList.map((menu, index) => (
                <li key={index} className={isActiveMenu(menu) ? "active" : ""}>
                  <Link
                    to={`/products?category=${menu}`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {menu}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
