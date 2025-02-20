// file: HouseEditModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateHouseAPI } from "../../services/UserService";
import { toast } from "react-toastify";
import "./HouseDetailModal.scss"; // Hoặc file CSS tương tự

const HouseEditModal = ({ show, onClose, houseData, onUpdateSuccess }) => {
  const [editData, setEditData] = useState({
    house_name: "",
    cost: "",
    area: "",
    address: "",
    description: "",
    utilities: {
      bedrooms: 0,
      floors: 1,
      bathrooms: 1,
      security: false,
      fire_protection: false,
      parking: false,
      camera: false
    }
  });

  useEffect(() => {
    if (houseData) {
      // Gán dữ liệu ban đầu
      setEditData({
        house_name: houseData.house_name || "",
        cost: houseData.cost || "",
        area: houseData.area || "",
        address: houseData.address || "",
        description: houseData.description || "",
        utilities: {
          bedrooms: houseData.utilities?.bedrooms || 0,
          floors: houseData.utilities?.floors || 1,
          bathrooms: houseData.utilities?.bathrooms || 1,
          security: !!houseData.utilities?.security,
          fire_protection: !!houseData.utilities?.fire_protection,
          parking: !!houseData.utilities?.parking,
          camera: !!houseData.utilities?.camera
        }
      });
    }
  }, [houseData]);

  const handleOnChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUtilityChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      let res = await updateHouseAPI(houseData.house_id, editData);
      if (res && res.data && res.data.success) {
        toast.success("Cập nhật thành công!");
        onUpdateSuccess(); // Gọi callback để refetch & đóng modal
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!");
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="xl" centered className="house-modal">
      <Modal.Body className="house-modal-content">
        <Button className="close-modal-btn" onClick={onClose}>X</Button>
        <div className="house-detail-wrapper">
          <h2>Chỉnh sửa nhà trọ</h2>
          {/* Form chỉnh sửa */}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Tên bài đăng:</Form.Label>
              <Form.Control
                type="text"
                value={editData.house_name}
                onChange={(e) => handleOnChange("house_name", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Giá (VNĐ):</Form.Label>
              <Form.Control
                type="number"
                value={editData.cost}
                onChange={(e) => handleOnChange("cost", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Diện tích (m2):</Form.Label>
              <Form.Control
                type="number"
                value={editData.area}
                onChange={(e) => handleOnChange("area", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Địa chỉ:</Form.Label>
              <Form.Control
                type="text"
                value={editData.address}
                onChange={(e) => handleOnChange("address", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Mô tả:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editData.description}
                onChange={(e) => handleOnChange("description", e.target.value)}
              />
            </Form.Group>
            {/* Tiện ích */}
            <hr />
            <h4>Tiện ích</h4>
            <Form.Group className="mb-2">
              <Form.Label>Phòng ngủ:</Form.Label>
              <Form.Control
                type="number"
                value={editData.utilities.bedrooms}
                onChange={(e) => handleUtilityChange("bedrooms", +e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Số tầng:</Form.Label>
              <Form.Control
                type="number"
                value={editData.utilities.floors}
                onChange={(e) => handleUtilityChange("floors", +e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Số phòng tắm:</Form.Label>
              <Form.Control
                type="number"
                value={editData.utilities.bathrooms}
                onChange={(e) => handleUtilityChange("bathrooms", +e.target.value)}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="An ninh"
              checked={editData.utilities.security}
              onChange={(e) => handleUtilityChange("security", e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              label="PCCC"
              checked={editData.utilities.fire_protection}
              onChange={(e) => handleUtilityChange("fire_protection", e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              label="Bãi đỗ xe"
              checked={editData.utilities.parking}
              onChange={(e) => handleUtilityChange("parking", e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              label="Camera giám sát"
              checked={editData.utilities.camera}
              onChange={(e) => handleUtilityChange("camera", e.target.checked)}
            />

            <div className="mt-3">
              <Button variant="success" onClick={handleSave}>Lưu</Button>
              <Button variant="secondary" className="ms-2" onClick={onClose}>Hủy</Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default HouseEditModal;
