import { Stack, Form, InputGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./LoginModal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faX } from "@fortawesome/free-solid-svg-icons";
import facebookIcon from "../../../public/image/facebook.png";
import googleIcon from "../../../public/image/google.png";
import { useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { loginUser } from "../../services/LoginRegister";
import Cookies from "js-cookie";

const LoginModal = (props) => {
  const validInputDefault = {
    emailPhone: true,
    password: true,
  };

  const userInputDefault = {
    emailPhone: "",
    password: "",
  };

  const [validInput, setValidInput] = useState(validInputDefault);
  const [userData, setUserInput] = useState(userInputDefault);

  // hàm này dùng để thay đổi value của các input nhập vào
  const handleOnChangeInput = (value, name) => {
    let _userData = _.cloneDeep(userData);
    _userData[name] = value;
    setUserInput(_userData);
  };

  //hàm này dùng để khi tắt modal thì sẽ reset lại toàn bộ input nhập vào trước đó.
  const resetUserData = () => {
    setUserInput(userInputDefault);
    setValidInput(validInputDefault);
  };

  const checkValidInput = () => {
    setValidInput(validInputDefault);

    let check = true;
    let arr = ["emailPhone", "password"];

    for (let i = 0; i < arr.length; i++) {
      if (!userData[arr[i]]) {
        toast.error(`You must fill your ${arr[i]}`);
        let _validInput = _.cloneDeep(validInputDefault);
        _validInput[arr[i]] = false;
        setValidInput(_validInput);
        check = false;
        break;
      }
    }

    return check;
  };

  const handleLoginUser = async () => {
    if (checkValidInput()) {
      // console.log(">>> userData: ", userData);
      let response = await loginUser(userData.emailPhone, userData.password);
      if (response && response.data && +response.data.EC === 0) {
        Cookies.set("isLogin", "true", {
          expires: 7,
          path: "/",
        });
        props.checkLogin(true);

        props.handleClose();
        window.location.reload();
      } else {
        toast.error(`${response.data.EM}`);
      }
    }
  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose} size="lg">
        <Modal.Body>
          <div className="row">
            <div className="left-container md-d-none col-lg-5"></div>
            <div className="right-container col-md-12 col-lg-7">
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
                    <FontAwesomeIcon icon={faX} />
                  </Button>
                </div>
                <h1 className="mx-auto mb-5">Login</h1>
                {/* Input form */}
                <Form className="input-form">
                  <Form.Label>Username</Form.Label>
                  <InputGroup className=" ">
                    <InputGroup.Text className="no-border white-background">
                      <FontAwesomeIcon icon={faUser} />
                    </InputGroup.Text>
                    <Form.Control
                      className={
                        validInput.emailPhone
                          ? "no-border"
                          : "no-border is-invalid"
                      }
                      placeholder="Type email or phone number"
                      value={userData.emailPhone}
                      aria-label="Email or phone number"
                      onChange={(event) =>
                        handleOnChangeInput(event.target.value, "emailPhone")
                      }
                    />
                  </InputGroup>
                  <hr className="horizontal-line"></hr>
                  <Form.Label>Password</Form.Label>
                  <InputGroup className=" ">
                    <InputGroup.Text className="no-border white-background">
                      <FontAwesomeIcon icon={faLock} />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      className={
                        validInput.password
                          ? "no-border"
                          : "no-border is-invalid"
                      }
                      placeholder="Type your password"
                      value={userData.password}
                      aria-label="Password"
                      onChange={(event) =>
                        handleOnChangeInput(event.target.value, "password")
                      }
                    />
                  </InputGroup>
                  <hr className="horizontal-line"></hr>
                  <div>
                    <div className="forgot-password-container">
                      <p>forgot password?</p>
                    </div>
                  </div>
                  <div className="login-btn-container row">
                    <div className="col-md-1"></div>
                    <Button
                      className=" rounded-pill custom-button col-md-10 mx-auto"
                      onClick={() => handleLoginUser()}
                    >
                      Login
                    </Button>
                    <div className="col-md-1"></div>
                  </div>
                  {/* another way to sign up */}
                  <div className="sign-up-container pt-3 d-flex align-items-center flex-column">
                    <p>Or Sign Up Using</p>
                    <div className="pb-5">
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

                    <p>Or Sign Up Using</p>
                    <Button
                      onClick={props.handleOpenRegister}
                      style={{
                        background: "none",
                        border: "none",
                        color: "black",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      Đăng ký
                    </Button>
                  </div>
                </Form>
              </Stack>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginModal;
