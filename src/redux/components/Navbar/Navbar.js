import React, { useState } from "react";
import "./Navbar.scss";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import LoginModal from "../Modal/LoginModal";
import RegisterModal from "../Modal/RegisterModal";
import UploadPost from "../HousePosts/UploadPost";
import { useEffect } from "react";

const Navbar = () => {
  const [isShowLoginModal, setIsShowLoginModal] = useState(false);
  const [isShowRegisterModal, setIsShowRegisterModal] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [isShowUploadModal, setIsShowUploadModal] = useState(false);

  useEffect(() => {
    let local = localStorage.getItem("account");
    console.log(">>> check account: ", local);
    if (local) {
      setLogin(true);
    }
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("account");
    setLogin(false);
    setIsShowLoginModal(true);
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
