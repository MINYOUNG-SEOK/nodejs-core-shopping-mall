import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";
import { CATEGORY, STATUS, SIZE } from "../../../constants/product.constants";
import "../style/adminProduct.style.css";
import {
  clearError,
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

  useEffect(() => {
    if (success) setShowDialog(false);
  }, [success]);

  useEffect(() => {
    if (error || !success) {
      dispatch(clearError());
    }
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
    setShowDialog(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (stock.length === 0) return setStockError(true);
    setStockError(false);
    const totalStock = stock.reduce((total, item) => {
      if (item[1] && item[2]) {
        return { ...total, [item[1]]: parseInt(item[2]) };
      }
      return total;
    }, {});
    if (mode === "new") {
      dispatch(createProduct({ ...formData, stock: totalStock }));
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
    <Modal show={showDialog} onHide={handleClose} className="admin-modal">
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

        <Form.Group className="mb-3" controlId="Image" required>
          <Form.Label>Image</Form.Label>
          <CloudinaryUploadWidget uploadImage={uploadImage} />

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
            />
          </Form.Group>

          <Form.Group as={Col} controlId="price">
            <Form.Label>Sale Price</Form.Label>
            <Form.Control
              value={formData.price}
              required
              onChange={handleChange}
              type="number"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="isOnSale">
            <Form.Label>On Sale</Form.Label>
            <Form.Select
              value={formData.isOnSale ? "true" : "false"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isOnSale: e.target.value === "true",
                })
              }
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </Form.Select>
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
