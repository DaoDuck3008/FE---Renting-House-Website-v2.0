import {
  Button,
  Form,
  Col,
  Row,
  InputGroup,
  ToggleButton,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faSearch,
  faDollar,
  faMinus,
  faPlus,
  faUser,
  faMotorcycle,
  faFireExtinguisher,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import "./UploadPost.scss";
import { useState, useEffect } from "react";
import Dropzone from "../Dropzone/Dropzone";
import _ from "lodash";
import { toast } from "react-toastify";
import { uploadAPost } from "../../services/PostService";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchUserInfo } from "../../services/UserService";
import PostPreview from "./PostPreview";

const UploadPost = (props) => {
  const history = useHistory();

  const [numberBathroom, setNumberBathroom] = useState(1);
  const [numberFloor, setNumberFloor] = useState(1);
  const [numberBedroom, setNumberBedroom] = useState(1);

  const [securityChecked, setSecurityChecked] = useState(false);
  const [PcccChecked, setPcccChecked] = useState(false);
  const [parkingChecked, setParkingChecked] = useState(false);
  const [cameraChecked, setCameraChecked] = useState(false);

  const [filesFromDropzone, setFilesFromDropzone] = useState([]);

  const defaultInput = {
    // section 1
    address: "",
    // section 2
    kind: "",
    cost: 0,
    area: 0,
    // section 3
    utilities: {
      numberBedroom: 0,
      numberFloor: 0,
      numberBathroom: 0,
      security: false,
      pccc: false,
      parking: false,
      camera: false,
    },
    // section 4
    host_name: "",
    phone: "",
    email: "",
    // section 5
    house_name: "",
    description: "",
    // section 6
    images: [],
  };

  const defaultValidInput = {
    address: true,
    kind: true,
    cost: true,
    area: true,
    host_name: true,
    phone: true,
    email: true,
    house_name: true,
    description: true,
    images: true,
  };

  const [postData, setPostData] = useState(defaultInput);
  const [checkValidInput, setCheckValidInput] = useState(defaultValidInput);

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      let response = await fetchUserInfo();
      if (response && response.data && +response.data.EC === 0) {
        const userInfo = response.data.DT.payload;
        //cập nhật host_name, email và phone luôn
        let _postData = _.cloneDeep(postData);
        _postData["host_name"] = userInfo.username;
        _postData["email"] = userInfo.email;
        _postData["phone"] = userInfo.phone;
        setPostData(_postData);
      }
    };

    getUserInfo();
  }, []);

  // Hàm tăng giảm khi bấm nút + - ở section 3
  const increaseNumber = (setter, value) => {
    setter(value + 1);
  };
  const decreaseNumber = (setter, value) => {
    if (value > 0) setter(value - 1);
  };

  // Hàm nhận các nút trong section 3
  const handleToggleBtn = (setter, checked, name) => {
    if (checked) {
      setter(false);
      postData.utilities[name] = false;
    } else {
      setter(true);
      postData.utilities[name] = true;
    }
  };

  // Hàm lấy các URL ảnh từ Dropzone
  const handleFilesFromDropzone = (files) => {
    setFilesFromDropzone(files);
  };

  // hàm này dùng để thay đổi value của các input nhập vào
  const handleOnChangeInput = (value, name) => {
    let _postData = _.cloneDeep(postData);
    _postData[name] = value;
    setPostData(_postData);
  };

  // hàm kiểm tra xem các ô input đã được điền vào trước khi submit chưa.
  const checkValidation = () => {
    setCheckValidInput(defaultValidInput);
    let check = true;
    let arr = [
      "address",
      "kind",
      "cost",
      "area",
      "host_name",
      "phone",
      "phone",
      "email",
      "house_name",
      "description",
    ];

    for (let i = 0; i < arr.length; i++) {
      if (!postData[arr[i]]) {
        toast.error(`You must fill your ${arr[i]}`);
        setCheckValidInput((prev) => ({
          ...prev,
          [arr[i]]: false,
        }));
        check = false;
        break;
      }
    }
    if (!postData.images.length) {
      setCheckValidInput((prev) => ({
        ...prev,
        images: false,
      }));

      check = false;
      toast.error(`You must add at least a picture!`);
    }
    return check;
  };

  // xem các giá trị trả về sau khi điền form
  const handleSubmit = async () => {
    //truyền value từ các input của section 3
    postData.utilities["numberBathroom"] = numberBathroom;
    postData.utilities["numberBedroom"] = numberBedroom;
    postData.utilities["numberFloor"] = numberFloor;

    if (filesFromDropzone?.length) {
      postData.images = filesFromDropzone;
    }

    if (checkValidation()) {
      let response = await uploadAPost(postData);
      if (response && response.data && +response.data.EC === 0) {
        toast.success(`${response.data.EM}`);
        history.push("/search");
      } else {
        toast.error(`${response.data.EM}`);
      }
    }
  };

  const handlePreview = () => {
    postData.utilities["numberBathroom"] = numberBathroom;
    postData.utilities["numberBedroom"] = numberBedroom;
    postData.utilities["numberFloor"] = numberFloor;

    if (filesFromDropzone?.length) {
      postData.images = filesFromDropzone;
    }
    setShowPreview(true);
  };

  return (
    <>
      <div className="upload-container">
        <header className="modal-header py-2">
          <h2 className="modal-title">Tạo tin đăng</h2>
          <Button
            variant="light"
            onClick={() => history.push("/search")}
            className="close-btn mx-2"
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </header>
        <div className="row mt-3 mx-2">
          {/* Modal content */}
          <div className="col-sm-1 col-md-3 "> </div>
          <Form className="col-sm-10 col-md-6">
            {/* Section 1: Basic Information */}
            <section className="modal-section">
              <h5 className="section-title">Thông tin Nhà trọ</h5>
              <Row className="g-3">
                <Form.Group className="form-control">
                  <Form.Label className="section-label">
                    Địa chỉ nhà trọ
                  </Form.Label>
                  <InputGroup className="custom-input">
                    <InputGroup.Text className="no-border">
                      <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <Form.Control
                      value={postData.address}
                      type="text"
                      placeholder="Nhập địa chỉ"
                      className={
                        checkValidInput.address
                          ? "no-border"
                          : "no-border is-invalid"
                      }
                      onChange={(event) =>
                        handleOnChangeInput(event.target.value, "address")
                      }
                    />
                  </InputGroup>
                </Form.Group>
              </Row>
            </section>

            {/* Section 2: Details */}
            <section className="modal-section">
              <h5 className="section-title">Thông tin chi tiết</h5>
              <Form.Group className="form-control">
                <Form.Label className="section-label">Loại nhà trọ</Form.Label>
                <InputGroup className="custom-input">
                  <Form.Select
                    className={
                      checkValidInput.kind
                        ? "no-border"
                        : "no-border is-invalid"
                    }
                    value={postData.kind}
                    onChange={(event) =>
                      handleOnChangeInput(event.target.value, "kind")
                    }
                  >
                    <option value="">Chọn loại nhà trọ của bạn</option>
                    <option value="rentHouse">phòng trọ</option>
                    <option value="ownHouse">Nhà riêng chung chủ</option>
                    <option value="streetHouse">Nhà mặt phố</option>
                    <option value="apartment">Căn hộ chung cư</option>
                  </Form.Select>
                </InputGroup>
                <Row className="g-3 mt-2 mb-2">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="section-label">
                        Giá (VNĐ)
                      </Form.Label>
                      <InputGroup className="custom-input">
                        <InputGroup.Text className="no-border">
                          <FontAwesomeIcon icon={faDollar} />
                        </InputGroup.Text>
                        <Form.Control
                          type="number"
                          value={postData.cost}
                          placeholder="Nhập giá"
                          className={
                            checkValidInput.cost
                              ? "no-border"
                              : "no-border is-invalid"
                          }
                          onChange={(event) =>
                            handleOnChangeInput(event.target.value, "cost")
                          }
                        />
                        <InputGroup.Text className="no-border">
                          VND
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="section-label">
                        Diện tích (m²)
                      </Form.Label>
                      <InputGroup className="custom-input">
                        <Form.Control
                          type="number"
                          value={postData.area}
                          placeholder="Nhập diện tích"
                          className={
                            checkValidInput.area
                              ? "no-border"
                              : "no-border is-invalid"
                          }
                          onChange={(event) =>
                            handleOnChangeInput(event.target.value, "area")
                          }
                        />
                        <InputGroup.Text className="no-border">
                          m²
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </Form.Group>
            </section>

            {/* Section 3: Additional Information */}
            <section className="modal-section">
              <h5 className="section-title">Thông tin khác</h5>
              <Row className="g-3">
                <Form.Group className="form-control">
                  <Row className="mt-2">
                    <Col sm={9}>
                      <Form.Label className="section-label">
                        Số phòng ngủ
                      </Form.Label>
                    </Col>
                    <Col sm={3}>
                      <Button
                        variant="outline-secondary"
                        className="rounded-circle"
                        onClick={() =>
                          decreaseNumber(setNumberBedroom, numberBedroom)
                        }
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </Button>
                      <span className="mx-2">{numberBedroom}</span>
                      <Button
                        variant="outline-secondary"
                        className="rounded-circle"
                        onClick={() =>
                          increaseNumber(setNumberBedroom, numberBedroom)
                        }
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col sm={9}>
                      <Form.Label className="section-label">Số Tầng</Form.Label>
                    </Col>
                    <Col sm={3}>
                      <Button
                        variant="outline-secondary"
                        className="rounded-circle"
                        onClick={() =>
                          decreaseNumber(setNumberFloor, numberFloor)
                        }
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </Button>
                      <span className="mx-2">{numberFloor}</span>
                      <Button
                        variant="outline-secondary"
                        className="rounded-circle"
                        onClick={() =>
                          increaseNumber(setNumberFloor, numberFloor)
                        }
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col sm={9}>
                      <Form.Label className="section-label">
                        Số phòng vệ sinh
                      </Form.Label>
                    </Col>
                    <Col sm={3}>
                      <Button
                        variant="outline-secondary"
                        className="rounded-circle"
                        onClick={() =>
                          decreaseNumber(setNumberBathroom, numberBathroom)
                        }
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </Button>
                      <span className="mx-2">{numberBathroom}</span>
                      <Button
                        variant="outline-secondary"
                        className="rounded-circle"
                        onClick={() =>
                          increaseNumber(setNumberBathroom, numberBathroom)
                        }
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-2 d-flex ">
                    <Form.Label className="section-label">Khác</Form.Label>
                    <div>
                      <ToggleButton
                        type="checkbox"
                        variant="outline-dark mx-1"
                        className="custom-button my-1"
                        checked={securityChecked}
                        value={1}
                        onClick={() =>
                          handleToggleBtn(
                            setSecurityChecked,
                            securityChecked,
                            "security"
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faUser} /> Bảo vệ
                      </ToggleButton>
                      <ToggleButton
                        type="checkbox"
                        variant="outline-dark mx-1"
                        className="custom-button my-1"
                        checked={PcccChecked}
                        value={1}
                        onClick={() =>
                          handleToggleBtn(setPcccChecked, PcccChecked, "pccc")
                        }
                      >
                        <FontAwesomeIcon icon={faFireExtinguisher} /> PCCC
                      </ToggleButton>
                      <ToggleButton
                        type="checkbox"
                        variant="outline-dark mx-1"
                        className="custom-button my-1"
                        checked={parkingChecked}
                        value={1}
                        onClick={() =>
                          handleToggleBtn(
                            setParkingChecked,
                            parkingChecked,
                            "parking"
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faMotorcycle} /> Chỗ để xe
                      </ToggleButton>
                      <ToggleButton
                        type="checkbox"
                        variant="outline-dark mx-1"
                        className="custom-button my-1"
                        checked={cameraChecked}
                        value={1}
                        onClick={() =>
                          handleToggleBtn(
                            setCameraChecked,
                            cameraChecked,
                            "camera"
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faVideo} /> Camera
                      </ToggleButton>
                    </div>
                  </Row>
                </Form.Group>
              </Row>
            </section>

            {/* Section 4: Contact profile */}
            <section className="modal-section">
              <h5 className="section-title ">Thông tin liên hệ</h5>
              <Row>
                <Form.Group className="form-control">
                  <Form.Label className="section-label mt-2">
                    Tên liên hệ
                  </Form.Label>
                  <Form.Control
                    readOnly={true}
                    disabled={true}
                    placeholder="Điền tên của bạn"
                    className={
                      checkValidInput.host_name
                        ? "custom-button mb-2"
                        : "custom-button mb-2 is-invalid"
                    }
                    value={postData.host_name}
                    onChange={(event) =>
                      handleOnChangeInput(event.target.value, "host_name")
                    }
                  />
                  <Form.Label className="section-label mt-2">
                    Số điện thoại
                  </Form.Label>
                  <Form.Control
                    readOnly={true}
                    disabled={true}
                    placeholder="Điền số điện thoại của bạn"
                    className={
                      checkValidInput.phone
                        ? "custom-button mb-2"
                        : "custom-button mb-2 is-invalid"
                    }
                    value={postData.phone}
                    onChange={(event) =>
                      handleOnChangeInput(event.target.value, "phone")
                    }
                  />
                  <Form.Label className="section-label mt-2">
                    Địa chỉ email
                  </Form.Label>
                  <Form.Control
                    readOnly={true}
                    disabled={true}
                    placeholder="Điền email của bạn"
                    className={
                      checkValidInput.email
                        ? "custom-button mb-2"
                        : "custom-button mb-2 is-invalid"
                    }
                    value={postData.email}
                    type="email"
                    onChange={(event) =>
                      handleOnChangeInput(event.target.value, "email")
                    }
                  />
                </Form.Group>
              </Row>
            </section>

            {/* Section 5: set post's name and post's description */}
            <section className="modal-section">
              <h5 className="section-title">Tiêu đề & mô tả</h5>
              <Form.Group className="form-control">
                <Form.Label className="section-label">Tiêu đề</Form.Label>
                <Form.Control
                  type="text"
                  value={postData.house_name}
                  className={
                    checkValidInput.house_name ? "mb-2" : "mb-2 is-invalid"
                  }
                  placeholder="VD: Cho thuê nhà ở sinh viên 30m2 gần Đại học Ngoại Ngữ, Cầu Giấy."
                  style={{ maxWidth: "800px", margin: "0 auto" }}
                  onChange={(event) =>
                    handleOnChangeInput(event.target.value, "house_name")
                  }
                />
                <Form.Text muted>Tối thiểu 30 ký tự, tối đa 99 ký tự</Form.Text>
                <div className="mb-2"></div>
                <Form.Label className="section-label">Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  value={postData.description}
                  rows={5}
                  className={checkValidInput.description ? "" : "is-invalid"}
                  placeholder="Mô tả chi tiết về: tiện ích, nội thất, vị trí, ... (VD: gần trường đại học nào?)"
                  style={{ maxWidth: "800px", margin: "0 auto" }}
                  onChange={(event) =>
                    handleOnChangeInput(event.target.value, "description")
                  }
                />
                <Form.Text muted>
                  Tối thiểu 30 ký tự, tối đa 3000 ký tự
                </Form.Text>
              </Form.Group>
            </section>

            {/* Section 6: import images */}
            <section className="modal-section">
              <h5 className="section-title">Thêm ảnh lên</h5>
              <Form.Group
                className={
                  checkValidInput.images
                    ? "form-control p-3"
                    : "form-control p-3 is-invalid"
                }
              >
                <div>
                  <Dropzone onFilesUploaded={handleFilesFromDropzone} />
                </div>
              </Form.Group>
            </section>
          </Form>
          <div className="col-sm-1 col-md-3"> </div>
        </div>

        <footer className="modal-footer py-2">
          <div className="d-flex justify-content-end gap-2 px-3">
            <Button variant="outline-dark" onClick={() => handlePreview()}>
              Xem trước
            </Button>
            <Button variant="dark" onClick={() => handleSubmit()}>
              Đăng bài
            </Button>
          </div>
        </footer>
      </div>

      <PostPreview
        house={postData}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
};

export default UploadPost;
