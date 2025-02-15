import "./App.scss";

import Navbar from "./redux/components/Navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import HomePage from "./redux/components/HomePage/HomePage";

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
          <HomePage />
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
