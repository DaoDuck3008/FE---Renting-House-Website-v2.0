import { Switch, Route } from "react-router-dom";
import HomePage from "../components/HomePage/HomePage";
import UserInfoModal from "../components/UserInfo/UserInfoModal";
import MapboxExample from "../components/MapboxExample/MapboxExample";
import UploadPost from "../components/Posts/UploadPost";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = (props) => {
  return (
    <>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/search" exact>
          <HomePage />
        </Route>
        <Route path="/login">Login</Route>
        <Route path="/register">Register</Route>

        <Route path="/mapbox">
          <MapboxExample />
        </Route>

        {/* Route chỉ có thể truy cập khi đã đăng nhập */}
        <PrivateRoute path="/user-info" component={UserInfoModal} />
        <PrivateRoute path="/upload-post" component={UploadPost} />

        <Route path="*">404 not found!</Route>
      </Switch>
    </>
  );
};

export default AppRoutes;
