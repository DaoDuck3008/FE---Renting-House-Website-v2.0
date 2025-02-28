import React, { useState } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  ToggleButton,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faRulerCombined,
  faTimes,
  faBed,
  faBuilding,
  faBath,
  faShieldAlt,
  faFireExtinguisher,
  faCar,
  faVideo,
  faStar,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import "./PostPreview.scss";
import _ from "lodash";
import { toast } from "react-toastify";

const EditPost = ({ house, isOpen, onClose, handleEditData }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [editData, setEditData] = useState(house);

  const validInputDefalut = {
    house_name: true,
    address: true,
    cost: true,
    area: true,
    description: true,
  };
  const [validInput, setValidInput] = useState(validInputDefalut);

  // hàm này dùng để thay đổi value của các input nhập vào
  const handleOnChangeInput = (value, name) => {
    let _editData = _.cloneDeep(editData);
    _editData[name] = value;
    setEditData(_editData);
  };

  const handleToggleBtn = (name) => {
    let _editData = _.cloneDeep(editData);
    if (_editData.Utilities[name]) {
      _editData.Utilities[name] = false;
    } else {
      _editData.Utilities[name] = true;
    }

    setEditData(_editData);
  };

  const handleOnChangeUtilities = (value, name) => {
    let _editData = _.cloneDeep(editData);
    _editData.Utilities[name] = value;
    setEditData(_editData);
  };

  // Kiểm tra xem có input nào rỗng không?
  const checkValidation = () => {
    setValidInput(validInputDefalut);

    let arr = ["house_name", "address", "cost", "area", "description"];
    let check = true;
    for (let i = 0; i < arr.length; i++) {
      if (!editData[arr[i]]) {
        toast.error(`You must fill your ${arr[i]}`);
        setValidInput((prev) => ({
          ...prev,
          [arr[i]]: false,
        }));
        check = false;
        break;
      }
    }

    return check;
  };

  const handleSubmit = () => {
    if (checkValidation()) {
      handleEditData(editData);
      onClose();
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      size="xl"
      fullscreen="xl-down"
      className="house-modal"
    >
      <Modal.Body className="house-modal-content d-flex flex-column ">
        {/* Nút đóng modal */}
        <div className="d-flex flex-row-reverse">
          <Button className="close-modal-btn" variant="light" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} size="xl" />
          </Button>
        </div>
        <div>
          {house ? (
            <div className="house-detail-wrapper d-flex flex-column">
              {/* 🏠 1️⃣ Phần thông tin nhà */}
              <Row className="house-info-container d-flex ">
                {/* Hình ảnh nhà */}
                <Col
                  xl={6}
                  className="house-image-container d-flex flex-column align-items-center justify-content-center p-2 overflow-hidden"
                >
                  {/* Ảnh lớn đang được chọn */}
                  <div className="house-image mx-auto">
                    <img
                      className="main-image"
                      src={selectedImage || house?.images[0].images}
                      alt={house?.house_name}
                    />
                  </div>

                  {/* Danh sách ảnh nhỏ bên dưới */}
                  <div className="thumbnail-container  mt-2 ">
                    {house?.images?.map((img, index) => (
                      <img
                        key={index}
                        className={`thumbnail ${
                          selectedImage === img ? "active" : ""
                        }`}
                        src={img.images}
                        alt={`Thumbnail ${index}`}
                        onClick={() => setSelectedImage(img.images)}
                      />
                    ))}
                  </div>
                </Col>

                {/* Nội dung thông tin */}
                <Col xl={6} className="house-info-content d-flex flex-column ">
                  {/* Mạng xã hội */}
                  <div className="social-links-container d-flex">
                    <FontAwesomeIcon
                      style={{ color: "color: #3b5998" }}
                      icon={faFacebook}
                      className="social-icon mx-1"
                    />
                    <FontAwesomeIcon
                      style={{ color: "#1da1f2" }}
                      icon={faTwitter}
                      className="social-icon mx-1"
                    />
                    <FontAwesomeIcon
                      style={{ color: "#e1306c" }}
                      icon={faInstagram}
                      className="social-icon mx-1"
                    />
                    <FontAwesomeIcon
                      style={{ color: "red" }}
                      icon={faYoutube}
                      className="social-icon mx-1"
                    />
                  </div>

                  {/* Thông tin chính */}
                  <div className="house-main-info d-flex flex-column mt-3">
                    <Form.Text className="house-name">Tiêu đề</Form.Text>
                    <Form.Control
                      as="textarea"
                      row={4}
                      className={
                        validInput.house_name
                          ? "house-name"
                          : "house-name is-invalid"
                      }
                      value={editData.house_name}
                      onChange={(event) =>
                        handleOnChangeInput(event.target.value, "house_name")
                      }
                    />
                    <Form.Text
                      className="smaller-font house-address"
                      style={{ fontWeight: "500" }}
                    >
                      <FontAwesomeIcon icon={faLocationDot} /> Địa chỉ{" "}
                    </Form.Text>
                    <Form.Control
                      className={
                        validInput.address
                          ? "house-address smaller-font my-1"
                          : "house-address smaller-font my-1 is-invalid"
                      }
                      value={editData.address}
                      onChange={(event) =>
                        handleOnChangeInput(event.target.value, "address")
                      }
                    />

                    <Row className="my-1">
                      <Col sm={12} lg={6}>
                        <Form.Text className="house-price-area">
                          Giá thuê
                        </Form.Text>
                        <InputGroup>
                          <InputGroup.Text>
                            <FontAwesomeIcon icon={faDollarSign} />
                          </InputGroup.Text>
                          <Form.Control
                            value={editData.cost}
                            className={
                              validInput.cost
                                ? "house-price-area"
                                : "house-price-area is-invalid"
                            }
                            onChange={(event) =>
                              handleOnChangeInput(event.target.value, "cost")
                            }
                          />
                          <InputGroup.Text>VND</InputGroup.Text>
                        </InputGroup>
                      </Col>
                      <Col sm={12} lg={6}>
                        <Form.Text className="house-price-area">
                          Diện tích
                        </Form.Text>
                        <InputGroup>
                          <InputGroup.Text>
                            <FontAwesomeIcon icon={faRulerCombined} />
                          </InputGroup.Text>
                          <Form.Control
                            value={editData.area}
                            className={
                              validInput.area
                                ? "house-price-area"
                                : "house-price-area is-invalid"
                            }
                            onChange={(event) =>
                              handleOnChangeInput(event.target.value, "area")
                            }
                          />
                          <InputGroup.Text>m2</InputGroup.Text>
                        </InputGroup>
                      </Col>
                    </Row>

                    <p className="house-rating">
                      Đánh giá <FontAwesomeIcon icon={faStar} size="lg" />
                      <FontAwesomeIcon icon={faStar} size="lg" />
                      <FontAwesomeIcon icon={faStar} size="lg" />
                      <FontAwesomeIcon icon={faStar} size="lg" />
                      <FontAwesomeIcon icon={faStar} size="lg" />
                    </p>

                    <div className="d-flex justify-content-center my-2">
                      <Button variant="dark" className="btn-contact">
                        Liên hệ ngay
                      </Button>
                    </div>
                    <p className="contact-text mt-2">
                      Liên hệ để biết thêm thông tin
                    </p>
                  </div>
                </Col>
              </Row>

              <hr className="bordered mx-2"></hr>

              {/* 💬 2️⃣ Phần bình luận & tiện ích */}
              <Row className="house-lower-section d-flex flex-column-reverse flex-xl-row mt-2">
                {/* Bình luận */}

                {/* Tiện ích & Tóm tắt */}
                <Row className="house-summary-container p-2  ">
                  <Col
                    sm={12}
                    xl={6}
                    className="house-utilities-container px-1 "
                  >
                    <h3 className="utilities-title mt-1">Tiện ích</h3>
                    <Row className="utilities-grid">
                      <Col lg={6}>
                        <div className="my-1">
                          <p className="mt-3">
                            <FontAwesomeIcon icon={faBed} size="xl" /> Phòng
                            ngủ:{" "}
                          </p>
                          <Form.Control
                            value={editData.Utilities.bedrooms}
                            type="number"
                            min={1}
                            onChange={(event) =>
                              handleOnChangeUtilities(
                                event.target.value,
                                "bedrooms"
                              )
                            }
                          />
                        </div>

                        <div className="my-1">
                          <p className="mt-3">
                            <FontAwesomeIcon icon={faBath} size="xl" /> Phòng
                            tắm:{" "}
                          </p>
                          <Form.Control
                            value={editData.Utilities.bathrooms}
                            type="number"
                            min={1}
                            onChange={(event) =>
                              handleOnChangeUtilities(
                                event.target.value,
                                "bathrooms"
                              )
                            }
                          />
                        </div>

                        <div className="my-1">
                          <p className="mt-3">
                            <FontAwesomeIcon icon={faBuilding} size="xl" /> Số
                            tầng:{" "}
                          </p>
                          <Form.Control
                            value={editData.Utilities.floors}
                            type="number"
                            min={1}
                            onChange={(event) =>
                              handleOnChangeUtilities(
                                event.target.value,
                                "floors"
                              )
                            }
                          />
                        </div>
                      </Col>

                      <Col lg={6}>
                        <ToggleButton
                          type="checkbox"
                          variant="outline-dark "
                          className="mt-3"
                          checked={editData.Utilities.security}
                          onClick={() => handleToggleBtn("security")}
                        >
                          <FontAwesomeIcon icon={faShieldAlt} size="xl" /> An
                          ninh
                        </ToggleButton>

                        <ToggleButton
                          type="checkbox"
                          variant="outline-dark "
                          className="mt-3"
                          checked={editData.Utilities.fire_protection}
                          onClick={() => handleToggleBtn("fire_protection")}
                        >
                          <FontAwesomeIcon
                            icon={faFireExtinguisher}
                            size="xl"
                          />{" "}
                          Phòng cháy chữa cháy
                        </ToggleButton>

                        <ToggleButton
                          type="checkbox"
                          variant="outline-dark "
                          className="mt-3"
                          checked={editData.Utilities.parking}
                          onClick={() => handleToggleBtn("parking")}
                        >
                          <FontAwesomeIcon icon={faCar} size="xl" /> Bãi đỗ xe
                        </ToggleButton>

                        <ToggleButton
                          type="checkbox"
                          variant="outline-dark "
                          className="mt-3"
                          checked={editData.Utilities.camera}
                          onClick={() => handleToggleBtn("camera")}
                        >
                          <FontAwesomeIcon icon={faVideo} size="xl" /> Camera
                          giám sát
                        </ToggleButton>
                      </Col>
                    </Row>
                  </Col>

                  {/* <hr className=" bordered "></hr> */}
                  <Col sm={12} xl={6} className="house-description-container">
                    <h3 className="description-title mb-2">Miêu Tả</h3>
                    <Form.Control
                      as="textarea"
                      rows={10}
                      style={{ maxWidth: "800px", margin: "0 auto" }}
                      value={editData.description}
                      onChange={(event) =>
                        handleOnChangeInput(event.target.value, "description")
                      }
                      className={validInput.description ? "" : "is-invalid"}
                    />
                    <Form.Text muted>
                      Tối thiểu 30 ký tự, tối đa 3000 ký tự
                    </Form.Text>
                  </Col>
                </Row>
                <hr className="bordered "></hr>
              </Row>
            </div>
          ) : (
            <p>Đang tải dữ liệu...</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          className="mx-1"
          onClick={() => handleSubmit()}
        >
          Lưu
        </Button>
        <Button
          variant="danger"
          className="mx-1"
          onClick={() => {
            setEditData(house);
            onClose();
          }}
        >
          Hủy
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPost;
