import React from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();

  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const calculateDiscountRate = (originalPrice, currentPrice) => {
    if (
      !originalPrice ||
      !currentPrice ||
      originalPrice <= currentPrice ||
      currentPrice <= 0
    )
      return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const originalPrice = item?.originalPrice || item?.price;
  const currentPrice = item?.price;
  const isOnSale = item?.isOnSale || false;
  const discountRate = isOnSale
    ? calculateDiscountRate(originalPrice, currentPrice)
    : 0;

  return (
    <div className="product-card" onClick={() => showProduct(item._id)}>
      <div className="product-image-container">
        <img src={item?.image} alt={item?.name} className="product-image" />
      </div>
      <div className="product-info">
        <div className="product-name">{item?.name}</div>
        <div className="product-price-container">
          {isOnSale && discountRate > 0 ? (
            <>
              <div className="price-row">
                <span className="current-price">
                  KRW {currencyFormat(currentPrice)}
                </span>
                <span className="discount-rate">{discountRate}%</span>
              </div>
              <span className="original-price">
                KRW {currencyFormat(originalPrice)}
              </span>
            </>
          ) : (
            <span className="current-price">
              KRW {currencyFormat(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
