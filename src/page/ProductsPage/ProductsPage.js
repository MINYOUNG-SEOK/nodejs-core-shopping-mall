import React, { useEffect, useState, useMemo } from "react";
import ProductCard from "../LandingPage/components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import Pagination from "../../common/component/Pagination";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const loading = useSelector((state) => state.product.loading);
  const [query] = useSearchParams();
  const category = query.get("category");
  const name = query.get("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    dispatch(
      getProductList({
        category,
        name,
      })
    );
    setCurrentPage(1);
  }, [query, dispatch]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return productList.slice(startIndex, endIndex);
  }, [productList, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(productList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <div className="products-page">
      <Container>
        <div className="products-page-header">
          <h2 className="category-title">
            {name
              ? `검색 결과 ${productList.length}건`
              : category === "All"
              ? "SHOP > All"
              : `SHOP > ${category}`}
          </h2>
        </div>
        <Row>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Col lg={4} md={6} sm={6} xs={12} key={`skeleton-${index}`}>
                <div className="product-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-price"></div>
                  </div>
                </div>
              </Col>
            ))
          ) : productList.length > 0 ? (
            paginatedProducts.map((item) => (
              <Col lg={4} md={6} sm={6} xs={12} key={item._id}>
                <ProductCard item={item} />
              </Col>
            ))
          ) : (
            <div className="no-products-message">
              <h3>
                {name
                  ? `"${name}"에 대한 검색 결과가 없습니다.`
                  : category === "All"
                  ? "등록된 상품이 없습니다!"
                  : `${category} 카테고리의 상품이 없습니다!`}
              </h3>
            </div>
          )}
        </Row>

        {productList.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
          />
        )}
      </Container>
    </div>
  );
};

export default ProductsPage;
