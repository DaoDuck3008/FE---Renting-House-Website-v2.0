import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
import {
  fetchPostWithUserId,
  deleteHouseAPI,
} from "../../services/PostService";
import EditPost from "../Posts/EditPost";
import { updatePost } from "../../services/PostService";
import ReactPaginate from "react-paginate";

const PostListByUserId = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);

  const [showEditPost, setShowEditPost] = useState(false);

  //Các biến phục vụ phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const currentLimit = 4; // số lượng bài đăng trong 1 trang

  const callFetchPostsByUserId = async () => {
    // console.log(">>> check userId: ", userId);
    const query = new URLSearchParams();
    query.append("page", currentPage);
    query.append("limit", currentLimit);
    query.append("userid", userId);

    let response = await fetchPostWithUserId(query.toString());
    if (response && response.data && +response.data.EC === 0) {
      setTotalPages(response.data.DT.totalPages);
      setPosts(response.data.DT.posts);
      // console.log(">>> check response: ", response.data.DT);
    }
  };

  useEffect(() => {
    callFetchPostsByUserId();
  }, [currentPage]);

  // Mở modal chỉnh sửa
  const handleEdit = (house) => {
    setSelectedHouse(house);
    setShowEditPost(true);
  };

  // Khi bấm "Xóa"
  const handleDelete = async (houseId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này không?"))
      return;
    try {
      let res = await deleteHouseAPI(houseId);
      if (res && res.data && res.data.success) {
        toast.success("Xóa bài đăng thành công!");
        callFetchPostsByUserId();
      } else {
        toast.error("Xóa thất bại!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi xóa bài đăng!");
    }
  };

  const handleUpdateSuccess = async (houseEdit) => {
    setShowEditPost(false);
    let response = await updatePost(houseEdit);
    if (response && response.data && +response.data.EC === 0) {
      toast.success("Thay đổi bài viết thành công!");
      await callFetchPostsByUserId();
    } else {
      toast.error(`${response.data.EM}`);
    }

    // console.log(">>> check house after edit: ", houseEdit);
    // callFetchPostsByUserId();
  };

  // ----------------------------PAGINATION----------------------------------

  const handlePageChange = async (event) => {
    setCurrentPage(+event.selected + 1);
    await callFetchPostsByUserId();
  };

  return (
    <>
      {posts?.length > 0 ? (
        <>
          <div className="container d-flex flex-column">
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
                              onClick={() => handleEdit(post)}
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
                              onClick={() => handleDelete(post.house_id)}
                            >
                              <FontAwesomeIcon
                                color="dark"
                                icon={faTrash}
                                size="sm"
                              />{" "}
                              Xóa bài
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
          <div className="d-flex justify-content-center ">
            <p>Không có dữ liệu</p>
          </div>
        </>
      )}

      {/* Modal chỉnh sửa */}
      {showEditPost && selectedHouse && (
        <EditPost
          house={selectedHouse}
          isOpen={showEditPost}
          onClose={() => setShowEditPost(false)}
          handleEditData={handleUpdateSuccess}
        />
      )}
    </>
  );
};

export default PostListByUserId;
