import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Searchbar.scss";
import { Dropdown, Stack, Button, Form } from "react-bootstrap";
import "../Modal/LoginModal";

const SearchBar = () => {
  return (
    <>
      <div className="container my-2">
        <Stack direction="horizontal" gap={3}>
          <div className="d-flex pr-1 px-0 py-2 border rounded btn btn-light col-12">
            <Form.Control
              style={{
                border: "none",
              }}
              className="me-auto mx-2"
              placeholder="Tìm kiếm theo từ khóa..."
            />
            <Button variant="danger" className="d-flex align-items-center mx-2">
              <FontAwesomeIcon icon={faSearch} className="me-2" /> Search
            </Button>
          </div>
        </Stack>

        {/* Filter Options */}
        <div className="d-flex flex-nowarp align-items-stretch mt-2  filter-options">
          {/* Thành phố */}
          <div className="me-1">
            <Dropdown>
              <Dropdown.Toggle variant="btn btn-light" id="dropdown-basic">
                Hà Nội
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Tp Hồ Chí Minh</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Đà Nẵng</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Cần Thơ</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {/* Quận/ huyện */}
          <div className="mx-1">
            <Dropdown>
              <Dropdown.Toggle variant="btn btn-light" id="dropdown-basic">
                Quận / Huyện
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Đống Đa</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Hai Bà Trưng</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Tây Hồ</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Giá */}
          <div className="mx-1">
            <Dropdown>
              <Dropdown.Toggle variant="btn btn-light" id="dropdown-basic">
                Giá
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Dưới 1 triệu</Dropdown.Item>
                <Dropdown.Item href="#/action-2">1 - 3 triệu</Dropdown.Item>
                <Dropdown.Item href="#/action-3">3 - 5 triệu</Dropdown.Item>
                <Dropdown.Item href="#/action-3">5 - 8 triệu</Dropdown.Item>
                <Dropdown.Item href="#/action-3">8 - 10 triệu</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Trên 10 triệu</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Diện tích */}
          <div className="mx-1">
            <Dropdown>
              <Dropdown.Toggle variant="btn btn-light" id="dropdown-basic">
                Diện tích
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Dưới 30m2</Dropdown.Item>
                <Dropdown.Item href="#/action-2">30 - 50m2</Dropdown.Item>
                <Dropdown.Item href="#/action-3">50 - 80m2</Dropdown.Item>
                <Dropdown.Item href="#/action-3">80 - 100m2</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Trên 100 m2</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {/* Sắp xếp */}
          <div className="mx-1">
            <Dropdown>
              <Dropdown.Toggle variant="btn btn-light" id="dropdown-basic">
                Thời gian
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Mới nhất</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Cũ nhất</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Đánh giá */}
          <div className="mx-1">
            <Dropdown>
              <Dropdown.Toggle variant="btn btn-light" id="dropdown-basic">
                Đánh giá
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Từ cao đến thấp</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Từ thấp đến cao</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
