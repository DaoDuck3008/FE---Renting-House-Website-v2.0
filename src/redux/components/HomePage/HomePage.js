import "./HomePage.scss";
import SearchBar from "../Searchbar/Searchbar";
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import PostList from "../HousePosts/PostList";
import Sidebar from "../Searchbar/SideBar";

const HomePage = (props) => {
  const [displayMap, setDisplayMap] = useState(false);

  const handleToggleMap = () => {
    if (displayMap) {
      setDisplayMap(false);
    } else {
      setDisplayMap(true);
    }
  };

  return (
    <>
      <span className="home-container">
        <div className="row">
          <div
            className={
              displayMap ? "col-5 border left-side " : "border left-side"
            }
          >
            <SearchBar />
            <Button onClick={() => handleToggleMap()}>Map</Button>
            <hr />
            <Container>
              <div className="row ">
                <div
                  className={
                    displayMap ? "col-12 row" : "col-lg-8 col-md-12  row"
                  }
                >
                  <div className="col-lg-1 "></div>
                  <div className="col-lg-11 col-md-12">
                    <PostList />
                  </div>
                  <div className="col-lg-1"></div>
                </div>
                <div
                  className={
                    displayMap ? "col-4 d-none" : "col-lg-4 md-d-none "
                  }
                >
                  <Sidebar />
                </div>
              </div>
            </Container>
          </div>
          <div className={displayMap ? "col-7 border right-side" : "d-none"}>
            right Side
          </div>
        </div>
      </span>
    </>
  );
};

export default HomePage;
