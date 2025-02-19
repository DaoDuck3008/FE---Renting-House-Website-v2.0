import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilterCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./Searchbar.scss";
import { Dropdown, Stack, Button, Form } from "react-bootstrap";
import "../Modal/LoginModal";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchDistricts } from "../../services/PostService";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [time, setTime] = useState("");
  const [rating, setRating] = useState("");
  const [allDistricts, setAllDistricts] = useState([]);

  const location = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetchDistricts(city); // Chờ dữ liệu trả về
        if (response && response.data && response.data.EC === 0) {
          setAllDistricts(response.data.DT);
        }
      } catch (error) {
        console.error("Error fetching districts: ", error);
      }
    };

    fetchData();
  }, [city]);

  const handleSearch = () => {
    const query = { searchText, city, district, price, area, time, rating };
    console.log(">>> check query: ", query);
    const queryParams = new URLSearchParams(query).toString();
    console.log(">>> check query in search bar: ", queryParams);
    location.push(`/search?${queryParams}`);
  };

  const clearfilter = async () => {
    setSearchText("");
    setCity("");
    setDistrict("");
    setPrice("");
    setArea("");
    setTime("");
    setRating("");

    handleSearch();
    location.push("");
  };

  return (
    <>
      <div className="container my-2">
        <Stack direction="horizontal" gap={3}>
          <div className="d-flex pr-1 px-0 py-2 border rounded btn btn-light col-12 search-input-container">
            <Form.Control
              style={{
                border: "none",
              }}
              className="me-auto mx-2 no-focus"
              placeholder="Tìm kiếm theo từ khóa..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              variant="danger"
              className="d-flex align-items-center mx-2"
              onClick={() => handleSearch()}
            >
              <FontAwesomeIcon icon={faSearch} className="me-2" /> Search
            </Button>
          </div>
        </Stack>

        {/* Filter Options */}
        <div
          style={{ overflowY: "visible" }}
          className="d-flex flex-nowarp align-items-stretch mt-2 pb-2  filter-options"
        >
          {/* Thành phố */}
          <div className="mx-1">
            <Button variant="danger" onClick={() => clearfilter()}>
              <FontAwesomeIcon icon={faFilterCircleXmark} />
            </Button>
          </div>
          <div className="mx-1">
            <Dropdown>
              <Dropdown.Toggle variant="btn btn-light" id="dropdown-basic">
                {city ? `${city}` : "thành phố"}
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu">
                <Dropdown.Item onClick={() => setCity("Hà Nội")}>
                  Hà Nội
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setCity("Tp Hồ Chí Minh")}>
                  Tp Hồ Chí Minh
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setCity("Đà Nẵng")}>
                  Đà Nẵng
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setCity("Nha Trang")}>
                  Nha Trang
                </Dropdown.Item>
                <Dropdown.Item>Cần Thơ</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Quận/ huyện */}
          <div className="mx-1">
            <Dropdown disabled>
              <Dropdown.Toggle
                variant="btn btn-light"
                id="dropdown-basic"
                className={city ? "" : "disabled"}
              >
                {district ? `${district}` : "Quận / Huyện"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {allDistricts.length ? (
                  allDistricts.map((district) => (
                    <Dropdown.Item
                      onClick={() => setDistrict(`${district.district_name}`)}
                    >
                      {district.district_name}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item onClick={() => setDistrict(``)}>
                    No data
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Giá */}
          <div className="mx-1">
            <Dropdown>
              <Dropdown.Toggle variant="btn btn-light" id="dropdown-basic">
                {price ? `${price}` : "Giá"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setPrice("Dưới 1 triệu")}>
                  Dưới 1 triệu
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPrice("1 - 3 triệu")}>
                  1 - 3 triệu
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPrice("3 - 5 triệu")}>
                  3 - 5 triệu
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPrice("5 - 8 triệu")}>
                  5 - 8 triệu
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPrice("8 - 10 triệu")}>
                  8 - 10 triệu
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPrice("Trên 10 triệu")}>
                  Trên 10 triệu
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Diện tích */}
          <div className="mx-1">
            <Dropdown>
              <Dropdown.Toggle variant="btn btn-light" id="dropdown-basic">
                {area ? `${area}` : "Diện tích"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setArea("Dưới 30m2")}>
                  Dưới 30m2
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setArea("30 - 50m2")}>
                  30 - 50m2
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setArea("50 - 80m2")}>
                  50 - 80m2
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setArea("80 - 100m2")}>
                  80 - 100m2
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setArea("Trên 100 m2")}>
                  Trên 100 m2
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Sắp xếp */}
          <div className="mx-1">
            <Dropdown>
              <Dropdown.Toggle variant="btn btn-light" id="dropdown-basic">
                {time ? `${time}` : "Thời gian"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setTime("Mới nhất")}>
                  Mới nhất
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setTime("Cũ nhất")}>
                  Cũ nhất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Đánh giá */}
          <div className="mx-1">
            <Dropdown>
              <Dropdown.Toggle variant="btn btn-light" id="dropdown-basic">
                {rating ? `${rating}` : "Đánh giá"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setRating("Cao đến thấp")}>
                  Từ cao đến thấp
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setRating("Thấp đến cao")}>
                  Từ thấp đến cao
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
