import React, { useEffect } from "react";
import ProductCard from "../LandingPage/components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const [query] = useSearchParams();
  const category = query.get("category");
  const name = query.get("name");

  useEffect(() => {
    dispatch(
      getProductList({
        category,
        name,
      })
    );
  }, [query, dispatch]);

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
          {productList.length > 0 ? (
            productList.map((item) => (
              <Col lg={4} md={6} sm={12} key={item._id}>
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
      </Container>
    </div>
  );
};

export default ProductsPage;
