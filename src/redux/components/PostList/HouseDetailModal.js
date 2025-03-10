import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Card, Row, Col } from "react-bootstrap";
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
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import "./HouseDetailModal.scss";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { toast } from "react-toastify";
import { fetchUserInfo } from "../../services/UserService";
import { deleteAComment } from "../../services/CommentService";

const HouseDetailModal = ({ houseId, isOpen, onClose }) => {
  const [house, setHouse] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newComment, setNewComment] = useState({
    rating: 5,
    description: "",
  });

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHouse = async () => {
    try {
      if (houseId) {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_URL}/house/${houseId}`
        );
        // Kiểm tra dữ liệu trả về từ API
        if (response && response.data && +response.data.EC === 0) {
          setHouse(response.data.DT); // Chỉ lấy phần "data"
        } else {
          console.error("Dữ liệu trả về không hợp lệ:", response.data);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu nhà:", error);
    }
  };

  const fetchData = async () => {
    try {
      const userInfo = await fetchUserInfo();
      if (userInfo && userInfo.data && +userInfo.data.EC === 0) {
        setUserId(userInfo.data.DT.payload.id);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouse();

    fetchData();
  }, [houseId]);

  const handleSubmitComment = async () => {
    if (!newComment.description.trim()) {
      toast.error("Bình luận không được để trống!");
      return;
    }

    try {
      let username = "";
      let userId = "";
      // Lấy tên người dùng thông qua cookie
      const userInfo = await fetchUserInfo();
      if (userInfo && userInfo.data && +userInfo.data.EC === 0) {
        username = userInfo.data.DT.payload.username;
        userId = userInfo.data.DT.payload.id;
      } else {
        toast.error("Không có dữ liệu người dùng!");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/comment/house/${houseId}`,
        {
          rater_id: userId, // ID user đang đăng nhập, có thể lấy từ state nếu có
          rater_name: username,
          rating: newComment.rating,
          description: newComment.description,
        }
      );

      if (response.data.success) {
        toast.success("Bình luận đã được gửi!");
        setNewComment({ rating: 5, description: "" });

        // Cập nhật danh sách bình luận mới
        setHouse((prevHouse) => ({
          ...prevHouse,
          comments: [...prevHouse.comments, response.data.data],
        }));
      } else {
        toast.error("Gửi bình luận thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      toast.warning("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
      try {
        await deleteAComment(commentId);
        toast.success("Xóa bình luận thành công");
        // Cập nhật lại danh sách bình luận
        setHouse({
          ...house,
          comments: house.comments.filter(
            (comment) => comment.comment_id !== commentId
          ),
        });
      } catch (error) {
        console.error("Lỗi khi xóa bình luận:", error);
        toast.error("Không thể xóa bình luận");
      }
    }
  };

  // Hàm biến đổi rating từ số thành biểu tượng ngôi sao
  const ratingStars = (ratingNum) => {
    const ratingINT = Math.floor(ratingNum); // Phần nguyên của rating
    const halfRating = ratingNum % 1; // Phần thập phân của rating
    let fullStars = ratingINT;
    let halfStar = false;

    // Xử lý phần thập phân
    if (halfRating > 0.8) {
      fullStars = Math.ceil(ratingNum); // Làm tròn lên
    } else if (halfRating >= 0.3 && halfRating <= 0.7) {
      halfStar = true; // Hiển thị nửa ngôi sao
    }

    // Tạo mảng chứa các ngôi sao đầy
    const fullStarElements = Array.from({ length: fullStars }).map(
      (_, index) => <FontAwesomeIcon key={index} icon={faStar} size="xl" />
    );

    return (
      <>
        {fullStarElements}
        {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} size="xl" />}
      </>
    );
  };

  if (loading) {
    return <p>Đang tải...</p>;
  }

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
                      src={selectedImage || house?.image}
                      alt={house?.house_name}
                    />
                  </div>

                  {/* Danh sách ảnh nhỏ bên dưới */}
                  <div className="thumbnail-container  mt-2 ">
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
                    <h1 className="house-name">{house.house_name}</h1>
                    <p className="house-address smaller-font">
                      {" "}
                      <FontAwesomeIcon icon={faLocationDot} />{" "}
                      {house.address || "Không có mô tả"}{" "}
                    </p>

                    <p className="house-price-area my-3 ">
                      <FontAwesomeIcon icon={faDollarSign} /> {house.cost} VND -{" "}
                      <FontAwesomeIcon icon={faRulerCombined} /> Diện tích:{" "}
                      {house.area || "Không có mô tả"} m²{" "}
                    </p>

                    <p className="house-rating">
                      Đánh giá {ratingStars(house.average_rate)}
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
                <Col
                  xl={6}
                  className="comments-section-container d-flex flex-column p-2"
                >
                  <h3 style={{ fontSize: "24px", fontWeight: "bold" }}>
                    Bình luận tiêu biểu
                  </h3>
                  <div className="comments-list pr-2">
                    {house.comments.length > 0 ? (
                      house.comments.map((comment) => (
                        <div
                          key={comment.comment_id}
                          className="comment-item mb-2 bordered p-3"
                        >
                          <p style={{ fontWeight: "bold" }}>
                            {comment.rater_name}
                          </p>
                          <div>Đánh giá: {comment.rating} ⭐</div>
                          <p>{comment.description}</p>
                          <p>Bình luận lúc: {comment.createdAt}</p>

                          {/* Hiển thị nút xóa comment nếu đúng người dùng  */}
                          {userId === comment.rater_id && (
                            <div className="d-flex flex-row-reverse">
                              <Button
                                variant="danger"
                                onClick={() =>
                                  handleDeleteComment(comment.comment_id)
                                }
                              >
                                Xóa
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>Chưa có bình luận nào.</p>
                    )}
                  </div>

                  <hr className="bordered mx-2"></hr>

                  {/* 📝 Form Gửi Bình Luận */}
                  <div
                    style={{ background: "#f9f9f9" }}
                    className="comment-form  py-2 px-2 bordered"
                  >
                    <h4 className="mb-3">Viết bình luận</h4>
                    <div className="form-group my-2">
                      <label style={{ fontWeight: "bold" }}>Đánh giá:</label>
                      <select
                        value={newComment.rating}
                        onChange={(e) =>
                          setNewComment({
                            ...newComment,
                            rating: e.target.value,
                          })
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

                    <div className="mt-2">
                      {" "}
                      <Button
                        variant="dark"
                        className="btn-submit"
                        onClick={handleSubmitComment}
                      >
                        Gửi bình luận
                      </Button>
                    </div>
                  </div>
                </Col>

                {/* Tiện ích & Tóm tắt */}
                <Col
                  xl={6}
                  className="house-summary-container p-2 d-flex flex-column"
                >
                  <div className="house-utilities-container px-1 ">
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
                  </div>

                  <hr className="bordered "></hr>
                  <div className="house-description-container">
                    <h3 className="description-title mb-2">Miêu Tả</h3>
                    <p>
                      <FontAwesomeIcon icon={faCheckCircle} />{" "}
                      {house.description || "Không có thông tin"}
                    </p>
                  </div>

                  <hr className="bordered "></hr>

                  {/* Tóm tắt */}
                  <div className=" d-none d-xl-block house-summary-card ml-2 p-5">
                    <Card>
                      <div className="house-summary-content mr-3">
                        {/* Ảnh bên trái */}
                        <div className="house-summary-image">
                          <Card.Img variant="top" src={house.image} />
                        </div>

                        {/* Thông tin nhà bên phải */}
                        <Card.Body className="house-summary-details">
                          <h5>{house.house_name}</h5>{" "}
                          {/* Tên nhà (to và đậm) */}
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
                        <Button variant="dark" className="btn-contact">
                          Liên hệ ngay
                        </Button>
                      </div>
                    </Card>
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <p>Đang tải dữ liệu...</p>
            //he he he
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default HouseDetailModal;
