import axios from "axios";

const getCoordinates = async (address) => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
  );
  const data = await response.json();

  if (data.features.length > 0) {
    const [lng, lat] = data.features[0].center;
    // console.log(`Tọa độ: ${lat}, ${lng}`);
    return { lat, lng };
  } else {
    console.error("Không tìm thấy tọa độ cho địa chỉ này.");
    return null;
  }
};

const fetchRoute = async (start, end) => {
  const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${accessToken}`;

  const response = await fetch(url);
  const data = await response.json();
  return data.routes[0];
};

const getAllHouse = async (query) => {
  return await axios.get(
    `http://localhost:2000/api/v1/posts/read-all?${query}`
  );
};

const giveFilterHouseToBE = async (filterHouseData) => {
  const queryFilterData = new URLSearchParams(filterHouseData).toString();
  return await axios.get(
    `http://localhost:2000/api/v1/posts/read?${queryFilterData}`,
    {
      withCredentials: true,
    }
  );
};

export { getAllHouse, fetchRoute, getCoordinates, giveFilterHouseToBE };
