import { useState, useEffect } from "react";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
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

  const handleGetUserInfo = async () => {
    let response = await fetchUserInfo();
    if (response && response.data && +response.data.EC === 0) {
      // console.log(">>> check decoded: ", response.data.DT);
      setUserInfo(response.data.DT.payload);
      // console.log("check userId: ", response.data.DT.payload.id);
      userId = response.data.DT.payload.id;
      // console.log(">>> check userId: ", userId);
    }
  };

  useEffect(() => {
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
      let response = await updateUserInfo(userInfo.id, inputData);
      if (response && response.data && +response.data.EC === 0) {
        toast.success("Chỉnh sửa thông tin người dùng thành công!");
        await handleGetUserInfo();
      }
    }
  };

  const handleBackToHomePage = () => {
    history.push("/");
  };

  return (
    <>
      <div className="fullscreen-page">
        <Container className="page-content">
          {/* HEADER */}
          <Row className="mb-3">
            <Col className="d-flex justify-content-end">
              <Button variant="light" onClick={() => handleBackToHomePage()}>
                <FontAwesomeIcon icon={faX} size="lg" />
              </Button>
            </Col>
          </Row>

          {/* THÔNG TIN CÁ NHÂN */}
          <div className="modal-container my-3">
            <Row className="justify-content-center">
              <Col xs={12} className="text-center">
                <h4 className="modal-title">Thông tin cá nhân</h4>
              </Col>
            </Row>

            <hr className="horizontal-line" />

            <Form>
              <Form.Group as={Row} className="mb-2" controlId="formUsername">
                <Form.Label column xs={12} md={3} className="smaller-title">
                  <FontAwesomeIcon icon={faUser} /> Tên người dùng
                </Form.Label>
                <Col xs={12} md={9}>
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
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2" controlId="formEmail">
                <Form.Label column xs={12} md={3} className="smaller-title">
                  <FontAwesomeIcon icon={faEnvelope} /> Email
                </Form.Label>
                <Col xs={12} md={9}>
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
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2" controlId="formPhone">
                <Form.Label column xs={12} md={3} className="smaller-title">
                  <FontAwesomeIcon icon={faPhone} /> Số điện thoại
                </Form.Label>
                <Col xs={12} md={9}>
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
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2" controlId="formGender">
                <Form.Label column xs={12} md={3} className="smaller-title">
                  <FontAwesomeIcon icon={faVenusMars} /> Giới tính
                </Form.Label>
                <Col xs={12} md={9}>
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
                          setInputData(userInfo);
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

          {/* THÔNG TIN BÀI ĐĂNG */}
          <div className="modal-container my-3">
            <Row className="justify-content-center">
              <Col xs={12} className="text-center">
                <h4 className="modal-title">Thông tin bài đăng</h4>
              </Col>
            </Row>
            <hr className="horizontal-line" />
            <Row>
              <Col xs={12}>
                {userInfo.id && <PostListByUserId userId={userInfo.id} />}
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default UserInfoModal;
