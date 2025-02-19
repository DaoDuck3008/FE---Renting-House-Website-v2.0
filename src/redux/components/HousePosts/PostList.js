import React, { useEffect, useState } from "react";
import { fetchAllPosts } from "../../services/PostService";
import _ from "lodash";
import { Card, Row, Col, ToggleButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faDollarSign,
  faStar,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import "./PostList.scss";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import HouseDetailModal from "../Modal/HouseDetailModal";

const PostList = (props) => {
  const [posts, setPosts] = useState([]);
  const [selectedHouseId, setSelectedHouseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Kiểm soát modal

  const location = useLocation();

  useEffect(() => {
    callFetchAllPosts();
  }, [location.search]);

  const callFetchAllPosts = async () => {
    const searchParams = new URLSearchParams(location.search).toString(); // Lấy query từ URL
    console.log(">>> check searchParams", searchParams);
    let response = await fetchAllPosts(searchParams);
    if (response && response.data && +response.data.EC === 0) {
      const _posts = _.cloneDeep(response.data.DT);
      setPosts(_posts);
    }
    console.log(">>> check posts: ", posts);
  };

  const handleClickOnPost = (house_id) => {
    setSelectedHouseId(house_id);
    setIsModalOpen(true); // Hiển thị modal
  };

  return (
    <>
      {posts.map((post) => {
        return (
          <Card
            className={
              props.isOpenMap ? "small-card mb-2 " : "medium-card mb-2 "
            }
            onClick={() => handleClickOnPost(post.house_id)}
            style={{ cursor: "pointer" }}
          >
            <Row>
              <Col md={4} className="left-side2">
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
              <Col md={8} className="right-side2">
                <Card.Body>
                  <h4 className="title-font">{post.house_name}</h4>
                  <p className="highlight-font">
                    {<FontAwesomeIcon icon={faDollarSign} />} Giá: {post.cost}đ
                    - Diện tích: {post.area}m2
                  </p>
                  <p className="smaller-font lighter-font text-truncate">
                    {<FontAwesomeIcon icon={faLocationDot} />} {post.address}
                  </p>
                  <p className="smaller-font lighter-font text-truncate">
                    {post.description}
                  </p>
                  <div className="d-flex">
                    <div className="">
                      <FontAwesomeIcon
                        icon={faStar}
                        size="sm"
                        color="rgb(255, 212, 59)"
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        size="sm"
                        color="rgb(255, 212, 59)"
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        size="sm"
                        color="rgb(255, 212, 59)"
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        size="sm"
                        color="rgb(255, 212, 59)"
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        size="sm"
                        color="rgb(255, 212, 59)"
                      />
                    </div>
                    <div className="mx-auto"></div>
                    <div>
                      <ToggleButton
                        checked="true"
                        variant="light"
                        style={{ border: "1px solid gray", cursor: "pointer" }}
                      >
                        <FontAwesomeIcon
                          color="gray"
                          icon={faHeart}
                          size="sm"
                        />
                      </ToggleButton>
                    </div>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        );
      })}

      <HouseDetailModal
        houseId={selectedHouseId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Ẩn modal khi đóng
      />
    </>
  );
};

export default PostList;
