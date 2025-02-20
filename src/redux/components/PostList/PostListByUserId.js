import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faDollarSign,
  faStar,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./PostList.scss";
import { fetchPostWithUserId } from "../../services/UserService";
import { updateHouseAPI, deleteHouseAPI } from "../../services/UserService";
import { toast } from "react-toastify";

const PostListByUserId = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  const [editHouseId, setEditHouseId] = useState(null);
  // State chứa dữ liệu chỉnh sửa
  const [editData, setEditData] = useState({
    house_name: "",
    cost: "",
    area: "",
    address: "",
    description: "",
    utilities: {
      bedrooms: "",
      floors: "",
      bathrooms: "",
      security: "",
      fire_protection: "",
      parking: "",
      camera: ""
    }
  });

  const callFetchPostsByUserId = async () => {
    console.log(">>> check userId: ", userId);
    let response = await fetchPostWithUserId(userId);
    if (response && response.data && +response.data.EC === 0) {
      setPosts(response.data.DT);
    }
  };

  useEffect(() => {
    callFetchPostsByUserId();
  }, [userId]);

  // Khi bấm nút "Chỉnh sửa", lấy dữ liệu từ post 
  const handleEdit = (post) => {
    setEditHouseId(post.house_id);
    setEditData({
      house_name: post.house_name,
      cost: post.cost,
      area: post.area,
      address: post.address,
      description: post.description,
      utilities: {
        bedrooms: post.Utilities?.bedrooms || "",
        floors: post.Utilities?.floors || "",
        bathrooms: post.Utilities?.bathrooms || "",
        security: post.Utilities?.security || "",
        fire_protection: post.Utilities?.fire_protection || "",
        parking: post.Utilities?.parking || "",
        camera: post.Utilities?.camera || ""
      }
    });
  };

  // Khi bấm "Hủy", reset state editData
  const handleCancelEdit = () => {
    setEditHouseId(null);
    setEditData({
      house_name: "",
      cost: "",
      area: "",
      address: "",
      description: "",
      utilities: {
        bedrooms: "",
        floors: "",
        bathrooms: "",
        security: "",
        fire_protection: "",
        parking: "",
        camera: ""
      }
    });
  };

  // Xử lý thay đổi cho các trường cơ bản
  const handleOnChangeInput = (value, name) => {
    let _editData = _.cloneDeep(editData);
    _editData[name] = value;
    setEditData(_editData);
  };

  // Xử lý thay đổi cho các trường tiện ích
  const handleUtilityChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        [field]: value,
      },
    }));
  };

  // Khi bấm "Lưu" -> Gửi API update với toàn bộ dữ liệu
  const handleSaveEdit = async () => {
    try {
      let res = await updateHouseAPI(editHouseId, editData);
      if (res && res.data && res.data.success) {
        toast.success("Cập nhật bài đăng thành công!");
        callFetchPostsByUserId();
        setEditHouseId(null);
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi cập nhật bài đăng!");
    }
  };

  // Khi bấm "Xóa"
  const handleDelete = async (houseId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")) {
      return;
    }
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

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-12">
          {posts.map((post) => {
            const isEditing = editHouseId === post.house_id;
            return (
              <Card key={post.house_id} className="medium-card mb-2" style={{ maxWidth: "100%" }}>
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
                      {isEditing ? (
                        <div className="edit-form">
                          {/* Các trường cơ bản */}
                          <Form.Group className="mb-2">
                            <Form.Label>Tên bài đăng:</Form.Label>
                            <Form.Control
                              type="text"
                              value={editData.house_name}
                              onChange={(e) => handleOnChangeInput(e.target.value, "house_name")}
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>Giá (VNĐ):</Form.Label>
                            <Form.Control
                              type="number"
                              value={editData.cost}
                              onChange={(e) => handleOnChangeInput(e.target.value, "cost")}
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>Diện tích (m2):</Form.Label>
                            <Form.Control
                              type="number"
                              value={editData.area}
                              onChange={(e) => handleOnChangeInput(e.target.value, "area")}
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>Địa chỉ:</Form.Label>
                            <Form.Control
                              type="text"
                              value={editData.address}
                              onChange={(e) => handleOnChangeInput(e.target.value, "address")}
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>Mô tả:</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={editData.description}
                              onChange={(e) => handleOnChangeInput(e.target.value, "description")}
                            />
                          </Form.Group>
                          {/* Các trường tiện ích */}
                          <Form.Group className="mb-2">
                            <Form.Label>Số phòng ngủ:</Form.Label>
                            <Form.Control
                              type="number"
                              value={editData.utilities.bedrooms}
                              onChange={(e) => handleUtilityChange("bedrooms", e.target.value)}
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>Số tầng:</Form.Label>
                            <Form.Control
                              type="number"
                              value={editData.utilities.floors}
                              onChange={(e) => handleUtilityChange("floors", e.target.value)}
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>Số phòng tắm:</Form.Label>
                            <Form.Control
                              type="number"
                              value={editData.utilities.bathrooms}
                              onChange={(e) => handleUtilityChange("bathrooms", e.target.value)}
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>An ninh:</Form.Label>
                            <Form.Control
                              type="text"
                              value={editData.utilities.security}
                              onChange={(e) => handleUtilityChange("security", e.target.value)}
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>Phòng cháy chữa cháy:</Form.Label>
                            <Form.Control
                              type="text"
                              value={editData.utilities.fire_protection}
                              onChange={(e) => handleUtilityChange("fire_protection", e.target.value)}
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>Bãi đỗ xe:</Form.Label>
                            <Form.Control
                              type="text"
                              value={editData.utilities.parking}
                              onChange={(e) => handleUtilityChange("parking", e.target.value)}
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>Camera giám sát:</Form.Label>
                            <Form.Control
                              type="text"
                              value={editData.utilities.camera}
                              onChange={(e) => handleUtilityChange("camera", e.target.value)}
                            />
                          </Form.Group>
                          <Button variant="success" onClick={handleSaveEdit}>
                            Lưu
                          </Button>
                          <Button variant="secondary" className="ms-2" onClick={handleCancelEdit}>
                            Hủy
                          </Button>
                        </div>
                      ) : (
                        <>
                          <h4 className="title-font">{post.house_name}</h4>
                          <p className="highlight-font">
                            <FontAwesomeIcon icon={faDollarSign} /> Giá: {post.cost}đ {" - "} Diện tích: {post.area}m2
                          </p>
                          <p className="smaller-font lighter-font text-truncate">
                            <FontAwesomeIcon icon={faLocationDot} /> {post.address}
                          </p>
                          <p className="smaller-font lighter-font text-truncate">
                            {post.description}
                          </p>
                        </>
                      )}

                      <div className="d-flex">
                        <div>
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon key={i} icon={faStar} size="sm" color="rgb(255, 212, 59)" />
                          ))}
                        </div>
                        <div className="mx-auto"></div>
                        {editHouseId !== post.house_id && (
                          <div>
                            <Button className="mx-1" variant="warning" onClick={() => handleEdit(post)}>
                              <FontAwesomeIcon color="dark" icon={faPenToSquare} size="sm" /> Chỉnh sửa
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete(post.house_id)}>
                              <FontAwesomeIcon color="dark" icon={faTrash} size="sm" /> Xóa bài đăng
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PostListByUserId;
