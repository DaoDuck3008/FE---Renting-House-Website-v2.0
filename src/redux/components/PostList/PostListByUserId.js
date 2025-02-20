import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faDollarSign,
  faStar,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./PostList.scss";
import { fetchPostWithUserId, deleteHouseAPI } from "../../services/UserService";
import { toast } from "react-toastify";
// Import HouseEditModal
import HouseEditModal from "../Modal/HouseEditModal";


const PostListByUserId = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);

  const callFetchPostsByUserId = async () => {
    let response = await fetchPostWithUserId(userId);
    if (response && response.data && +response.data.EC === 0) {
      setPosts(response.data.DT);
    }
  };

  useEffect(() => {
    callFetchPostsByUserId();
  }, [userId]);

  // Mở modal chỉnh sửa
  const handleEdit = (house) => {
    setSelectedHouse(house);
    setShowEditModal(true);
  };

  // Khi bấm "Xóa"
  const handleDelete = async (houseId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")) return;
    try {
      let res = await deleteHouseAPI(houseId);
      if (res && res.data && res.data.success) {
        toast.success("Xóa bài đăng thành công!");
        callFetchPostsByUserId();
      } else {
        toast.error("Xóa thất bại!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi xóa bài đăng!");
    }
  };


  const handleUpdateSuccess = () => {
    setShowEditModal(false);
    callFetchPostsByUserId();
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-12">
          {posts.map((post) => (
            <Card
              key={post.house_id}
              className="medium-card mb-2"
              style={{ maxWidth: "100%" }}
            >
              <Row className="align-items-start">
                <Col xs={12} md={4} className="left-side2">
                  <img
                    src={post.image}
                    className="img-fluid rounded px-1"
                    alt="House"
                  />
                </Col>
                <Col xs={12} md={8} className="right-side2">
                  <Card.Body>
                    <h4 className="title-font">{post.house_name}</h4>
                    <p className="highlight-font">
                      <FontAwesomeIcon icon={faDollarSign} /> Giá: {post.cost}đ
                      {" - "} Diện tích: {post.area}m2
                    </p>
                    <p className="smaller-font lighter-font text-truncate">
                      <FontAwesomeIcon icon={faLocationDot} /> {post.address}
                    </p>
                    <p className="smaller-font lighter-font text-truncate">
                      {post.description}
                    </p>

                    <div className="d-flex">
                      <div>
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            size="sm"
                            color="rgb(255, 212, 59)"
                          />
                        ))}
                      </div>
                      <div className="mx-auto"></div>
                      <div>
                        <Button
                          className="mx-1"
                          variant="warning"
                          onClick={() => handleEdit(post)}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} size="sm" />{" "}
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(post.house_id)}
                        >
                          <FontAwesomeIcon icon={faTrash} size="sm" /> Xóa bài
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      {showEditModal && selectedHouse && (
        <HouseEditModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          houseData={selectedHouse}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default PostListByUserId;
