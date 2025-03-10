// src/routes/PrivateRoute.js
import React from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLogin = Cookies.get("isLogin");

  // Kiểm tra nếu isLogin là null hoặc undefined
  if (!isLogin) {
    toast.warning("Bạn cần đăng nhập trước!");
    return <Redirect to="/login" />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin ? (
          <Component {...props} />
        ) : (
          <>
            <Redirect to="/login" />
          </>
        )
      }
    />
  );
};

export default PrivateRoute;
