import {
  Stack,
  Form,
  InputGroup,
  FormControl,
  FormLabel,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./RegisterModal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faX,
  faEnvelope,
  faPhone,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import facebookIcon from "../../../public/image/facebook.png";
import googleIcon from "../../../public/image/google.png";
import _ from "lodash";
import { useState } from "react";
import { toast } from "react-toastify";
import { registerUser } from "../../services/LoginRegister";

const RegisterModal = (props) => {
  const defaultUserData = {
    username: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    rePassword: "",
  };

  const validInputDefault = {
    username: true,
    gender: true,
    email: true,
    phone: true,
    password: true,
    rePassword: true,
  };

  const [userData, setUserData] = useState(defaultUserData);
  const [validInput, setValidInput] = useState(validInputDefault);

  const checkValidInput = () => {
    setValidInput(validInputDefault);

    let arr = [
      "username",
      "gender",
      "email",
      "phone",
      "password",
      "rePassword",
    ];

    let check = true;
    for (let i = 0; i < arr.length; i++) {
      if (!userData[arr[i]]) {
        toast.error(`You must fill your ${arr[i]} `);
        let _validInput = _.cloneDeep(validInputDefault);
        _validInput[arr[i]] = false;
        setValidInput(_validInput);
        check = false;
        break;
      }
    }

    if (userData.password !== userData.rePassword) {
      check = false;
      toast.error("Your passwords are not match!!!");
    }

    return check;
  };

  // hàm này dùng để thay đổi value của các input nhập vào
  const handleOnChangeInput = (value, name) => {
    let _userData = _.cloneDeep(userData);
    _userData[name] = value;
    setUserData(_userData);
  };

  //hàm này dùng để khi tắt modal thì sẽ reset lại toàn bộ input nhập vào trước đó.
  const resetUserData = () => {
    setUserData(defaultUserData);
    setValidInput(validInputDefault);
  };

  const handleRegisterUser = async () => {
    if (checkValidInput()) {
      let response = await registerUser(
        userData.username,
        userData.email,
        userData.phone,
        userData.gender,
        userData.password
      );
      if (response && response.data && +response.data.EC === 0) {
        toast.success("Register success!!!");
        props.handleOpenLogin();
      } else {
        toast.error(`${response.data.EM}`);
      }
    }
  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose} size="xl">
        <Modal.Body>
          <div className="row">
            <div className="left-container2 md-d-none col-lg-6"></div>
            <div className="right-container col-md-12 col-lg-6">
              <Stack className="col-md-10 mx-auto">
                {/* HEADER */}
                <div className="d-flex flex-row-reverse">
                  <Button
                    variant="light"
                    className="no-hover"
                    onClick={() => {
                      resetUserData();
                      props.handleClose();
                    }}
                  >
                    <FontAwesomeIcon icon={faX} size="lg" />
                  </Button>
                </div>
                <h1 className="mx-auto mb-3">Sign up</h1>
                {/* Input form */}
                <Form className="input-form">
                  <div className="row my-1">
                    <div className="col-xs-12 col-sm-6">
                      <FormLabel>Username</FormLabel>
                      <InputGroup size="md">
                        <InputGroup.Text className="white-background no-border">
                          <FontAwesomeIcon icon={faUser} />
                        </InputGroup.Text>
                        <FormControl
                          className={
                            validInput.username
                              ? "no-border"
                              : "no-border is-invalid"
                          }
                          placeholder="Type your username"
                          value={userData.username}
                          onChange={(event) =>
                            handleOnChangeInput(event.target.value, "username")
                          }
                        ></FormControl>
                      </InputGroup>
                      <hr className="horizontal-line"></hr>
                    </div>
                    <div className="col-xs-12 col-sm-6 mb-1">
                      <FormLabel>Gender</FormLabel>
                      <Form.Select
                        className={validInput.gender ? "" : "is-invalid"}
                        aria-label="Default select example"
                        size="md"
                        name="gender" // Đặt thuộc tính name để xác định key trong userData
                        value={userData.gender} // Liên kết với giá trị trong state userData
                        onChange={(event) =>
                          handleOnChangeInput(event.target.value, "gender")
                        } // Hàm cập nhật state
                      >
                        <option value="">Choose your gender</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </Form.Select>
                    </div>
                  </div>

                  <FormLabel>Email</FormLabel>
                  <InputGroup size="md">
                    <InputGroup.Text className="white-background no-border">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </InputGroup.Text>
                    <FormControl
                      className={
                        validInput.email ? "no-border" : "no-border is-invalid"
                      }
                      placeholder="Type your email"
                      type="email"
                      value={userData.email}
                      onChange={(event) => {
                        handleOnChangeInput(event.target.value, "email");
                      }}
                    ></FormControl>
                  </InputGroup>
                  <hr className="horizontal-line"></hr>

                  <FormLabel>Phone number</FormLabel>
                  <InputGroup size="md">
                    <InputGroup.Text className="white-background no-border">
                      <FontAwesomeIcon icon={faPhone} />
                    </InputGroup.Text>
                    <FormControl
                      className={
                        validInput.phone ? "no-border" : "no-border is-invalid"
                      }
                      placeholder="Type your phone number"
                      value={userData.phone}
                      onChange={(event) => {
                        handleOnChangeInput(event.target.value, "phone");
                      }}
                    ></FormControl>
                  </InputGroup>

                  <hr className="horizontal-line"></hr>
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="md">
                    <InputGroup.Text className="white-background no-border">
                      <FontAwesomeIcon icon={faLock} />
                    </InputGroup.Text>
                    <FormControl
                      type="password"
                      className={
                        validInput.password
                          ? "no-border"
                          : "no-border is-invalid"
                      }
                      placeholder="Type your password"
                      value={userData.password}
                      onChange={(event) => {
                        handleOnChangeInput(event.target.value, "password");
                      }}
                    ></FormControl>
                  </InputGroup>
                  <hr className="horizontal-line"></hr>
                  <FormLabel>Confirm password</FormLabel>
                  <InputGroup size="md">
                    <InputGroup.Text className="white-background no-border">
                      <FontAwesomeIcon icon={faKey} />
                    </InputGroup.Text>
                    <FormControl
                      type="password"
                      className={
                        validInput.rePassword
                          ? "no-border"
                          : "no-border is-invalid"
                      }
                      placeholder="Confirm your password"
                      value={userData.rePassword}
                      onChange={(event) => {
                        handleOnChangeInput(event.target.value, "rePassword");
                      }}
                    ></FormControl>
                  </InputGroup>
                  <hr className="horizontal-line"></hr>
                  <div className="pb-3">
                    <div className="have-account-container">
                      <a href="#" onClick={() => props.handleOpenLogin}>
                        Already have Account?
                      </a>
                    </div>
                  </div>
                  <div className="login-btn-container row">
                    <div className="col-md-1"></div>
                    <Button
                      className=" rounded-pill register-button col-md-10 mx-auto"
                      onClick={() => handleRegisterUser()}
                    >
                      Sign Up
                    </Button>
                    <div className="col-md-1"></div>
                  </div>
                </Form>
                {/* Other way to sign up */}
                <div className="other-signup-container pt-3 d-flex align-items-center flex-column">
                  <p>Or Sign Up Using</p>
                  <div className="">
                    <img
                      src={facebookIcon}
                      alt="sign up with facebook"
                      className="img-fluid icon mx-2"
                    ></img>
                    <img
                      src={googleIcon}
                      alt="sign up with facebook"
                      className="img-fluid icon mx-2"
                    ></img>
                  </div>
                </div>
              </Stack>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RegisterModal;
