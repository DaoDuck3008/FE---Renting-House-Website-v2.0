import React, { useState } from "react";
import "./Navbar.scss";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import LoginModal from "../Modal/LoginModal";
import RegisterModal from "../Modal/RegisterModal";
import UploadPost from "../HousePosts/UploadPost";
import { useEffect } from "react";
import { deleteUserInfo, fetchUserInfo } from "../../services/UserService";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Navbar = () => {
  const [isShowLoginModal, setIsShowLoginModal] = useState(false);
  const [isShowRegisterModal, setIsShowRegisterModal] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [isShowUploadModal, setIsShowUploadModal] = useState(false);

  const history = useHistory();

  useEffect(() => {
    checkUserInfo();
  }, []);

  const handleLogin = (booleen) => {
    setLogin(booleen);
  };

  const checkUserInfo = async () => {
    const response = await fetchUserInfo();
    console.log(">>> response: ", response);
    if (response && response.data && +response.data.EC === 0) {
      setLogin(true);
    } else {
    }
  };

  const handleCloseLoginModal = () => {
    setIsShowLoginModal(false);
  };

  const handleCloseRegisterModal = () => {
    setIsShowRegisterModal(false);
  };

  const handleOpenLoginModal = () => {
    setIsShowRegisterModal(false);
    setIsShowLoginModal(true);
  };

  const handleOpenRegisterModal = () => {
    setIsShowLoginModal(false);
    setIsShowRegisterModal(true);
  };

  const handleCloseUploadModal = () => {
    setIsShowUploadModal(false);
  };

  const handleOpenUserInfo = () => {
    history.push("/user-info");
  };

  const handleLogout = async () => {
    let response = await deleteUserInfo();

    if (response && response.data && +response.data.EC === 0) {
      setLogin(false);
      setIsShowLoginModal(true);
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
            Renting House
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
                    onClick={() => setIsShowUploadModal(true)}
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
                  <button
                    className="btn btn-outline-light me-2"
                    onClick={() => handleOpenUserInfo()}
                  >
                    Profile
                  </button>
                  <button
                    className="btn btn-light me-2"
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </button>
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
        handleClose={handleCloseLoginModal}
        handleOpenRegister={handleOpenRegisterModal}
        checkLogin={handleLogin}
      />
      <RegisterModal
        title="Register"
        show={isShowRegisterModal}
        handleClose={handleCloseRegisterModal}
        handleOpenLogin={handleOpenLoginModal}
      />
      <UploadPost
        title="Upload"
        show={isShowUploadModal}
        handleClose={handleCloseUploadModal}
      />
    </>
  );
};

export default Navbar;
