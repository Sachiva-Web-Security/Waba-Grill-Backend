const axios = require("axios");
const db = require("../config/db"); // apna DB connection file

// Distance formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const checkDelivery = async (req, res) => {
  try {
    const { user_id, street, apartment, zip } = req.body;

    if (!zip || !street || !user_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Restaurant data DB se lo
    const [restaurant] = await db.query(
      "SELECT * FROM restaurant_settings LIMIT 1"
    );

    if (!restaurant.length) {
      return res.status(500).json({ message: "Restaurant settings not found" });
    }

    const {
      latitude: restaurantLat,
      longitude: restaurantLng,
      delivery_radius_km
    } = restaurant[0];

    // 2️⃣ User location free API se lo
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${zip} India&format=json&limit=1`,
      {
        headers: { "User-Agent": "restro-app" }
      }
    );

    if (!response.data.length) {
      return res.status(400).json({ message: "Invalid PIN code" });
    }

    const userLat = parseFloat(response.data[0].lat);
    const userLng = parseFloat(response.data[0].lon);

    // 3️⃣ Distance calculate
    const distance = calculateDistance(
      restaurantLat,
      restaurantLng,
      userLat,
      userLng
    );

    const isWithin = distance <= delivery_radius_km;

    // 4️⃣ user_addresses table me save
    await db.query(
      `INSERT INTO user_addresses 
      (user_id, street, apartment, zip, latitude, longitude, distance_km, is_within_radius)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        street,
        apartment,
        zip,
        userLat,
        userLng,
        distance.toFixed(2),
        isWithin
      ]
    );

    // 5️⃣ delivery_logs me save
    await db.query(
      `INSERT INTO delivery_logs 
      (user_id, zip, distance_km, allowed)
      VALUES (?, ?, ?, ?)`,
      [
        user_id,
        zip,
        distance.toFixed(2),
        isWithin
      ]
    );

    // 6️⃣ Response bhejo
    res.json({
      available: isWithin,
      distance: distance.toFixed(2)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { checkDelivery };