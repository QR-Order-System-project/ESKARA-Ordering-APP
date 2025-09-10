import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://eskara-ordering-app.onrender.com"
});

export default client;