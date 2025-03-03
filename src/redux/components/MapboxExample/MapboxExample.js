import React, { useState, useEffect } from "react";
import Map, { NavigationControl, Marker } from "react-map-gl";
import { getAllHouse, getCoordinates } from "../../services/MapService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const MapboxExample = () => {
  const [viewState, setViewState] = useState({
    longitude: 105.854444, // Hà Nội
    latitude: 21.028511,
    zoom: 12,
  });

  // const [addresses, setAddresses] = useState([]);

  const fetchAllHouse = async () => {
    const allHouse = await getAllHouse();
    if (allHouse && allHouse.data && +allHouse.data.EC === 0) {
      const addresses = [
        ...allHouse.data.DT.map((house) => getCoordinates(house.address)),
      ];
      console.log(">>> check addressess: ", addresses);

      // Biến đổi địa chỉ sang dạng tọa độ
    }
  };

  useEffect(() => {
    fetchAllHouse();
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)} // Cập nhật state khi kéo bản đồ
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: "100%", height: "100%" }}
      >
        <Marker longitude={105.854444} latitude={21.028511} anchor="bottom">
          <FontAwesomeIcon
            style={{ color: "red" }}
            icon={faLocationDot}
            size="lg"
          />
        </Marker>

        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
};

export default MapboxExample;
