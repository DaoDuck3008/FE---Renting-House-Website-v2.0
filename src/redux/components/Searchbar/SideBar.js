import { useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Sidebar = (props) => {
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");

  const location = useHistory();

  const handleSearch = () => {
    const searchText = "";
    const city = "";
    const district = "";
    const time = "";
    const rating = "";

    const query = { searchText, city, district, price, area, time, rating };
    const queryParams = new URLSearchParams(query).toString();
    location.push(`/search?${queryParams}`);
  };

  useEffect(() => {
    handleSearch();
  }, [price, area]);

  return (
    <>
      <div className="side-container container">
        <Card className="mx-2 mb-2">
          <div className="mt-2">
            <h6
              className="mx-2"
              style={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Lọc theo khoảng giá
            </h6>
          </div>
          <ListGroup variant="flush">
            <ListGroup.Item
              action
              onClick={() => {
                setPrice("Dưới 1 triệu");
              }}
            >
              Dưới 1 triệu
            </ListGroup.Item>
            <ListGroup.Item
              action
              onClick={() => {
                setPrice("1 - 2 triệu");
              }}
            >
              1 - 2 triệu
            </ListGroup.Item>
            <ListGroup.Item
              action
              onClick={() => {
                setPrice("2 - 3 triệu");
              }}
            >
              2 - 3 triệu
            </ListGroup.Item>
            <ListGroup.Item
              action
              onClick={() => {
                setPrice("3 - 5 triệu");
              }}
            >
              3 - 5 triệu
            </ListGroup.Item>
            <ListGroup.Item
              action
              onClick={() => {
                setPrice("Trên 5 triệu");
              }}
            >
              Trên 5 triệu
            </ListGroup.Item>
          </ListGroup>
        </Card>

        <Card className="mx-2 my-1">
          <div className="mt-2">
            <h6
              className="mx-2"
              style={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Lọc theo diện tích
            </h6>
          </div>
          <ListGroup variant="flush">
            <ListGroup.Item action onClick={() => setArea("Dưới 20m2")}>
              Dưới 20m2
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => setArea("20 - 30m2")}>
              20 - 30m2
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => setArea("30 - 40m2")}>
              30 - 40m2
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => setArea("Trên 40 m2")}>
              Trên 40 m2
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </div>
    </>
  );
};

export default Sidebar;
