import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Card, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faDollarSign,
  faStar,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./PostList.scss";
import { fetchPostWithUserId } from "../../services/UserService";

const PostListByUserId = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  const callFetchPostsByUserId = async () => {
    console.log(">>> check userId: ", userId);
    let response = await fetchPostWithUserId(userId);
    if (response && response.data && +response.data.EC === 0) {
      setPosts(response.data.DT);
    }
  };

  useEffect(() => {
    callFetchPostsByUserId();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-12 ">
            {posts.map((post) => {
              return (
                <Card
                  key={post.house_id}
                  className="medium-card mb-2"
                  style={{ maxWidth: "100%" }}
                >
                  <Row>
                    <Col xs={12} md={4} className="left-side2">
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
                    <Col
                      xs={12}
                      md={8}
                      className="right-side2 d-flex flex-column"
                    >
                      <Card.Body>
                        <h4 className="title-font">{post.house_name}</h4>
                        <p className="highlight-font">
                          {<FontAwesomeIcon icon={faDollarSign} />} Giá:{" "}
                          {post.cost}đ - Diện tích: {post.area}m2
                        </p>
                        <p className="smaller-font lighter-font text-truncate">
                          {<FontAwesomeIcon icon={faLocationDot} />}{" "}
                          {post.address}
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
                            <Button
                              className="mx-1"
                              variant="warning"
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                console.log(">>> You have clicked on Edit")
                              }
                            >
                              <FontAwesomeIcon
                                color="dark"
                                icon={faPenToSquare}
                                size="sm"
                              />{" "}
                              Chỉnh sửa
                            </Button>
                            <Button
                              variant="danger"
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                console.log(">>> You have clicked on Delete")
                              }
                            >
                              <FontAwesomeIcon
                                color="dark"
                                icon={faTrash}
                                size="sm"
                              />{" "}
                              Xóa bài đăng
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostListByUserId;
