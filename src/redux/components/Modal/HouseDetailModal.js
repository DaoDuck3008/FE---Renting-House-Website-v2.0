import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faRulerCombined,
  faCheckCircle,
  faTimes,
  faMapMarkerAlt,
  faBed,
  faBuilding,
  faBath,
  faShieldAlt,
  faFireExtinguisher,
  faCar,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import "./HouseDetailModal.scss";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";

const HouseDetailModal = ({ houseId, isOpen, onClose }) => {
  const [house, setHouse] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newComment, setNewComment] = useState({
    rating: 5,
    description: "",
  });
  useEffect(() => {
    if (houseId) {
      const fetchHouse = async () => {
        try {
          const response = await axios.get(
            `http://localhost:2000/api/v1/house/${houseId}`
          );
          // Kiểm tra dữ liệu trả về từ API
          if (response.data.success && response.data.data) {
            setHouse(response.data.data); // Chỉ lấy phần "data"
          } else {
            console.error("Dữ liệu trả về không hợp lệ:", response.data);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu nhà:", error);
        }
      };
      fetchHouse();
    }
  }, [houseId]);

  const handleSubmitComment = async () => {
    if (!newComment.description.trim()) {
      alert("Bình luận không được để trống!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:2000/api/v1/comment/house/${houseId}`,
        {
          rater_id: 1, // ID user đang đăng nhập, có thể lấy từ state nếu có
          rating: newComment.rating,
          description: newComment.description,
        }
      );

      if (response.data.success) {
        alert("Bình luận đã được gửi!");
        setNewComment({ rating: 5, description: "" });

        // Cập nhật danh sách bình luận mới
        setHouse((prevHouse) => ({
          ...prevHouse,
          comments: [...prevHouse.comments, response.data.data],
        }));
      } else {
        alert("Gửi bình luận thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      size="xl"
      className="house-modal"
    >
      <Modal.Body className="house-modal-content">
        {/* Nút đóng modal */}
        <Button className="close-modal-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </Button>

        {house ? (
          <div className="house-detail-wrapper">
            {/* 🏠 1️⃣ Phần thông tin nhà */}
            <div className="house-info-container">
              {/* Hình ảnh nhà */}
              <div className="house-image-container">
                {/* Ảnh lớn đang được chọn */}
                <div className="house-image">
                  <img
                    className="main-image"
                    src={selectedImage || house?.image}
                    alt={house?.house_name}
                  />
                </div>

                {/* Danh sách ảnh nhỏ bên dưới */}
                <div className="thumbnail-container">
                  {house?.images?.map((img, index) => (
                    <img
                      key={index}
                      className={`thumbnail ${
                        selectedImage === img.images ? "active" : ""
                      }`}
                      src={img.images}
                      alt={`Thumbnail ${index}`}
                      onClick={() => setSelectedImage(img.images)}
                    />
                  ))}
                </div>
              </div>
              {/* Nội dung thông tin */}
              <div className="house-info-content">
                {/* Mạng xã hội */}
                <div className="social-links-container">
                  <FontAwesomeIcon
                    icon={faFacebook}
                    className="social-icon facebook"
                  />
                  <FontAwesomeIcon
                    icon={faTwitter}
                    className="social-icon twitter"
                  />
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="social-icon instagram"
                  />
                  <FontAwesomeIcon
                    icon={faYoutube}
                    className="social-icon youtube"
                  />
                </div>

                {/* Thông tin chính */}
                <div className="house-main-info">
                  <h1 className="house-name">{house.house_name}</h1>

                  <p className="house-price">
                    <FontAwesomeIcon icon={faDollarSign} /> {house.cost} VND
                  </p>
                  <p className="house-address">
                    {" "}
                    <FontAwesomeIcon icon={faRulerCombined} /> Diện tích:{" "}
                    {house.area || "Không có mô tả"} m²{" "}
                  </p>
                  <p className="house-address">
                    {" "}
                    <FontAwesomeIcon icon={faLocationDot} />{" "}
                    {house.address || "Không có mô tả"}{" "}
                  </p>

                  {house.average_rate && (
                    <p className="house-rating">
                      Đánh giá: {house.average_rate} / 5 ⭐
                    </p>
                  )}

                  <Button className="btn-contact">Liên hệ ngay</Button>
                  <p className="contact-text">Liên hệ để biết thêm thông tin</p>
                </div>
              </div>
            </div>

            {/* 💬 2️⃣ Phần bình luận & tiện ích */}
            <div className="house-lower-section">
              {/* Bình luận */}
              <div className="comments-section-container">
                <h3>Bình luận tiêu biểu</h3>
                <div className="comments-list">
                  {house.comments.length > 0 ? (
                    house.comments.map((comment) => (
                      <div key={comment.comment_id} className="comment-item">
                        <p>{comment.rater_id}</p>
                        <div className="comment-header">
                          Đánh giá: {comment.rating} ⭐
                        </div>
                        <p>{comment.description}</p>
                        <p>Bình luận lúc: {comment.createdAt}</p>
                      </div>
                    ))
                  ) : (
                    <p>Chưa có bình luận nào.</p>
                  )}
                </div>
                {/* 📝 Form Gửi Bình Luận */}
                <div className="comment-form">
                  <h4>Viết bình luận</h4>
                  <div className="form-group">
                    <label>Đánh giá:</label>
                    <select
                      value={newComment.rating}
                      onChange={(e) =>
                        setNewComment({ ...newComment, rating: e.target.value })
                      }
                    >
                      <option value="5">5 ⭐</option>
                      <option value="4">4 ⭐</option>
                      <option value="3">3 ⭐</option>
                      <option value="2">2 ⭐</option>
                      <option value="1">1 ⭐</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Bình luận:</label>
                    <textarea
                      value={newComment.description}
                      onChange={(e) =>
                        setNewComment({
                          ...newComment,
                          description: e.target.value,
                        })
                      }
                      placeholder="Viết bình luận..."
                    ></textarea>
                  </div>

                  <Button className="btn-submit" onClick={handleSubmitComment}>
                    Gửi bình luận
                  </Button>
                </div>
              </div>

              {/* Tiện ích & Tóm tắt */}
              <div className="house-summary-container">
                <div className="house-utilities-container">
                  <h3 className="utilities-title">Tiện ích</h3>
                  <div className="utilities-grid">
                    {house?.Utilities?.bedrooms > 0 && (
                      <p>
                        <FontAwesomeIcon icon={faBed} /> Phòng ngủ:{" "}
                        {house.Utilities.bedrooms}
                      </p>
                    )}
                    {house?.Utilities?.floors > 0 && (
                      <p>
                        <FontAwesomeIcon icon={faBuilding} /> Số tầng:{" "}
                        {house.Utilities.floors}
                      </p>
                    )}
                    {house?.Utilities?.bathrooms > 0 && (
                      <p>
                        <FontAwesomeIcon icon={faBath} /> Phòng tắm:{" "}
                        {house.Utilities.bathrooms}
                      </p>
                    )}
                    {house?.Utilities?.security && (
                      <p>
                        <FontAwesomeIcon icon={faShieldAlt} /> An ninh
                      </p>
                    )}
                    {house?.Utilities?.fire_protection && (
                      <p>
                        <FontAwesomeIcon icon={faFireExtinguisher} /> Phòng cháy
                        chữa cháy
                      </p>
                    )}
                    {house?.Utilities?.parking && (
                      <p>
                        <FontAwesomeIcon icon={faCar} /> Bãi đỗ xe
                      </p>
                    )}
                    {house?.Utilities?.camera && (
                      <p>
                        <FontAwesomeIcon icon={faVideo} /> Camera giám sát
                      </p>
                    )}
                  </div>
                </div>

                <div className="house-description-container">
                  <h3>Miêu Tả</h3>
                  <p>
                    <FontAwesomeIcon icon={faCheckCircle} />{" "}
                    {house.description || "Không có thông tin"}
                  </p>
                </div>

                {/* Tóm tắt */}
                <div className="house-summary-card">
                  <Card>
                    <div className="house-summary-content">
                      {/* Ảnh bên trái */}
                      <div className="house-summary-image">
                        <Card.Img variant="top" src={house.image} />
                      </div>

                      {/* Thông tin nhà bên phải */}
                      <Card.Body className="house-summary-details">
                        <h5>{house.house_name}</h5> {/* Tên nhà (to và đậm) */}
                        <p className="address">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                          {house.address}
                        </p>
                        <p className="rating">{house.average_rate} / 5 ⭐</p>
                        <p className="price">
                          <FontAwesomeIcon icon={faDollarSign} /> {house.cost}{" "}
                          VND
                        </p>
                      </Card.Body>
                    </div>

                    {/* Nút liên hệ nằm ngang ở dưới */}
                    <div className="house-summary-footer">
                      <Button className="btn-contact">Liên hệ ngay</Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Đang tải dữ liệu...</p>
          //he he he
        )}
      </Modal.Body>
    </Modal>
  );
};

export default HouseDetailModal;
