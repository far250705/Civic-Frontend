import axios from "axios";

// Replace with your backend server URL
const API = axios.create({
  baseURL: "http://172.16.11.207:5000/api/auth", // For Android Emulator
  // baseURL: "http://localhost:5000/api/auth", // For iOS Simulator
  // baseURL: "http://<YOUR-IP>:5000/api/auth", // For real device
});

export default API;
