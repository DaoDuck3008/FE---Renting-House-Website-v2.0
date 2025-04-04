import React, { useEffect, useState } from "react";
import { fetchAllPosts } from "../../services/PostService";
import { Card, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faDollarSign,
  faStar,
  faStarHalfAlt,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import "./PostList.scss";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import HouseDetailModal from "./HouseDetailModal";
import ReactPaginate from "react-paginate";

const PostList = (props) => {
  const [posts, setPosts] = useState([]);
  const [selectedHouseId, setSelectedHouseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Kiểm soát modal

  const location = useLocation();
  const history = useHistory();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const currentLimit = 4;

  const handleFlyToHouse = (houseId) => {
    setSelectedHouseId(houseId);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("house-id", houseId); // Thêm hoặc cập nhật house_id vào URL

    history.push(`/search?${searchParams.toString()}`);
  };

  const callFetchAllPosts = async () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", currentPage);
    searchParams.set("limit", currentLimit);

    const newSearch = searchParams.toString();
    if (location.search !== `?${newSearch}`) {
      history.push(`/search?${newSearch}`);
    }

    let response = await fetchAllPosts(searchParams.toString());
    if (response && response.data && +response.data.EC === 0) {
      setTotalPages(response.data.DT.totalPages);
      setPosts(response.data.DT.posts);
      setTotalRows(response.data.DT.totalRows);
    }
  };

  useEffect(() => {
    callFetchAllPosts();
  }, [location.search, currentPage]);

  const handleClickOnPost = (house_id) => {
    setSelectedHouseId(house_id);
    setIsModalOpen(true); // Hiển thị modal
  };

  const handleClosePost = () => {
    setIsModalOpen(false);
    callFetchAllPosts();
  };

  // Hàm biến đổi rating từ số thành biểu tượng ngôi sao
  const ratingStars = (ratingNum) => {
    if (!ratingNum) {
      return (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <FontAwesomeIcon key={index} icon={faStar} />
          ))}
        </>
      );
    }
    const ratingINT = Math.floor(ratingNum); // Phần nguyên của rating
    const halfRating = ratingNum % 1; // Phần thập phân của rating
    let fullStars = ratingINT;
    let halfStar = false;

    // Xử lý phần thập phân
    if (halfRating > 0.8) {
      fullStars = Math.ceil(ratingNum); // Làm tròn lên
    } else if (halfRating >= 0.3 && halfRating <= 0.7) {
      halfStar = true; // Hiển thị nửa ngôi sao
    }

    // Tạo mảng chứa các ngôi sao đầy
    const fullStarElements = Array.from({ length: fullStars }).map(
      (_, index) => <FontAwesomeIcon key={index} icon={faStar} />
    );

    return (
      <>
        {fullStarElements}
        {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} />}
      </>
    );
  };

  // ----------------------------PAGINATION----------------------------------

  const handlePageChange = async (event) => {
    setCurrentPage(+event.selected + 1);
    await fetchAllPosts();
  };

  //-------------------------------------------------------------------------

  return (
    <>
      <p>Kết quả tìm kiếm: {totalRows} bài viết.</p>
      {posts?.length > 0 ? (
        <>
          <div className="container postList-container d-flex flex-column">
            {posts.map((post, index) => {
              return (
                <Card
                  key={index}
                  className={
                    props.isOpenMap ? "small-card my-1" : "medium-card my-1"
                  }
                  // style={{
                  //   border:
                  //     post.house_id === selectedHouseId
                  //       ? "5px solid rgb(113, 193, 113)"
                  //       : "1px solid #ddd",
                  //   transition: "border 0.3s ease-in-out",
                  // }}
                >
                  <Row className="flex-column flex-md-row">
                    <Col xs={12} md={4} className="left-side2 mb-2 mb-md-0">
                      <img
                        src={post.image}
                        className="img-fluid rounded px-1"
                        alt="House"
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "210px",
                        }}
                      />
                    </Col>
                    <Col xs={12} md={8} className="right-side2">
                      <Card.Body>
                        <div
                          onClick={() => handleClickOnPost(post.house_id)}
                          style={{ cursor: "pointer" }}
                        >
                          <h4 className="title-font">{post.house_name}</h4>
                        </div>
                        <p className="highlight-font">
                          {<FontAwesomeIcon icon={faDollarSign} />} Giá:{" "}
                          {post.cost}đ - Diện tích: {post.area}m²
                        </p>
                        <p className="smaller-font lighter-font text-truncate">
                          {<FontAwesomeIcon icon={faLocationDot} />}{" "}
                          {post.address}
                        </p>
                        <p className="smaller-font lighter-font text-truncate">
                          {post.description}
                        </p>
                        <div className="d-flex">
                          <div style={{ color: "rgb(255, 199, 10)" }}>
                            {ratingStars(post.average_rate)}
                          </div>
                          <div className="mx-auto"></div>
                          <div>
                            <Button
                              checked={true}
                              variant="light"
                              style={{
                                border: "1px solid gray",
                                cursor: "pointer",
                              }}
                              onClick={() => handleFlyToHouse(post.house_id)}
                            >
                              <FontAwesomeIcon
                                color="blue"
                                icon={faLocationArrow}
                                size="lg"
                              />
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              );
            })}

            <div className="mt-2 mx-auto">
              <ReactPaginate
                previousLabel="Previous"
                nextLabel="Next"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName="pagination"
                activeClassName="active"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <p>Không có dữ liệu</p>
        </>
      )}
      <HouseDetailModal
        houseId={selectedHouseId}
        isOpen={isModalOpen}
        onClose={() => handleClosePost()} // Ẩn modal khi đóng
      />
    </>
  );
};

export default PostList;
