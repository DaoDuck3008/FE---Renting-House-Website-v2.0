import Navbar from "./redux/components/Navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import SearchBar from "./redux/components/Searchbar/Searchbar";
import PostList from "./redux/components/HousePosts/PostList";
import "./App.scss";

function App() {
  const [displayMap, setDisplayMap] = useState(false);

  const handleToggleMap = () => {
    if (displayMap) {
      setDisplayMap(false);
    } else {
      setDisplayMap(true);
    }
  };
  return (
    <Router>
      <div className="app-container">
        <div className="app-header">
          <Navbar />
        </div>
        <div className="app-body">
          <div className="home-container">
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
                  <PostList isOpenMap={displayMap} />
                </Container>
              </div>
              <div
                className={displayMap ? "col-7 border right-side" : "d-none"}
              >
                right Side
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
