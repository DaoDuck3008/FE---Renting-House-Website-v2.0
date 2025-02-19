import { Switch, Route } from "react-router-dom";
import HomePage from "../components/HomePage/HomePage";
import UserInfoModal from "../components/UserInfo/UserInfoModal";

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
        <Route path="/user-info">
          <UserInfoModal />
        </Route>

        <Route path="/login">Login</Route>

        <Route path="/register">Register</Route>

        <Route path="*">404 not found!</Route>
      </Switch>
    </>
  );
};

export default AppRoutes;
