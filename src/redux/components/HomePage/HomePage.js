import "./HomePage.scss";
import SearchBar from "../Searchbar/Searchbar";
import { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import PostList from "../PostList/PostList";
import Sidebar from "../Searchbar/SideBar";
import MapboxExample from "../MapboxExample/MapboxExample";

const HomePage = (props) => {
  const [displayMap, setDisplayMap] = useState(true);

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
        {/* LEFT SIDE */}
        <Row className="g-0">
          <Col className={displayMap ? "col-5  left-side " : " left-side"}>
            <SearchBar />
            <Container>
              <Button
                variant="success"
                className="d-lg-block d-none"
                onClick={() => handleToggleMap()}
              >
                Tìm kiếm với bản đồ
              </Button>
            </Container>

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
          </Col>

          {/* RIGHT SIDE */}
          <Col className={displayMap ? "col-7 " : "d-none"}>
            <MapboxExample />
          </Col>
        </Row>
      </span>
    </>
  );
};

export default HomePage;
