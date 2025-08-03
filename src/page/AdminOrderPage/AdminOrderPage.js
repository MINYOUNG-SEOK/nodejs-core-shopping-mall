import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { useSearchParams, useNavigate } from "react-router-dom";
import OrderDetailDialog from "./component/OrderDetailDialog";
import OrderTable from "./component/OrderTable";
import SearchBox from "../../common/component/SearchBox";
import {
  getOrderList,
  setSelectedOrder,
} from "../../features/order/orderSlice";
import "./style/adminOrder.style.css";

const AdminOrderPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { orderList, totalPageNum } = useSelector((state) => state.order);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    ordernum: query.get("ordernum") || "",
  });
  const [open, setOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const tableHeader = [
    "#",
    "Order#",
    "Order Date",
    "User",
    "Order Item",
    "Address",
    "Total Price",
    "Status",
  ];

  useEffect(() => {
    dispatch(getOrderList({ ...searchQuery }));
  }, [query]);

  useEffect(() => {
    if (searchQuery.ordernum === "") {
      delete searchQuery.ordernum;
    }
    const params = new URLSearchParams(searchQuery);
    const queryString = params.toString();

    navigate("?" + queryString);
  }, [searchQuery]);

  const openEditForm = (order) => {
    setOpen(true);
    dispatch(setSelectedOrder(order));
  };

  const handlePageClick = ({ selected }) => {
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  return (
    <div className="admin-order-page">
      {/* 모바일 햄버거 메뉴 */}
      <div className="admin-mobile-header">
        <div className="admin-mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="admin-mobile-title">주문 관리</div>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {showMobileMenu && (
        <div
          className="admin-mobile-menu-overlay"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="admin-mobile-menu-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-mobile-logo">core</div>
            <div className="admin-mobile-account-title">ADMIN ACCOUNT</div>
            <div className="admin-mobile-menu-list">
              <div
                className="admin-mobile-menu-item"
                onClick={() => handleMenuClick("/admin/product")}
              >
                상품 관리
              </div>
              <div
                className="admin-mobile-menu-item active"
                onClick={() => handleMenuClick("/admin/order")}
              >
                주문 관리
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-order-container">
        <h1 className="admin-order-title">주문 관리</h1>

        <div className="admin-order-search-section">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="주문 번호로 검색"
            field="ordernum"
          />
        </div>

        <div className="admin-order-table-container">
          <OrderTable
            header={tableHeader}
            data={orderList}
            openEditForm={openEditForm}
          />
        </div>

        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={totalPageNum}
          forcePage={searchQuery.page - 1}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="admin-order-pagination"
          activeClassName="active"
          className="display-center list-style-none"
        />
      </div>

      {open && <OrderDetailDialog open={open} handleClose={handleClose} />}
    </div>
  );
};

export default AdminOrderPage;
