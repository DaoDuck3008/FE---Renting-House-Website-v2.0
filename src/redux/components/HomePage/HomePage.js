import "./HomePage.scss";
import SearchBar from "../Searchbar/Searchbar";
import { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import PostList from "../PostList/PostList";
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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1150px)");

    // Xử lý khi thay đổi kích thước màn hình
    const handleResize = (e) => {
      if (!e.matches) {
        setDisplayMap(false);
      }
    };

    //Lắng nghe thay đổi kích thước
    mediaQuery.addEventListener("change", handleResize);

    //Dọp dẹp khi component bị hủy
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

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
            <Button
              className="d-lg-block d-none"
              onClick={() => handleToggleMap()}
            >
              Map
            </Button>
            <hr />
            <Container>
              <Row>
                <div
                  className={
                    displayMap ? "col-12 row" : "col-lg-8 col-md-12  row"
                  }
                >
                  <div className="col-lg-12 col-md-12">
                    <PostList />
                  </div>
                </div>
                <div
                  className={
                    displayMap ? "col-4  d-none" : "col-lg-4 d-lg-block d-none "
                  }
                >
                  <Sidebar />
                </div>
              </Row>
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
