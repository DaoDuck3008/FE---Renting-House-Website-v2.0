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
    console.log(`Tọa độ: ${lat}, ${lng}`);
    return { lat, lng };
  } else {
    console.error("Không tìm thấy tọa độ cho địa chỉ này.");
    return null;
  }
};

const getAllHouse = async () => {
  return await axios.get(`http://localhost:2000/api/v1/posts/read-all`);
};

export { getAllHouse, getCoordinates };
