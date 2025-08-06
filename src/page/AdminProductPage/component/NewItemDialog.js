import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";
import { CATEGORY, STATUS, SIZE } from "../../../constants/product.constants";
import "../style/adminProduct.style.css";
import {
  clearError,
  clearSuccess,
  createProduct,
  editProduct,
} from "../../../features/product/productSlice";

const InitialFormData = {
  name: "",
  sku: "",
  stock: {},
  image: "",
  description: "",
  category: [],
  status: "active",
  price: "",
  originalPrice: "",
  isOnSale: false,
};

const NewItemDialog = ({ mode, showDialog, setShowDialog }) => {
  const { error, success, selectedProduct } = useSelector(
    (state) => state.product
  );
  const [formData, setFormData] = useState(
    mode === "new" ? { ...InitialFormData } : selectedProduct
  );
  const [stock, setStock] = useState([]);
  const dispatch = useDispatch();
  const [stockError, setStockError] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [stockQuantityError, setStockQuantityError] = useState("");
  const [requiredFieldError, setRequiredFieldError] = useState("");

  useEffect(() => {
    if (success) {
      setShowDialog(false);
      setFormData({ ...InitialFormData });
      setStock([]);
      setStockError(false);
      setPriceError("");
      setStockQuantityError("");
      setRequiredFieldError("");
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (showDialog) {
      if (mode === "edit") {
        setFormData(selectedProduct);
        const sizeArray = Object.keys(selectedProduct.stock).map((size) => [
          Date.now() + Math.random(),
          size,
          selectedProduct.stock[size],
        ]);
        setStock(sizeArray);
      } else {
        setFormData({ ...InitialFormData });
        setStock([]);
      }
    }
  }, [showDialog]);

  const handleClose = () => {
    setFormData({ ...InitialFormData });
    setStock([]);
    setStockError(false);
    setPriceError("");
    setStockQuantityError("");
    setRequiredFieldError("");
    setShowDialog(false);
    dispatch(clearError());
    dispatch(clearSuccess());
  };

  // 모달 강제 닫기 함수
  const forceCloseModal = () => {
    setShowDialog(false);
    setFormData({ ...InitialFormData });
    setStock([]);
    setStockError(false);
    setPriceError("");
    setStockQuantityError("");
    setRequiredFieldError("");
    dispatch(clearError());
    dispatch(clearSuccess());
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // 모든 에러 상태 초기화
    setStockError(false);
    setPriceError("");
    setStockQuantityError("");
    setRequiredFieldError("");

    // 필수 필드 검증
    if (
      !formData.sku ||
      !formData.name ||
      !formData.description ||
      !formData.image ||
      formData.category.length === 0
    ) {
      setRequiredFieldError("모든 필수 필드를 입력해주세요.");
      return;
    }

    if (stock.length === 0) {
      setStockError(true);
      return;
    }

    // 재고 수량 검증
    for (let i = 0; i < stock.length; i++) {
      if (stock[i][1] && stock[i][2]) {
        const quantity = parseInt(stock[i][2]);
        if (quantity < 0) {
          setStockQuantityError("재고 수량은 0 이상의 값을 입력해주세요.");
          return;
        }
      }
    }

    // 원가 검증
    if (!formData.originalPrice || parseFloat(formData.originalPrice) <= 0) {
      setPriceError("원가는 0보다 큰 값을 입력해주세요.");
      return;
    }

    // 할인가 검증 (할인 적용 시)
    if (
      formData.isOnSale &&
      (!formData.price || parseFloat(formData.price) <= 0)
    ) {
      setPriceError("할인가는 0보다 큰 값을 입력해주세요.");
      return;
    }

    // 할인가가 원가보다 크거나 같은 경우
    if (
      formData.isOnSale &&
      parseFloat(formData.price) >= parseFloat(formData.originalPrice)
    ) {
      setPriceError("할인가는 원가보다 작은 값을 입력해주세요.");
      return;
    }

    const totalStock = stock.reduce((total, item) => {
      if (item[1] && item[2]) {
        return { ...total, [item[1]]: parseInt(item[2]) };
      }
      return total;
    }, {});

    const submitData = {
      ...formData,
      stock: totalStock,
      price: formData.isOnSale ? formData.price : formData.originalPrice,
      originalPrice: formData.originalPrice,
    };

    if (mode === "new") {
      dispatch(createProduct(submitData));
      // 강제로 모달 닫기 타이머 추가
      setTimeout(() => {
        if (showDialog) {
          setShowDialog(false);
          setFormData({ ...InitialFormData });
          setStock([]);
          setStockError(false);
          setPriceError("");
          setStockQuantityError("");
          setRequiredFieldError("");
        }
      }, 2000);
    } else {
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    const processedValue = id === "sku" ? value.trim() : value;
    setFormData({ ...formData, [id]: processedValue });
  };

  const addStock = () => {
    const newId = Date.now() + Math.random();
    setStock([...stock, [newId, "", ""]]);
  };

  const deleteStock = (idx) => {
    const newStock = stock.filter((item, index) => index !== idx);
    setStock(newStock);
  };

  const handleSizeChange = (value, index) => {
    const newStock = [...stock];
    newStock[index][1] = value;
    setStock(newStock);
  };

  const handleStockChange = (value, index) => {
    const newStock = [...stock];
    newStock[index][2] = value;
    setStock(newStock);
  };

  const onHandleCategory = (event) => {
    setFormData({
      ...formData,
      category: [event.target.value],
    });
  };

  const uploadImage = (url) => {
    setFormData((prevData) => {
      const newData = { ...prevData, image: url };
      return newData;
    });
  };

  return (
    <Modal
      show={showDialog}
      onHide={handleClose}
      className="admin-modal"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        {mode === "new" ? (
          <Modal.Title>Create New Product</Modal.Title>
        ) : (
          <Modal.Title>Edit Product</Modal.Title>
        )}
      </Modal.Header>
      <Form className="form-container" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="sku">
            <Form.Label>Sku</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Enter Sku"
              required
              value={formData.sku}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Name"
              required
              value={formData.name}
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="string"
            placeholder="Description"
            as="textarea"
            onChange={handleChange}
            rows={3}
            value={formData.description}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="stock">
          <Form.Label className="mr-1">Stock</Form.Label>
          {stockError && (
            <span className="error-message">재고를 추가해주세요</span>
          )}
          <Button size="sm" onClick={addStock}>
            Add +
          </Button>
          <div className="mt-2">
            {stock.map((item, index) => (
              <Row key={item[0]} className="stock-row">
                <Col sm={4}>
                  <Form.Select
                    onChange={(event) =>
                      handleSizeChange(event.target.value, index)
                    }
                    required
                    defaultValue={item[1] ? item[1].toLowerCase() : ""}
                  >
                    <option value="" disabled hidden>
                      Please Choose...
                    </option>
                    {SIZE.map((sizeItem, sizeIndex) => (
                      <option
                        value={sizeItem.toLowerCase()}
                        disabled={stock.some(
                          (stockItem) => stockItem[1] === sizeItem.toLowerCase()
                        )}
                        key={sizeIndex}
                      >
                        {sizeItem}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col sm={6}>
                  <Form.Control
                    onChange={(event) =>
                      handleStockChange(event.target.value, index)
                    }
                    type="number"
                    placeholder="number of stock"
                    value={item[2] || ""}
                    required
                  />
                </Col>
                <Col sm={2} className="stock-delete-btn">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteStock(index)}
                  >
                    -
                  </Button>
                </Col>
              </Row>
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Image">
          <Form.Label>Image *</Form.Label>
          <CloudinaryUploadWidget uploadImage={uploadImage} />
          {!formData.image && (
            <div className="text-danger mt-1">이미지를 업로드해주세요</div>
          )}

          {formData.image && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginTop: "10px",
              }}
            >
              <div className="image-preview-container">
                <img
                  src={formData.image}
                  className="upload-image"
                  alt="uploaded image"
                  onLoad={() => console.log("Image loaded successfully")}
                  onError={(e) => {
                    console.log("Image load failed");
                    e.target.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="originalPrice">
            <Form.Label>Original Price</Form.Label>
            <Form.Control
              value={formData.originalPrice}
              required
              onChange={handleChange}
              type="number"
              placeholder="Enter original price"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="price">
            <div className="price-labels-row">
              <Form.Label>Sale Price</Form.Label>
              <div className="sale-toggle-container">
                <div
                  className={`sale-toggle ${formData.isOnSale ? "active" : ""}`}
                >
                  <span className="toggle-label">Original</span>
                  <div
                    className="toggle-switch"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isOnSale: !formData.isOnSale,
                      })
                    }
                  >
                    <div className="toggle-slider"></div>
                  </div>
                  <span className="toggle-label">Sale</span>
                </div>
              </div>
            </div>
            <div className="sale-price-container">
              <Form.Control
                value={formData.price}
                required
                onChange={handleChange}
                type="number"
                placeholder="Enter sale price"
                className="sale-price-input"
                disabled={!formData.isOnSale}
              />
              {formData.isOnSale && <div className="sale-badge">SALE</div>}
            </div>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              onChange={onHandleCategory}
              value={formData.category[0] || ""}
              required
            >
              <option value="" disabled>
                Please Choose...
              </option>
              {CATEGORY.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={handleChange}
              required
            >
              {STATUS.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>

        {error && (
          <div className="error-message mb-3">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}

        {priceError && (
          <div className="error-message mb-3">
            <Alert variant="danger">{priceError}</Alert>
          </div>
        )}

        {stockQuantityError && (
          <div className="error-message mb-3">
            <Alert variant="danger">{stockQuantityError}</Alert>
          </div>
        )}

        {requiredFieldError && (
          <div className="error-message mb-3">
            <Alert variant="danger">{requiredFieldError}</Alert>
          </div>
        )}

        {mode === "new" ? (
          <Button variant="primary" type="submit">
            Submit
          </Button>
        ) : (
          <Button variant="primary" type="submit">
            Edit
          </Button>
        )}
      </Form>
    </Modal>
  );
};

export default NewItemDialog;
