import React, { useState } from "react";
import "./Navbar.scss";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import LoginModal from "../Modal/LoginModal";
import RegisterModal from "../Modal/RegisterModal";
import { useEffect } from "react";
import { deleteUserInfo, fetchUserInfo } from "../../services/UserService";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHouseUser } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isShowLoginModal, setIsShowLoginModal] = useState(false);
  const [isShowRegisterModal, setIsShowRegisterModal] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [username, setUsername] = useState("");

  const history = useHistory();

  useEffect(() => {
    checkUserInfo();
  }, []);

  const handleLogin = (booleen) => {
    setLogin(booleen);
  };

  const checkUserInfo = async () => {
    const response = await fetchUserInfo();
    // console.log(">>> response: ", response);
    if (response && response.data && +response.data.EC === 0) {
      setUsername(response.data.DT.payload.username);
      setLogin(true);
    } else {
    }
  };

  const handleOpenUserInfo = () => {
    history.push("/user-info");
  };

  const handleLogout = async () => {
    history.push("/search");
    let response = await deleteUserInfo();

    if (response && response.data && +response.data.EC === 0) {
      setLogin(false);
      setIsShowLoginModal(true);
      Cookies.remove("isLogin");
    } else {
      toast.error(`${response.data.EM}`);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark ">
        <div className="container">
          {/* Logo */}
          <NavLink className="navbar-brand" to="/">
            <FontAwesomeIcon icon={faHouseUser} size="xl" /> Renting House
          </NavLink>
          {/* Navbar Toggler (dùng cho mobile) */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* Navbar Items */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              {isLogin ? (
                <div className="mb-2">
                  <button
                    className="btn btn-danger me-2 mx-auto"
                    onClick={() => history.push("/upload-post")}
                  >
                    Đăng bài
                  </button>
                </div>
              ) : (
                <></>
              )}
            </ul>
            {/* Login and Register Buttons */}
            <div className="d-flex">
              {isLogin ? (
                <div>
                  <Dropdown data-bs-theme="dark">
                    <Dropdown.Toggle
                      variant="dark"
                      className="btn-outline-light"
                      style={{ borderRadius: "20px" }}
                    >
                      <FontAwesomeIcon icon={faUser} /> {username}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        className="my-2"
                        onClick={() => handleOpenUserInfo()}
                      >
                        Thông tin người dùng
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="my-2"
                        onClick={() => handleLogout()}
                      >
                        Đăng xuất
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ) : (
                <div>
                  <button
                    className="btn btn-outline-light me-2"
                    onClick={() => setIsShowLoginModal(true)}
                  >
                    Login
                  </button>
                  <button
                    className="btn btn-light"
                    onClick={() => setIsShowRegisterModal(true)}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        title="Login"
        show={isShowLoginModal}
        handleClose={() => setIsShowLoginModal(false)}
        handleOpenRegister={() => {
          setIsShowLoginModal(false);
          setIsShowRegisterModal(true);
        }}
        checkLogin={handleLogin}
      />
      <RegisterModal
        title="Register"
        show={isShowRegisterModal}
        handleClose={() => setIsShowRegisterModal(false)}
        handleOpenLogin={() => {
          setIsShowRegisterModal(false);
          setIsShowLoginModal(true);
        }}
      />
    </>
  );
};

export default Navbar;
