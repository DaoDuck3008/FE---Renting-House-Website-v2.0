import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Map, {
  NavigationControl,
  Marker,
  Popup,
  GeolocateControl,
  Source,
  Layer,
} from "react-map-gl";
import {
  fetchRoute,
  getAllHouse,
  getCoordinates,
} from "../../services/MapService";
import houseSVG from "../../../public/image/house-svgrepo-com.svg";
import houseGreenBG from "../../../public/image/house-greenBG.svg";
import HouseDetailModal from "../PostList/HouseDetailModal";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import * as turf from "@turf/turf";
import { toast } from "react-toastify";
import { toInteger } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";

const MapComponent = () => {
  const mapRef = useRef(null); // Lấy reference của Map
  const [coordinates, setCoordinates] = useState([]); //tất cả tọa độ địa chỉ nhà được lưu vào đây
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null); // marker vị trị của bạn

  const [selectedHouseId, setSelectedHouseId] = useState(null); // lấy houseid để mở HouseModalDetail khi bấm vào Popup xem chi tiết
  const [isModalOpen, setIsModalOpen] = useState(false); // mở HouseDetailModal
  const [showGeolocate, setShowGeolocate] = useState(true); // kiểm soát hiển thị của Geolocate

  const [circleData, setCircleData] = useState(null);
  const [radius, setRadius] = useState(100); // bán kính mặc định là 500m
  const [stepRadius, setStepRadius] = useState(100);
  const [showCircle, setShowCircle] = useState(false); //hiển thị bán kính tìm kiếm
  const [filterCoordinates, setFilterCoordinates] = useState([]); // Danh sách nhà trọ nằm trong bán kính đã chọn

  const [route, setRoute] = useState(null); // vẽ đường đi từ định vị tới nhà trọ
  const [routeInfo, setRouteInfo] = useState({}); // thông tin về đường đi

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const getAllCoordinates = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const houses = await getAllHouse(searchParams.toString());
        if (houses && houses.data && houses.data.EC === 0) {
          const uniqueAddresses = [
            ...new Set(houses.data.DT.map((house) => house.address)),
          ];

          const coordinatesData = await Promise.all(
            uniqueAddresses.map(getCoordinates)
          );

          // Tránh lệch index bằng cách kiểm tra null ngay trong map()
          const validCoordinates = coordinatesData
            .map((coord, index) =>
              coord
                ? {
                    ...coord,
                    house_id: houses.data.DT[index].house_id,
                    name: houses.data.DT[index].house_name,
                    address: houses.data.DT[index].address,
                    main_img: houses.data.DT[index].image,
                  }
                : null
            )
            .filter((item) => item !== null); // Lọc phần tử null sau khi đã map()

          setCoordinates(validCoordinates);

          // Lấy houseid được gửi từ PostList lên URL.
          const houseId = searchParams.get("house-id"); // Nếu tồn tại houseId sẽ đưa map đến vị trí của nhà đó trên bản đồ luôn
          if (houseId) {
            const choseCoordinates = coordinates.find(
              (house) => house.house_id === toInteger(houseId)
            );
            mapRef.current.flyTo({
              center: [choseCoordinates.lng, choseCoordinates.lat],
              zoom: 15,
              essential: true,
            });
            if (choseCoordinates) {
              setSelectedHouse(choseCoordinates);
              // Nếu như tồn tại MarkerPosition trên bản đồ thì sẽ hiển thị đường đi từ Marker đó tới nhà
              if (markerPosition) {
                const response = await fetchRoute(
                  [markerPosition.longitude, markerPosition.latitude],
                  [choseCoordinates.lng, choseCoordinates.lat]
                );

                if (response) {
                  setRoute(response.geometry); // lấy đường đi
                  setRouteInfo({
                    distance: (response.distance / 1000).toFixed(2), // mặc định tính quãng đường là dm => chia 100 để đổi thành km rồi làm chòn 2 chữ số
                    duration: Math.ceil(response.duration / 60), // mặc định tính thời gian là giây => chia 60 để ra phút
                  });
                } else {
                  console.log(">>> Something went wrong with API request");
                  toast.error("Something went wrong with API request.");
                }
              }
            } else {
              console.log(
                `>>> Not found any house which matches with house_id: ${houseId} `
              );
              toast.error("Not found any house match!");
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy tọa độ:", error);
        toast.error("Cannot get coordinates.");
      }
    };

    getAllCoordinates();

    //Nếu xóa bộ lọc thì sẽ quay trở lại trạng thái ban đầu
    if (location.search === "?page=1&limit=4") {
      setRoute(null);
      setRouteInfo({});
      backToInitialViewState(); // quay lại viewState ban đầu
      setCircleData(null); // tắt vòng tròn bán kính đi
      setRadius(500); // đặt lại bán kính mặc định
      setFilterCoordinates([]); // xóa các nhà nằm trong bán kính
    }
  }, [location.search]);

  // ------------------------------------------------------------------
  // bay tới địa điệm đã chọn
  const clickOnHouse = async (house) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [house.lng, house.lat],
        zoom: 15,
        speed: 1.5,
        curve: 1.5,
        essential: true,
      });

      setSelectedHouse(house);
      // Nếu như tồn tại MarkerPosition trên bản đồ thì sẽ hiển thị đường đi từ Marker đó tới nhà
      if (markerPosition) {
        const response = await fetchRoute(
          [markerPosition.longitude, markerPosition.latitude],
          [house.lng, house.lat]
        );

        if (response) {
          setRoute(response.geometry); // lấy đường đi
          setRouteInfo({
            distance: (response.distance / 1000).toFixed(2), // mặc định tính quãng đường là mét => chia 100 để đổi thành km rồi làm chòn 2 chữ số
            duration: Math.ceil(response.duration / 60), // mặc định tính thời gian là giây => chia 60 để ra phút
          });
        } else {
          console.log(">>> Something went wrong with API request");
          toast.error("Something went wrong with API request.");
        }
      }
    }

    setSelectedHouse(house);
  };

  // Quay trở lại vị trí đầu tiên
  const backToInitialViewState = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [105.854444, 21.028511],
        zoom: 11,
        speed: 1.5,
        curve: 1.5,
        essential: true,
      });
    }

    setSelectedHouse(null);
  };

  // Cập nhật vị trí khi marker được kéo
  const onMarkerDragStart = () => {
    setShowCircle(false);
    setRoute(null);
    setRouteInfo({});
  };
  const onMarkerDragEnd = (event) => {
    const newPosition = {
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    };
    setMarkerPosition(newPosition);
    setShowCircle(true);
    drawCircle(newPosition, radius);
  };

  const drawCircle = (center, radius) => {
    const points = 64;
    const coords = [];

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * (2 * Math.PI);
      const dx = (radius * Math.cos(angle)) / 111320; // 111320m = 1 độ kinh độ
      const dy = (radius * Math.sin(angle)) / 110540; // 110540m = 1 độ vĩ độ
      coords.push([center.longitude + dx, center.latitude + dy]);
    }

    coords.push(coords[0]); // Đóng vòng tròn

    setCircleData({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coords],
      },
    });
  };

  //hàm tính toán xem địa chỉ nhà đó có nằm trong bán kính hay không
  const isInsideCircle = (point, center, radius) => {
    const from = turf.point([center.longitude, center.latitude]);
    const to = turf.point([point.lng, point.lat]);
    const distance = turf.distance(from, to, { units: "meters" });

    return distance <= radius; //Nếu khoảng cách nhỏ hơn bán kính trả về true
  };

  // Hàm lọc các địa điểm trong bán kính
  const filterLocationsInRadius = (locations, center, radius) => {
    return locations.filter((location) =>
      isInsideCircle(location, center, radius)
    );
  };

  const handleFilteredHouses = async () => {
    const filterHouses = filterLocationsInRadius(
      coordinates,
      markerPosition,
      radius
    );

    if (!filterHouses?.length) {
      toast.warning("Không có nhà trọ nào trong bán kính này!");
    }
    setFilterCoordinates(filterHouses);

    //Chuyền các Nhà đạt điều kiện về BE để xử lý đồng bộ với PostList.
    //Lưu các house_id vào 1 string rồi gửi về backend thông qua query
    const houseIds = filterHouses.map((house) => house.house_id).join(",");
    const queryData = new URLSearchParams(location.search);
    queryData.set("houseids", houseIds);
    queryData.set("page", 1);
    queryData.set("limit", 4);

    const newSearch = queryData.toString();
    if (location !== `/search?${newSearch}`) {
      history.push(`/search?${newSearch}`);
    }
  };

  return (
    <>
      <div style={{ height: "100vh" }}>
        <Map
          ref={mapRef} // Gán ref cho map
          initialViewState={{
            longitude: 105.854444,
            latitude: 21.028511,
            zoom: 11,
          }} // tọa độ của trung tâm thành phố Hà Nội
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          style={{ width: "100%", height: "100%" }}
          maxBounds={[
            [102.14441, 8.17966],
            [109.46999, 23.39261],
          ]}
        >
          {/* Hiển thị TẤT CẢ các nhà trọ lên */}
          {coordinates.length > 0 ? (
            coordinates.map((house, index) => (
              <Marker
                key={index}
                longitude={house.lng}
                latitude={house.lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  clickOnHouse(house);
                }}
              >
                <img src={houseSVG} width={50} height={50} alt="House" />
              </Marker>
            ))
          ) : (
            <p>Loading markers...</p>
          )}

          {/* Hiển thị các nhà nằm trong bán kính  */}
          {filterCoordinates?.length > 0 &&
            filterCoordinates.map((house, index) => (
              <Marker
                key={index}
                longitude={house.lng}
                latitude={house.lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  clickOnHouse(house);
                }}
              >
                <img
                  src={houseGreenBG}
                  width={50}
                  height={50}
                  alt="House"
                  style={{ zIndex: "1000" }}
                />
              </Marker>
            ))}

          {/* Hiển thị popup với tên nhà và hình ảnh chính */}
          {selectedHouse && (
            <Popup
              longitude={selectedHouse.lng}
              latitude={selectedHouse.lat}
              anchor="top"
              onClose={() => setSelectedHouse(null)}
            >
              <div style={{ color: "black" }}>
                <p style={{ fontSize: "15px", fontWeight: "520" }}>
                  {selectedHouse.name}
                </p>
                <div className="d-flex flex-column align-items-center">
                  <img
                    alt="house"
                    className="img-fluid rounded"
                    style={{ maxHeight: "150px", maxWidth: "200px" }}
                    src={selectedHouse.main_img}
                  ></img>
                </div>
                <div className="d-flex flex-row-reverse">
                  <Button
                    className="mt-2"
                    variant="dark"
                    onClick={() => {
                      setSelectedHouseId(selectedHouse.house_id);
                      setIsModalOpen(true);
                    }}
                  >
                    Detail
                  </Button>
                </div>
              </div>
            </Popup>
          )}

          {/* Lấy vị trí của người dùng sau đó ẩn đi */}
          {showGeolocate && (
            <GeolocateControl
              position="top-right"
              onGeolocate={(pos) => {
                const { longitude, latitude } = pos.coords;
                setMarkerPosition({ longitude, latitude });

                //Ẩn GeolocateControl sau khi lấy vị trí
                setShowGeolocate(false);
                setShowCircle(true);
              }}
            />
          )}

          {/* Hiển thị Marker kéo thả nếu đã có vị trí người dùng */}
          {markerPosition && (
            <Marker
              longitude={markerPosition.longitude}
              latitude={markerPosition.latitude}
              draggable={true} // Cho phép kéo thả
              onDragEnd={onMarkerDragEnd}
              onDragStart={onMarkerDragStart}
            />
          )}

          {/* Vòng tròn bán kính */}
          {circleData && (
            <Source id="circle-layer" type="geojson" data={circleData}>
              <Layer
                id="circle-fill"
                type="fill"
                paint={{
                  "fill-color": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10,
                    "#00FF00",
                    14,
                    "#00FFFF",
                    18,
                    "#0000FF",
                  ],
                  "fill-opacity": 0.3,
                }}
              />
              <Layer
                id="circle-border"
                type="line"
                paint={{
                  "line-color": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10,
                    "#00FF00",
                    14,
                    "#00FFFF",
                    18,
                    "#0000FF",
                  ],
                  "line-width": 3,
                  "line-opacity": 0.8,
                }}
              />
            </Source>
          )}

          {/* Range chọn bán kính tìm kiếm */}
          {markerPosition && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                background: "white",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
              }}
            >
              <Form.Label
                style={{ color: "black", fontSize: "15px", fontWeight: "bold" }}
              >
                Bán kính tìm kiếm: {radius}m
              </Form.Label>
              <div className="d-flex mx-2">
                <p
                  style={{
                    color: "black",
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  0km
                </p>
                <Form.Range
                  className="mx-2"
                  min="0"
                  max={10000}
                  step={stepRadius}
                  value={radius}
                  onChange={(e) => {
                    const newRadius = Number(e.target.value);
                    setRadius(newRadius);
                    if (showCircle) {
                      drawCircle(markerPosition, newRadius);
                    }
                  }}
                />
                <p
                  style={{
                    color: "black",
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  10km
                </p>
              </div>
              <Button
                variant="outline-dark"
                onClick={() => handleFilteredHouses()}
              >
                Tìm kiếm
              </Button>

              {/* hiển thị khoảng cách và thời gian di chuyển từ định vị tới nhà đã chọn */}
              {routeInfo && (
                <div
                  className="my-2 pt-3"
                  style={{
                    borderTop: "1px solid #ddd",
                    color: "black",
                    fontSize: "15px",
                  }}
                >
                  <p style={{ margin: 0, fontWeight: "bold" }}>
                    Khoảng cách: {routeInfo.distance} km
                  </p>
                  <p style={{ margin: 0, fontWeight: "bold" }}>
                    Thời gian dự kiến: {routeInfo.duration} phút
                  </p>
                </div>
              )}
              {/* hiển thị nút bay đến FBU */}
              <div className="">
                <Button
                  variant="success "
                  className="mt-1 mx-auto"
                  onClick={() => {
                    if (mapRef.current) {
                      mapRef.current.flyTo({
                        center: [105.7870358500516, 21.032038551131727],
                        zoom: 15,
                        speed: 1.5,
                        curve: 1.5,
                        essential: true,
                      });
                    }
                    //nếu đang trỏ vào 1 bài đăng trên bản đồ thì xóa đi
                    setSelectedHouse(null);
                    const longitude = 105.7870358500516;
                    const latitude = 21.032038551131727;
                    setMarkerPosition({ longitude, latitude });
                  }}
                >
                  <FontAwesomeIcon icon={faGraduationCap} /> Đặt định vị tại FBU
                </Button>
              </div>
            </div>
          )}

          {/* Đường đi từ định vị đến nhà đã chọn */}
          {route && (
            <Source
              id="route"
              type="geojson"
              data={{ type: "Feature", geometry: route }}
            >
              <Layer
                id="route-line"
                type="line"
                layout={{
                  "line-cap": "round",
                  "line-join": "round",
                }}
                paint={{
                  "line-color": "blue", // Màu xanh dương nổi bật
                  "line-width": 10, // Độ dày của đường
                  "line-opacity": 0.8, // Độ trong suốt
                  // "line-blur": 2, // Hiệu ứng làm mờ nhẹ
                }}
              />
            </Source>
          )}

          <NavigationControl position="top-right" />
        </Map>
      </div>
      <HouseDetailModal
        houseId={selectedHouseId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Ẩn modal khi đóng
      />{" "}
    </>
  );
};

export default MapComponent;
