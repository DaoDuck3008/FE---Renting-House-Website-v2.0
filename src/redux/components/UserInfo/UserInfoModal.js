import { useState, useEffect } from "react";
import { Modal, Form, Button, Col, Row } from "react-bootstrap";
import { fetchUserInfo, updateUserInfo } from "../../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faVenusMars,
  faEnvelope,
  faPenToSquare,
  faX,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import _ from "lodash";
import PostListByUserId from "../PostList/PostListByUserId";
import "./UserInfoModal.scss";
import { toast } from "react-toastify";

const UserInfoModal = (props) => {
  const [userInfo, setUserInfo] = useState({});
  const [isEditing, setEditing] = useState(false);
  const [inputData, setInputData] = useState({
    username: "",
    email: "",
    phone: "",
    gender: userInfo.gender,
  });
  const [validInput, setValidInput] = useState({
    username: true,
    email: true,
    phone: true,
    gender: true,
  });

  const history = useHistory();

  let userId;

  useEffect(() => {
    const handleGetUserInfo = async () => {
      let response = await fetchUserInfo();
      if (response && response.data && +response.data.EC === 0) {
        // console.log(">>> check decoded: ", response.data.DT);
        setUserInfo(response.data.DT.payload);
        // console.log("check userId: ", response.data.DT.payload.id);
        userId = response.data.DT.payload.id;
        console.log(">>> check userId: ", userId);
      }
    };

    handleGetUserInfo();
  }, [isEditing]);

  const handleOnChangeInput = (value, name) => {
    let _inputData = _.cloneDeep(inputData);
    _inputData[name] = value;
    setInputData(_inputData);
  };

  const checkValidInput = () => {
    let check = true;
    let arr = ["username", "email", "phone"];
    for (let i = 0; i < arr.length; i++) {
      if (!inputData[arr[i]]) {
        toast.error(`You must change your ${arr[i]}!`);
        let _validInput = _.cloneDeep(validInput);
        _validInput[arr[i]] = false;
        setValidInput(_validInput);
        check = false;
        break;
      }
    }

    return check;
  };

  const handleChangeUserInfo = () => {
    setInputData(userInfo);
    setEditing(true);
  };

  const handleSubmitChangeUserInfo = async () => {
    if (checkValidInput()) {
      setEditing(false);
      await updateUserInfo(userInfo.id, inputData);
    }
  };

  const handleBackToHomePage = () => {
    history.push("/");
  };

  return (
    <>
      <div className="fullscreen-page">
        <div className="page-content">
          {/* HEADER */}
          <div className="d-flex justify-content-end">
            <Button variant="light" onClick={() => handleBackToHomePage()}>
              <FontAwesomeIcon icon={faX} size="lg" />
            </Button>
          </div>

          {/* THÔNG TIN CÁ NHÂN */}
          <div className="modal-container container my-3 ">
            <div className="d-flex justify-content-center mx-auto">
              <h4 className="modal-title">Thông tin cá nhân</h4>
            </div>

            <hr className="horizontal-line" />

            <Form>
              <Form.Group
                as={Row}
                className="mb-2"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="3" className="smaller-title">
                  <FontAwesomeIcon icon={faUser} /> Tên người dùng
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    onChange={(e) =>
                      handleOnChangeInput(e.target.value, "username")
                    }
                    className={
                      validInput.username
                        ? "custom-input"
                        : "custom-input is-invalid"
                    }
                    plaintext={!isEditing}
                    readOnly={!isEditing}
                    value={inputData?.username || ""}
                    placeholder={userInfo.username}
                  />
                  <hr className="horizontal-line" />
                </Col>
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-2"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="3" className="smaller-title">
                  <FontAwesomeIcon icon={faEnvelope} /> Email
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    onChange={(event) =>
                      handleOnChangeInput(event.target.value, "email")
                    }
                    className={
                      validInput.email
                        ? "custom-input"
                        : "custom-input is-invalid"
                    }
                    plaintext={!isEditing}
                    readOnly={!isEditing}
                    value={inputData?.email || ""}
                    placeholder={userInfo.email}
                  />
                  <hr className="horizontal-line" />
                </Col>
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-2"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="3" className="smaller-title">
                  <FontAwesomeIcon icon={faPhone} /> Số điện thoại
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    onChange={(event) =>
                      handleOnChangeInput(event.target.value, "phone")
                    }
                    className={
                      validInput.phone
                        ? "custom-input"
                        : "custom-input is-invalid"
                    }
                    plaintext={!isEditing}
                    readOnly={!isEditing}
                    value={inputData?.phone || ""}
                    placeholder={userInfo.phone}
                  />
                  <hr className="horizontal-line" />
                </Col>
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-2"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="3" className="smaller-title">
                  <FontAwesomeIcon icon={faVenusMars} /> Giới tính
                </Form.Label>
                <Col sm="8">
                  <Form.Select
                    className={
                      !isEditing ? "custom-input no-border" : "custom-input"
                    }
                    disabled={!isEditing}
                    name="gender"
                    value={inputData?.gender || ""}
                    onChange={(event) =>
                      handleOnChangeInput(event.target.value, "gender")
                    }
                    style={{
                      backgroundColor: "white",
                    }}
                  >
                    <option value="">{userInfo.gender} (Mặc định)</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </Form.Select>
                </Col>
              </Form.Group>

              {/* Nút chỉnh sửa / lưu */}
              <Row className="mt-3">
                <Col className="d-flex justify-content-end">
                  {isEditing ? (
                    <>
                      <Button
                        variant="success"
                        onClick={() => handleSubmitChangeUserInfo()}
                      >
                        <FontAwesomeIcon icon={faCheck} /> Lưu
                      </Button>
                      <Button
                        variant="danger"
                        className="ms-2"
                        onClick={() => {
                          setInputData(userInfo); // Reset lại dữ liệu ban đầu
                          setEditing(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} /> Hủy
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="warning"
                      onClick={() => handleChangeUserInfo()}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} /> Chỉnh sửa
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
            <hr className="horizontal-line" />
          </div>

          {/* THÔNG TIN BÀI ĐĂNG  */}
          <div className="modal-container container my-3 ">
            <div className="d-flex justify-content-center mx-auto">
              <h4 className="modal-title">Thông tin bài đăng</h4>
            </div>
            <hr className="horizontal-line" />
            <div className="d-flex justify-content-center flex-column ">
              {userInfo.id && <PostListByUserId userId={userInfo.id} />}{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInfoModal;
