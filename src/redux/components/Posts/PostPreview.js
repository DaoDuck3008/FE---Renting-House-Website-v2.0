import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faRulerCombined,
  faCheckCircle,
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

const PostPreview = ({ house, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);

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
                      src={selectedImage || house?.images[0]}
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
                        src={img}
                        alt={`Thumbnail ${index}`}
                        onClick={() => setSelectedImage(img)}
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
                    <h1 className="house-name">
                      {house.house_name || "Không có tiêu đề"}
                    </h1>
                    <p className="house-address smaller-font">
                      {" "}
                      <FontAwesomeIcon icon={faLocationDot} />{" "}
                      {house.address || "Không có mô tả"}{" "}
                    </p>

                    <p className="house-price-area my-3 ">
                      <FontAwesomeIcon icon={faDollarSign} /> {house.cost || 0}{" "}
                      VND - <FontAwesomeIcon icon={faRulerCombined} /> Diện
                      tích: {house.area || 0} m²{" "}
                    </p>

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
                        <p className="mt-3">
                          <FontAwesomeIcon icon={faBed} size="xl" /> Phòng ngủ:{" "}
                          {house.Utilities ? house.Utilities.bedrooms : 1}
                        </p>
                        <p>
                          <FontAwesomeIcon icon={faBuilding} size="xl" /> Số
                          tầng: {house.Utilities ? house.Utilities.floor : 1}
                        </p>{" "}
                        <p>
                          <FontAwesomeIcon icon={faBath} size="xl" /> Phòng tắm:{" "}
                          {house.Utilities ? house.Utilities.bathrooms : 1}
                        </p>
                      </Col>

                      <Col lg={6}>
                        <p
                          className="mt-3"
                          style={
                            house.Utilities?.security ? {} : { color: "#ccc" }
                          }
                        >
                          <FontAwesomeIcon icon={faShieldAlt} size="xl" /> An
                          ninh
                        </p>
                        <p
                          style={
                            house.Utilities?.fire_protection
                              ? {}
                              : { color: "#ccc" }
                          }
                        >
                          <FontAwesomeIcon
                            icon={faFireExtinguisher}
                            size="xl"
                          />{" "}
                          Phòng cháy chữa cháy
                        </p>
                        <p
                          style={
                            house.Utilities?.parking ? {} : { color: "#ccc" }
                          }
                        >
                          <FontAwesomeIcon icon={faCar} size="xl" /> Bãi đỗ xe
                        </p>
                        <p
                          style={
                            house.Utilities?.camera ? {} : { color: "#ccc" }
                          }
                        >
                          <FontAwesomeIcon icon={faVideo} size="xl" /> Camera
                          giám sát
                        </p>
                      </Col>
                    </Row>
                  </Col>

                  {/* <hr className=" bordered "></hr> */}
                  <Col sm={12} xl={6} className="house-description-container">
                    <h3 className="description-title mb-2">Miêu Tả</h3>
                    <p>
                      <FontAwesomeIcon icon={faCheckCircle} />{" "}
                      {house.description || "Không có thông tin"}
                    </p>
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
    </Modal>
  );
};

export default PostPreview;
